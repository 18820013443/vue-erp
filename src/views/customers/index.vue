<template>
  <div class="app-container">
    <div class="app-container-filter-button">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input
            v-model="listQuery.name"
            class="full-width"
            placeholder="客户姓名"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.address"
            class="full-width"
            placeholder="客户地址"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.phone"
            class="full-width"
            placeholder="客户电话"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-button class="font-bold" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="font-bold" type="info" icon="el-icon-set-up" @click="resetFilter">重置</el-button>
            <el-button class="font-bold" type="success" icon="el-icon-plus" @click="createCustomerFn">新增</el-button>
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
      highlight-current-row
    >
      <el-table-column
        align="center"
        prop="id"
        label="ID"
        width="95"
      />
      <el-table-column
        align="center"
        prop="name"
        label="客户姓名"
      />
      <el-table-column
        align="center"
        prop="address"
        label="客户地址"
      />
      <el-table-column
        align="center"
        prop="phone"
        label="客户电话"
      />
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-button
              class="el-button el-button--primary el-button--mini is-plain operation-small-button"
              type="primary"
              @click="editCustomer(scope.row)"
            ><i class="el-icon-edit" />编辑
            </el-button>
            <el-button
              class="el-button el-button--danger el-button--mini is-plain operation-small-button"
              type="danger"
              @click="deleteCustomerFn(scope.row)"
            ><i class="el-icon-delete" />删除
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="formTitle" :visible.sync="dialogAddUpdateCustomerVisible">
      <el-divider class="postForm-el-divider-header" />
      <div slot="footer" class="dialog-footer">
        <CustomersAddUpdate ref="CustomersRef" :customers-form="currentEditCustomer" />
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchCustomers, reviseCustomer, fetchCustomer, createCustomer, deleteCustomer } from '@/api/erp/sales'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import CustomersAddUpdate from '@/views/customers/addupdate'
import { Message } from 'element-ui'

export default {
  components: { Pagination, CustomersAddUpdate },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        address: undefined,
        phone: undefined
      },
      list: null,
      listLoading: true,
      showCreateCustomerDialog: false,
      total: 0,
      formTitle: '',
      currentEditCustomer: {},
      dialogAddUpdateCustomerVisible: false,
      clickEditOrCreate: 'edit'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchCustomers(this.listQuery).then(
        response => {
          this.listLoading = true
          this.list = response.results
          this.total = response.count
          this.listLoading = false
        })
    },
    handleFilter() {
      fetchCustomers(this.listQuery).then(response => {
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
        name: undefined,
        address: undefined,
        phone: undefined
      }
      this.getList()
    },
    editCustomer(item) {
      this.clickEditOrCreate = 'edit'
      this.formTitle = '客户编辑'
      this.getSingleCustomer(item.id)
      this.dialogAddUpdateCustomerVisible = true
    },
    getSingleCustomer(id) {
      fetchCustomer(id).then((response) => {
        this.listLoading = true
        this.currentEditCustomer = Object.assign({}, response)
        this.listLoading = false
      })
    },
    saveForm() {
      this.$refs.CustomersRef.$refs.customersForm.validate(valid => {
        if (valid) {
          const customer = this.currentEditCustomer
          console.log(customer)
          var savePromise = this.clickEditOrCreate === 'edit' ? reviseCustomer(customer.id, customer) : createCustomer(customer)
          savePromise.then(
            (res) => {
              this.dialogAddUpdateCustomerVisible = false
              this.getList()
              this.$refs.CustomersRef.resetCustomersFormFields()
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
      this.dialogAddUpdateCustomerVisible = false
      this.$refs.CustomersRef.resetCustomersFormFields()
    },
    createCustomerFn() {
      this.formTitle = '新建客户'
      this.clickEditOrCreate = 'new'
      this.currentEditCustomer = {
        name: '',
        address: '',
        phone: ''
      }
      this.dialogAddUpdateCustomerVisible = true
    },
    deleteCustomerFn(item) {
      var delCustomer = (cb) => deleteCustomer(item.id).then(
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
        delCustomer(() => {
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

