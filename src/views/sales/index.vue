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
    <el-dialog :title="formTitle" :visible.sync="dialogAddUpdateOrderVisible" @close="resetForm">
      <el-divider class="postForm-el-divider-header" />
      <div slot="footer" class="dialog-footer">
        <orderAddUpdate ref="orderRef" :order-form="currentEditOrder" :is-edit-or-delete="clickNewEditOrDelete" />
        <el-button @click="dialogAddUpdateOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <h3> {{ dicSpan }} </h3> -->
    <!-- :row-class-name="rowClassName" // 动态给行添加样式
    @cell-mouse-enter="handleMouseEnter" // 单元格移入事件
    :row-class-name="rowClassName"
    @cell-mouse-leave="handleMouseLeave" // 单元格移出事件 -->
    <!-- highlight-current-row -->
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
        label="数量"
        :width="90"
      />
      <el-table-column
        align="center"
        prop="price"
        label="单价"
        :width="90"
      />
      <el-table-column
        align="center"
        prop="total_price"
        label="总价"
        :width="minColumnWidth"
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
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-button
              class="el-button el-button--primary el-button--mini is-plain operation-small-button"
              type="primary"
              @click="editOrder(scope.row)"
            ><i class="el-icon-edit" />编辑
            </el-button>
            <el-button
              class="el-button el-button--info el-button--mini is-plain operation-small-button"
              type="success"
            ><i class="el-icon-document" />发货
            </el-button>
            <el-button
              class="el-button el-button--danger el-button--mini is-plain operation-small-button"
              type="danger"
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
import { fetchList } from '@/api/erp/sales'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import OrderAddUpdate from './orders/addupdate'
import { fetchOrder, reviseOrder, createOrder } from '@/api/erp/sales'
// import { reviseOrder } from '@/api/erp/sales'
// import { createOrder } from '@/api/erp/sales'
import { Message } from 'element-ui'
// import qs from 'qs'

export default {
  components: { Pagination, OrderAddUpdate },
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
        limit: 20,
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
        '总价',
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
        let total_price = 0
        const orderDetails = results[index]['order_detail']
        orderDetails.forEach(val => {
          total_price += val['total_price']
        })
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
          objRes.price = results[index].order_detail[i].price
          // objRes.total_price = results[index].order_detail[i].total_price
          objRes.total_price = total_price
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
    // 点击编辑按钮
    editOrder(item) {
      this.clickNewEditOrDelete = 'edit'
      this.formTitle = '编辑订单'
      this.currentEditOrder.orderId = item.id
      this.getSingleOrder(item.id)
      this.dialogAddUpdateOrderVisible = true
    },
    // 根据id获取订单
    getSingleOrder(id) {
      if (!id) return
      fetchOrder(id).then((response) => {
        this.listLoading = true
        this.currentEditOrder = Object.assign({}, this.currentEditOrder, response) // 合并对象
        // console.log(this.currentEditOrder)
        this.listLoading = false
      })
    },
    // 保存新建订单表单
    saveForm() {
      // this.$refs.orderRef.dialogFormSave()
      this.$refs.orderRef.$refs.orderForm.validate(valid => {
        if (valid) {
          var order = this.$refs.orderRef.orderForm
          // order.order_date = new Date()
          // console.log(order)
          var savePromise = this.clickNewEditOrDelete === 'edit' ? reviseOrder(order.id, order) : createOrder(order)
          savePromise.then(
            (res) => {
              this.dialogAddUpdateOrderVisible = false
              this.getList()
            },
            (response) => {
              Message({
                // message: this.clickNewEditOrDelete === 'edit' ? '创建订单失败!' : '修改订单失败!',
                message: response.message,
                type: 'error'
                // duration: 5 * 1000
              })
            }
          )
        } else {
          console.log('invalid')
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.orderRef.$refs.orderForm.resetFields()
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
    // 给对应的rowIndex添加类名
    // rowClassName({ row, rowIndex }) {
    //   let r = -1
    //   // let s = -1
    //   if (this.eventStatus === 'cellhover') {
    //     this.list.forEach(item => {
    //       if (this.cellIndex === row.order) {
    //         r = rowIndex
    //       }
    //     })
    //     if (rowIndex === r) {
    //       return 'hover-row'
    //     }
    //   }
    //   if (this.cellClickIndex !== -1) {
    //     if (row.order === this.cellClickIndex) {
    //       return 'current-row'
    //     }
    //   }
    //   console.log(this.cellClickIndex)
    //   if (this.eventStatus === 'cellclick') {
    //     if (row.order === this.cellClickIndex) {
    //       return 'current-row'
    //     }
    //   }
    // },
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
    }
    // 将对象dicSpan转化为list
    // convertDicSpanToList(dicSpan) {
    //   for (var key in this.dicSpan) {
    //     const indexList = []
    //     indexList.push(parseInt(key))
    //     if (dicSpan[key] > 1) {
    //       for (let i = 0; i < dicSpan[key] - 1; i++) {
    //         indexList.push(parseInt(key) + i + 1)
    //       }
    //     }
    //     this.tableIndex.push(indexList)
    //   }
    // }
  }
}
</script>
