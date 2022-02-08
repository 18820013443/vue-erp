<template>
  <div>
    <el-form ref="orderDetailForm" :model="orderDetailForm" :rules="orderDetailFormRules" label-width="85px">
      <el-form-item label="款号:" prop="clothe_num">
        <el-input v-model="orderDetailForm.clothe_num" placeholder="请输入款号" @change="changedColtheNumOrColor" />
      </el-form-item>
      <el-form-item label="颜色:" prop="color">
        <el-input v-model="orderDetailForm.color" placeholder="请输入颜色" @change="changedColtheNumOrColor" />
      </el-form-item>
      <el-form-item label="订单数量:" prop="amount">
        <el-input v-model.number="orderDetailForm.amount" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="单价:" prop="price">
        <el-input v-model="orderDetailForm.price" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入单价" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'OrderUpdateDetail',
  props: {
    orderDetailForm: {
      type: Object,
      required: true
    }
  },
  data() {
    const validatePrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('价格不能为空'))
      } else if (value.toString().indexOf('.') !== -1 && value.split('.').length > 2) {
        callback(new Error('请输入正确格式的金额')) // 防止输入多个小数点
      } else if (value.toString().indexOf('.') !== -1 && value.split('.')[1].length > 2) {
        callback(new Error('请输入正确的小数位数')) // 小数点后两位
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
        price: [{ type: 'string', required: true, trigger: 'blur', validator: validatePrice }]
      }
    }
  },
  methods: {
    changedColtheNumOrColor() {
      this.$emit('changedColtheNumOrColor', '修改了款号或者是颜色')
      // console.log('colthe num is changed')
    }
  }
}
</script>
