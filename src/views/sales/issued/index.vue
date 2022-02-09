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
            placeholder="选择订单日期"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.customer"
            class="full-width"
            placeholder="客户姓名"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="3">
          <el-switch
            v-model="listQuery.issued_all"
            class="issue-switch"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="已发货"
            inactive-text="未发货"
          />
        </el-col>
        <el-col :span="5">
          <el-row>
            <el-button class="font-bold" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="font-bold" type="info" icon="el-icon-set-up" @click="resetFilter">重置</el-button>
            <el-button class="font-bold" type="success" icon="el-icon-plus" @click="showCreateOrderDialog">新增</el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- <el-divider /> -->

    <!-- 新建订单dialog或者是编辑订单 -->
    <!-- <el-dialog :title="formTitle" :visible.sync="dialogAddUpdateOrderVisible" @close="resetForm"> -->
    <el-dialog :title="formTitle" :visible.sync="dialogAddUpdateOrderVisible">
      <el-divider class="postForm-el-divider-header" />
      <div slot="footer" class="dialog-footer">
        <OrderIssuedAddUpdate ref="orderRef" :order-issued-form="currentEditOrder" :is-edit-or-delete="clickNewEditOrDelete" />
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <h3> {{ dicSpan }} </h3> -->
    <el-table
      ref="tTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :span-method="objectSpanMethod"
      element-loading-text="玩命加载中"
      border
      fit
      style="width: 100%;"
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
      @cell-click="handleCellClick"
    >
      <el-table-column
        align="center"
        prop="id"
        label="ID"
        width="95"
      />
      <el-table-column
        align="center"
        prop="order_date"
        label="订单日期"
        width="120"
      />
      <el-table-column
        align="center"
        prop="order_num"
        label="订单号码"
        :width="minColumnWidth"
      />
      <el-table-column
        align="center"
        prop="name"
        label="客户姓名"
        :width="120"
      />
      <el-table-column
        align="center"
        prop="phone"
        label="客户电话"
        width="115"
      />
      <el-table-column
        align="center"
        prop="address"
        label="客户地址"
        :width="minColumnWidth"
      />
      <el-table-column
        align="center"
        prop="clothe_num"
        label="款号"
        :width="90"
      />
      <el-table-column
        align="center"
        prop="color"
        label="颜色"
        :width="90"
      />
      <el-table-column
        align="center"
        prop="amount"
        label="订单数量"
        :width="90"
      />
      <el-table-column
        align="center"
        prop="issued_num"
        label="发货数量"
        :width="90"
      />
      <el-table-column
        align="center"
        prop="pending_num"
        label="欠货数量"
        :width="90"
      />
      <el-table-column align="center" label="已发货">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.issued_all"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="部分发货">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.issued_partial"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-button
              class="el-button el-button--info el-button--mini is-plain operation-small-button"
              type="success"
              @click="issueOrder(scope.row)"
            ><i class="el-icon-document" />发货
            </el-button>
            <el-button
              class="el-button el-button--danger el-button--mini is-plain operation-small-button"
              type="danger"
              @click="orderDelete(scope.row)"
            ><i class="el-icon-delete" />删除
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import OrderIssuedAddUpdate from './addupdate'
import { fetchData, deleteIssuedOrder, fetchIssuedOrder, reviseIssuedOrder } from '@/api/erp/sales'
import { Message } from 'element-ui'

export default {
  components: { Pagination, OrderIssuedAddUpdate },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        date: undefined,
        customer: undefined,
        issued_all: undefined
        // sort: '+id'
      },
      mergedColumnLabels: [
        'ID',
        '订单日期',
        '订单号码',
        '客户姓名',
        '客户电话',
        '客户地址',
        '已发货',
        '部分发货',
        '操作'
      ],
      dicSpan: {},
      minColumnWidth: 150,
      dialogAddUpdateOrderVisible: false,
      // createOrderForm: {},
      formTitle: '',
      currentEditOrder: {
        name: '',
        phone: '',
        address: ''
      },
      clickNewEditOrDelete: '',
      cellIndex: -1,
      cellClickIndex: -1
    }
  },
  watch: {
    // 用来监视鼠标进出table
    cellIndex: {
      handler(newValue, oldValue) {
        if (newValue === -1) {
          this.removeClassName('hover-row')
        } else {
          this.addClassName(newValue, 'hover-row')
        }
      }
    },
    // 用来监视是否点击table
    cellClickIndex: {
      handler(newValue, oldValue) {
        if (newValue !== -1) {
          this.addClassName(newValue, 'current-row')
        }
      }
    },
    page: {
      handler(newvalue, oldvalue) {
        this.cellClickIndex = -1
        this.removeClassName('current-row')
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchData(this.listQuery).then(response => {
        var results = response.results
        this.list = this.expandResultsList(results)
        this.getSpanDic()
        // this.convertDicSpanToList(this.dicSpan)
        this.total = response.count
        this.listLoading = false
      })
    },
    expandResultsList(results) {
      const resList = []
      for (var index = 0; index < results.length; index++) {
        for (var i = 0; i < results[index].order_detail.length; i++) {
          var objRes = {}
          objRes.id = results[index].id
          objRes.order_date = results[index].order_date
          objRes.order_num = results[index].order_num
          objRes.name = results[index].name
          objRes.phone = results[index].phone
          objRes.address = results[index].address
          objRes.issued_all = results[index].issued_all
          objRes.clothe_num = results[index].order_detail[i].clothe_num
          objRes.color = results[index].order_detail[i].color
          objRes.amount = results[index].order_detail[i].amount
          objRes.issued_num = results[index].order_detail[i].issued_num
          objRes.pending_num = results[index].order_detail[i].pending_num
          resList.push(objRes)
        }
      }
      return resList
    },
    getSpanDic() {
    // let spanDic = new Object(); //字典：key记录要合并行的首行，value记录要合并的行数
      this.dicSpan = {}
      let index = 0
      const listRows = this.list.length // 要被渲染的数组的长度
      let id = -1 // 设置一个比第一行0小的数字，这样就可以将第一行赋值进去
      let rowIndex = 0 // 记录要合并的首行
      let spanRows = 1 // 合并的行数
      let order = 1

      while (index < listRows) {
        if (this.list[index].id === id) {
          spanRows++
          this.list[index].order = order // 用于鼠标hover的时候高亮所有合并的行
        } else {
          order++
          rowIndex = index
          id = this.list[index].id
          this.list[index].order = order // 用于鼠标hover的时候高亮所有合并的行
          spanRows = 1 // 找到与上一个不同的首行，重置spanRows = 1
        }
        this.dicSpan[rowIndex] = spanRows
        index++
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    // if (Object.keys(this.dicSpan).indexOf(rowIndex.toString()) != -1) {
      if (this.mergedColumnLabels.indexOf(column.label) !== -1) {
        const _row = Object.keys(this.dicSpan).indexOf(rowIndex.toString()) >= 0 ? this.dicSpan[rowIndex.toString()] : 0
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 请求数据时候带上filter
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置filter
    resetFilter() {
      this.listQuery = {}
      this.getList()
    },
    // 展示新建订单的对话框
    showCreateOrderDialog() {
      this.clickNewEditOrDelete = 'new'
      this.currentEditOrder = { 'name': '', 'phone': '', 'address': '' }
      this.currentEditOrder = Object.assign({}, { order_date: new Date() }, this.currentEditOrder)
      this.formTitle = '新建订单'
      this.dialogAddUpdateOrderVisible = true
    },
    // 根据id获取Issued订单
    getSingleIssuedOrder(id) {
      if (!id) return
      fetchIssuedOrder(id).then((response) => {
        this.listLoading = true
        this.currentEditOrder = Object.assign({}, this.currentEditOrder, response) // 合并对象
        this.listLoading = false
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.orderRef.$refs.orderIssuedForm.resetFields()
    },
    // 保存新建订单表单
    saveForm() {
      var order = this.$refs.orderRef.orderIssuedForm
      var savePromise = reviseIssuedOrder(order.id, order)
      savePromise.then(
        res => {
          this.dialogAddUpdateOrderVisible = false
          this.getList()
          this.resetForm()
          this.$message({
            type: 'success',
            message: '发货成功'
          })
        },
        response => {
          Message({
            message: response.message,
            type: 'error'
          })
        }
      )
    },
    // 取消表单
    cancelForm() {
      this.dialogAddUpdateOrderVisible = false
      this.resetForm()
    },
    // 鼠标进入事件
    handleMouseEnter(row, column, cell, event) {
      this.eventStatus = 'cellhover'
      this.list.forEach(item => {
        if (row.order === item.order) {
          this.cellIndex = row.order
        }
      })
    },
    // 鼠标离开
    handleMouseLeave(row, column, cell, event) {
      this.cellIndex = -1
    },
    // 鼠标单击
    handleCellClick(row, column, cell, event) {
      if (row.order !== this.cellClickIndex) { // 点击的row与之前的row不同
        this.list.forEach(item => {
          if (row.order === item.order) {
            this.cellClickIndex = row.order
          }
        })
      } else {
        this.addClassName(this.cellClickIndex, 'current-row')
      }
    },
    addClassName(newValue, className) {
      this.$nextTick(() => {
        let rows = this.$refs.tTable.$el.querySelectorAll('tbody>tr.el-table__row')
        if (rows.length) {
          rows = Array.from(rows)
          // console.log(rows)
          // console.log(this.$refs.tTable)
          rows.forEach(item => item.classList.remove(className)) // 先去除所有的hover row属性
          rows.forEach(item => {
            if (this.$refs.tTable.data[item.rowIndex].order === newValue) {
              // console.log(newValue)
              item.classList.add(className)
            }
          })
        }
      })
    },
    removeClassName(className) {
      this.$nextTick(() => {
        let rows = this.$refs.tTable.$el.querySelectorAll('tbody>tr.el-table__row')
        if (rows.length) {
          rows = Array.from(rows)
          rows.forEach(item => item.classList.remove(className))
        }
      })
    },
    // 改变page页删除current-row
    changecurrentpage() {
      this.removeClassName('current-row')
    },
    // 删除订单
    orderDelete(row) {
      var deleteHandler = (cb) => deleteIssuedOrder(row.id).then( // 当箭头函数体只有一个`return`语句时，可以省略`return`关键字和方法体的花括号
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
        deleteHandler(() => {
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
    },
    issueOrder(item) {
      this.clickNewEditOrDelete = 'editor'
      this.formTitle = '编辑发货'
      this.currentEditOrder.orderId = item.id
      this.getSingleIssuedOrder(item.id)
      this.dialogAddUpdateOrderVisible = true
    }
  }
}
</script>
