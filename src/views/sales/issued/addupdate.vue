<template>
  <el-form ref="orderIssuedForm" :model="orderIssuedForm" :rules="orderRules" label-width="85px">
    <el-form-item v-if="!!orderIssuedForm.orderId" label="订单号码:">
      <el-input v-model="orderIssuedForm.order_num" placeholder="请输入订单号码" disabled />
    </el-form-item>
    <!-- <h3> {{ order }} </h3> -->
    <el-form-item label="订单日期:" :required="true">
      <el-date-picker
        v-model="orderIssuedForm.order_date"
        type="date"
        placeholder="订单日期"
        class="full-width"
        disabled
      />
    </el-form-item>
    <!-- <el-form-item label="已发货:">
      <el-switch
        v-model="orderIssuedForm.issued_all"
        class="postForm-el-switch"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item> -->
    <el-form-item label="客户姓名:" prop="name">
      <el-input v-model="orderIssuedForm.name" placeholder="请输入客户姓名" auto-complete="off" disabled />
    </el-form-item>
    <el-form-item label="客户电话:" prop="phone">
      <el-input v-model="orderIssuedForm.phone" placeholder="请输入客户电话" auto-complete="off" disabled />
    </el-form-item>
    <el-form-item label="客户地址:" prop="address">
      <el-input v-model="orderIssuedForm.address" placeholder="请输入客户地址" auto-complete="off" disabled />
    </el-form-item>

    <!-- <el-divider class="postForm-el-divider-middle" /> -->
    <!-- <h3> {{ orderIssuedForm }} </h3> -->
    <!-- <el-button type="success" icon="el-icon-plus" class="postForm-create-button" @click="AddOrderItem">新增</el-button> -->
    <!-- <el-button type="success" icon="el-icon-plus" class="postForm-create-button" @click="dialogFormSave">测试</el-button> -->
    <el-divider class="postForm-el-divider-middle" />

    <el-dialog title="订单发货详情编辑" :visible.sync="dialogAddOrderItemVisible" append-to-body>
      <el-divider class="postForm-el-divider-header" />
      <OrderIssuedUpdateDetail ref="orderDetailRef" :order-detail-form="orderDetailEdit" />
      <el-divider class="postForm-el-divider-middle" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogDetailFormSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="orderIssuedForm.order_detail"
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
        prop="amount"
        label="订单数量"
        width="110px"
      />
      <el-table-column
        align="center"
        prop="issued_num"
        label="发货数量"
        width="110px"
      />
      <el-table-column
        align="center"
        prop="inventory_num"
        label="库存数量"
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
import OrderIssuedUpdateDetail from './addupdatedetail'
import { isValidPhone } from '@/utils/validate'

export default {
  name: 'OrderIssuedAddUpdate',
  components: { OrderIssuedUpdateDetail },
  props: {
    orderIssuedForm: {
      type: Object,
      required: true
    }
    // isEditOrDelete: {
    //   type: String,
    //   required: true
    // }
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
      detailTableId: 0,
      addOrEditStatus: '',
      initialIssuedNum: 0
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
    // Detail表单保存
    dialogDetailFormSave() {
      this.$refs.orderDetailRef.$refs.orderIssuedDetailForm.validate(valid => {
        // console.log(this.$refs.orderDetailRef.$refs)
        if (valid) {
          this.orderIssuedForm.order_detail[this.detailTableId].issued_num = this.$refs.orderDetailRef.orderIssuedDetailForm.issued_num
          this.dialogAddOrderItemVisible = false
        } else {
          console.log('not valid')
        }
      })
    },
    // Detail表单取消
    dialogDetailFormCancel() {
      // this.orderDetailEdit = JSON.parse(JSON.stringify(this.DetailFormMiddleData))
      this.dialogAddOrderItemVisible = false
      // this.resetOrderDetailForm()
      console.log('cancel:' + this.initialIssuedNum)
      this.$refs.orderDetailRef.$refs.orderIssuedDetailForm.resetFields()
      this.$refs.orderDetailRef.orderIssuedDetailForm.issued_num = this.initialIssuedNum
    },
    // 重置第一个表单
    resetOrderForm() {
      this.$refs.orderIssuedForm.resetFields()
    },
    // 关闭第二个表单时重置field
    resetOrderDetailForm() {
      // console.log('kkk' + this.initialIssuedNum)
      this.$refs.orderDetailRef.orderIssuedDetailForm.issued_num = this.initialIssuedNum
    },
    // 编辑当前OrderDetailItem
    editOrderDetailItem(item, index) {
      // this.orderDetailEdit = item
      // this.orderDetailEdit = JSON.parse(JSON.stringify(item)) // 深拷贝scope中的数据
      this.addOrEditStatus = 'edit'
      this.detailTableId = index
      this.orderDetailEdit = Object.assign(this.orderDetailEdit, item)
      // console.log('kkk' + this.initialIssuedNum)
      this.initialIssuedNum = this.orderDetailEdit.issued_num
      this.dialogAddOrderItemVisible = true
    },
    // 删除当前OrderDetailItem
    deleteOrderDetailItem(item) {
      var array = this.orderIssuedForm.order_detail || []
      array.splice(array.indexOf(item), 1)
    },
    // 查找款号和颜色是否已经在orderDetail中
    checkItemExists(clothe_num, color) {
      var isItemExists = false
      // 新建订单时，order_detail为空
      if (!this.orderIssuedForm.order_detail) return isItemExists
      var orderDetail = this.orderIssuedForm.order_detail
      for (var i = 0; i < orderDetail.length; i++) {
        if (orderDetail[i].clothe_num === clothe_num && orderDetail[i].color === color) {
          isItemExists = true
        }
      }
      return isItemExists
    }
  }
}
</script>
