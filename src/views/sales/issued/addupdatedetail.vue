<template>
  <div>
    <!-- <h3> {{ orderDetailForm }} </h3> -->
    <!-- <h3> {{ issued_num }} </h3> -->
    <el-form ref="orderIssuedDetailForm" :model="orderIssuedDetailForm" :rules="orderDetailFormRules" label-width="85px">
      <el-form-item label="款号:" prop="clothe_num">
        <el-input v-model="orderIssuedDetailForm.clothe_num" placeholder="请输入款号" disabled />
      </el-form-item>
      <el-form-item label="颜色:" prop="color">
        <el-input v-model="orderIssuedDetailForm.color" placeholder="请输入颜色" disabled />
      </el-form-item>
      <el-form-item label="订单数量:" prop="amount">
        <el-input v-model.number="orderIssuedDetailForm.amount" disabled oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="发货数量:" prop="issued_num">
        <!-- <el-input v-model.number="orderDetailForm.issued_num" placeholder="请输入发货数量" @input="value=change($event)" /> -->
        <el-input id="issuedNum" v-model.number="orderIssuedDetailForm.issued_num" placeholder="请输入发货数量" @input="value=change($event)" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'OrderIssuedUpdateDetail',
  props: {
    orderDetailForm: {
      type: Object,
      required: true
    }
  },
  data() {
    const validateIssuedNum = (rule, value, callback) => {
    //   console.log(this.orderDetailForm.amount)
      console.log(value)
      value = this.orderIssuedDetailForm.issued_num
      if (!value) {
        callback('发货数量不能为空')
      }
      if (!(/^-?\d*\.?\d*$/).test(value)) {
        callback('发货数量必须是整数')
      }
      if (parseInt(value) > this.orderIssuedDetailForm.amount) {
        callback(new Error('发货数量不能大于订单数量'))
      } else {
        callback()
      }
    }
    return {
      orderDetailFormRules: {
        clothe_num: [
          { required: true, message: '请输入款号', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        amount: [
          { required: true, type: 'integer', message: '请输入不小于0的整数', min: 1, trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请输入颜色', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        issued_num: [{ type: 'integer', required: true, trigger: 'blur', validator: validateIssuedNum }]
      },
      orderIssuedDetailForm: this.orderDetailForm
    }
  },
  methods: {
    change(event) {
      this.$forceUpdate()
    },
    resetOrderDetailForm() {
      this.$refs.orderIssuedDetailForm.resetFields()
    }
  }
}
</script>
