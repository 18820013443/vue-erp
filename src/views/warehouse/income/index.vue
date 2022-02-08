<template>
  <div class="app-container">
    <div class="app-container-filter-button">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-date-picker
            v-model="listQuery.date"
            value-format="yyyy-MM-dd"
            class="full-width"
            type="date"
            placeholder="选择入库日期"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.number"
            class="full-width"
            placeholder="请输入款号"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.color"
            class="full-width"
            placeholder="请输入颜色"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-button class="font-bold" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="font-bold" type="info" icon="el-icon-set-up" @click="resetFilter">重置</el-button>
            <el-button class="font-bold" type="success" icon="el-icon-plus" @click="createIncomeFn">新增</el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      element-loading-text="玩命加载中"
      style="width: 100%;"
      fit
    >
      <el-table-column
        prop="id"
        label="ID"
        align="center"
        width="95"
      />
      <el-table-column
        prop="date"
        label="入库日期"
        align="center"
      />
      <el-table-column
        prop="bag_num"
        label="包号"
        align="center"
      />
      <el-table-column
        prop="clothe_num"
        label="款号"
        align="center"
      />
      <el-table-column
        prop="color"
        label="颜色"
        align="center"
      />
      <el-table-column
        prop="amount"
        label="数量"
        align="center"
      />
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-button
              class="el-button el-button--primary el-button--mini is-plain operation-small-button"
              type="primary"
              @click="editIncome(scope.row)"
            ><i class="el-icon-edit" />编辑
            </el-button>
            <el-button
              class="el-button el-button--danger el-button--mini is-plain operation-small-button"
              type="danger"
              @click="deleteIncomeFn(scope.row)"
            ><i class="el-icon-delete" />删除
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="formTitle" :visible.sync="dialogAddUpdateIncomeVisible">
      <el-divider class="postForm-el-divider-header" />
      <div slot="footer" class="dialog-footer">
        <IncomeAddUpdate ref="IncomeRef" :income-form="currentEditIncome" />
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchIncomes, fetchIncome, reviseIncome, deleteIncome, createIncome } from '@/api/erp/sales'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'
import IncomeAddUpdate from './addupdate'

export default {
  components: { Pagination, IncomeAddUpdate },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        date: undefined,
        number: undefined,
        color: undefined
      },
      list: null,
      listLoading: true,
      showCreateIncomeDialog: false,
      total: 0,
      clickEditOrCreate: 'edit',
      currentEditIncome: {},
      formTitle: '',
      dialogAddUpdateIncomeVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchIncomes(this.listQuery).then(
        response => {
          this.listLoading = true
          this.list = response.results
          this.total = response.count
          this.listLoading = false
        })
    },
    handleFilter() {
      fetchIncomes(this.listQuery).then(response => {
        this.listLoading = true
        this.list = response.results
        this.total = response.count
        this.listLoading = false
      })
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        date: undefined,
        number: undefined,
        color: undefined
      }
      this.getList()
    },
    editIncome(item) {
      this.clickEditOrCreate = 'edit'
      this.formTitle = '入库编辑'
      this.getSingleIncome(item.id)
      this.dialogAddUpdateIncomeVisible = true
    },
    getSingleIncome(id) {
      fetchIncome(id).then((response) => {
        this.listLoading = true
        this.currentEditIncome = Object.assign({}, response)
        this.listLoading = false
      })
    },
    saveForm() {
      this.$refs.IncomeRef.$refs.incomeForm.validate(valid => {
        if (valid) {
          const income = this.currentEditIncome
          console.log(income)
          var savePromise = this.clickEditOrCreate === 'edit' ? reviseIncome(income.id, income) : createIncome(income)
          savePromise.then(
            (res) => {
              this.dialogAddUpdateIncomeVisible = false
              this.getList()
              this.$refs.IncomeRef.resetIncomeFormFields()
            },
            (response) => {
              Message({
                message: response.message,
                type: 'error'
              })
            }
          )
        }
      })
    },
    cancelForm() {
      this.dialogAddUpdateIncomeVisible = false
      this.$refs.IncomeRef.resetIncomeFormFields()
    },
    createIncomeFn() {
      this.formTitle = '新建入库'
      this.clickEditOrCreate = 'new'
      this.currentEditIncome = {
        date: new Date(),
        bag_num: undefined,
        clothe_num: undefined,
        color: undefined,
        amount: undefined
      }
      this.dialogAddUpdateIncomeVisible = true
    },
    deleteIncomeFn(item) {
      var del = (cb) => deleteIncome(item.id).then(
        (res) => {
          cb()
          this.getList()
        },
        (error) => {
          Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      )
      this.$confirm('此操作将删除订单，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已经取消删除'
        })
      })
    }
  }
}
</script>

