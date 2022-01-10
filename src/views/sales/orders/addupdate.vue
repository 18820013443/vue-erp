<template>
  <el-form ref="orderForm" :model="orderForm" :rules="orderRules" label-width="85px">
    <el-form-item v-if="!!orderForm.orderId" label="订单号码:">
      <el-input v-model="orderForm.order_num" placeholder="请输入订单号码" disabled />
    </el-form-item>
    <!-- <h3> {{ order }} </h3> -->
    <el-form-item label="订单日期:" :required="true">
      <el-date-picker
        v-model="orderForm.order_date"
        type="date"
        placeholder="订单日期"
        class="full-width"
      />
    </el-form-item>
    <el-form-item label="已发货:">
      <el-switch
        v-model="orderForm.issued_all"
        class="postForm-el-switch"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="客户姓名:" prop="name">
      <el-input v-model="orderForm.name" placeholder="请输入客户姓名" auto-complete="off" />
    </el-form-item>
    <el-form-item label="客户电话:" prop="phone">
      <el-input v-model="orderForm.phone" placeholder="请输入客户电话" auto-complete="off" />
    </el-form-item>
    <el-form-item label="客户地址:" prop="address">
      <el-input v-model="orderForm.address" placeholder="请输入客户地址" auto-complete="off" />
    </el-form-item>

    <el-divider class="postForm-el-divider-middle" />
    <el-button type="success" icon="el-icon-plus" class="postForm-create-button" @click="AddOrderItem">新增</el-button>
    <!-- <el-button type="success" icon="el-icon-plus" class="postForm-create-button" @click="dialogFormSave">测试</el-button> -->
    <el-divider class="postForm-el-divider-middle" />

    <el-dialog title="订单详情编辑" :visible.sync="dialogAddOrderItemVisible" append-to-body>
      <el-divider class="postForm-el-divider-header" />
      <OrderUpdateDetail ref="orderDetailRef" :order-detail-form="orderDetailEdit" @changedColtheNumOrColor="reviseClotheOrColor" />
      <el-divider class="postForm-el-divider-middle" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogDetailFormSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="orderForm.order_detail"
      style="width: 100%"
      border
    >
      <el-table-column
        align="center"
        prop="id"
        label="序号"
        type="index"
        width="70px"
      />
      <el-table-column
        align="center"
        prop="clothe_num"
        label="款号"
      />
      <el-table-column
        align="center"
        prop="color"
        label="颜色"
      />
      <el-table-column
        align="center"
        prop="price"
        label="单价"
        width="110px"
      />
      <el-table-column
        align="center"
        prop="amount"
        label="数量"
        width="110px"
      />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-button
              class="el-button el-button--primary el-button--mini is-plain operation-small-button"
              type="primary"
              @click="editOrderDetailItem(scope.row, scope.$index)"
            ><i class="el-icon-edit" />编辑
            </el-button>
            <el-button
              class="el-button el-button--danger el-button--mini is-plain operation-small-button"
              type="danger"
              @click="deleteOrderDetailItem(scope.row)"
            ><i class="el-icon-delete" />删除
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-divider class="postForm-el-divider-footer" />
  </el-form>

</template>

<script>
import OrderUpdateDetail from './addupdatedetail'
import { isValidPhone } from '@/utils/validate'

export default {
  name: 'OrderAddUpdate',
  components: { OrderUpdateDetail },
  props: {
    orderForm: {
      type: Object,
      required: true
    },
    isEditOrDelete: {
      type: String,
      required: true
    }
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!isValidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      orderDetailEdit: {
        clothe_num: '',
        amount: '',
        color: '',
        price: ''
      },
      dialogAddOrderItemVisible: false,
      addOrderDetail: {},
      listLoading: false,
      orderRules: {
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        phone: [{ required: true, trigger: 'blur', validator: checkPhone }],
        address: [
          { required: true, message: '请输入客户地址', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      orderDetailItem: {},
      changedColtheNumOrColor: false,
      detailTableId: 0,
      addOrEditStatus: ''
      // detailFormTempData: {}
    }
  },
  created() {
  },
  methods: {
    AddOrderItem() {
      this.addOrEditStatus = 'add'
      this.orderDetailEdit = {
        clothe_num: '',
        amount: '',
        color: '',
        price: ''
      }
      // console.log(this.orderDetailEdit)
      this.dialogAddOrderItemVisible = true
    },
    // dialogFormSave() {
    //   this.$refs.orderForm.validate(valid => {
    //     if (valid) {
    //       console.log(valid)
    //       console.log('valid')
    //     } else {
    //       console.log('not valid')
    //     }
    //   })
    // },
    // Detail表单保存
    dialogDetailFormSave() {
      this.$refs.orderDetailRef.$refs.orderDetailForm.validate(valid => {
        if (valid) {
          // 检查是否有相同的款号和颜色，如果有，则提示warning，没有则将数据添加到表格中
          if (this.changedColtheNumOrColor) {
            var isItemExists = this.checkItemExists(this.orderDetailEdit.clothe_num, this.orderDetailEdit.color)
            // console.log('isItemExists:' + isItemExists)
            if (isItemExists) {
              this.$message({
                message: '订单记录中已经包含了同样的款号和颜色',
                type: 'warning'
              })
              return
            }
          }
          // if (this.orderForm.order_detail.indexOf(this.orderDetailEdit) == -1) {
          //   this.orderForm.order_detail.push(this.orderDetailEdit)
          // }
          console.log(this.orderDetailEdit)
          if (this.addOrEditStatus === 'add') {
            if (!this.orderForm.order_detail) this.orderForm.order_detail = []
            this.orderForm.order_detail.push(this.orderDetailEdit)
          } else if (this.addOrEditStatus === 'edit') {
            this.orderForm.order_detail[this.detailTableId].clothe_num = this.orderDetailEdit.clothe_num
            this.orderForm.order_detail[this.detailTableId].amount = this.orderDetailEdit.amount
            this.orderForm.order_detail[this.detailTableId].color = this.orderDetailEdit.color
            this.orderForm.order_detail[this.detailTableId].price = this.orderDetailEdit.price
          }
          this.dialogAddOrderItemVisible = false
          this.changedColtheNumOrColor = false
        } else {
          console.log('not valid')
        }
      })
    },
    // Detail表单取消
    dialogDetailFormCancel() {
      // this.orderDetailEdit = JSON.parse(JSON.stringify(this.DetailFormMiddleData))
      this.dialogAddOrderItemVisible = false
    },
    // 重置第一个表单
    resetOrderForm() {
      this.$refs.orderForm.resetFields()
    },
    // 关闭第二个表单时重置field
    resetOrderDetailForm() {
      this.$refs.orderDetailRef.resetOrderDetailForm()
    },
    // 编辑当前OrderDetailItem
    editOrderDetailItem(item, index) {
      // this.orderDetailEdit = item
      // this.orderDetailEdit = JSON.parse(JSON.stringify(item)) // 深拷贝scope中的数据
      this.addOrEditStatus = 'edit'
      this.detailTableId = index
      // console.log(index)
      this.orderDetailEdit = Object.assign(this.orderDetailEdit, item)
      this.dialogAddOrderItemVisible = true
    },
    // 删除当前OrderDetailItem
    deleteOrderDetailItem(item) {
      var array = this.orderForm.order_detail || []
      array.splice(array.indexOf(item), 1)
    },
    // 查找款号和颜色是否已经在orderDetail中
    checkItemExists(clothe_num, color) {
      var isItemExists = false
      // 新建订单时，order_detail为空
      if (!this.orderForm.order_detail) return isItemExists
      var orderDetail = this.orderForm.order_detail
      for (var i = 0; i < orderDetail.length; i++) {
        if (orderDetail[i].clothe_num === clothe_num && orderDetail[i].color === color) {
          isItemExists = true
        }
      }
      return isItemExists
    },
    // 款号和颜色是否有变化
    reviseClotheOrColor(value) {
      this.changedColtheNumOrColor = true
      // console.log(value)
    }
  }
}
</script>
