<template>
  <el-form ref="customersForm" :model="customersForm" :rules="customersFormRules" label-width="85px">
    <el-form-item label="客户姓名:" prop="name">
      <el-input v-model="customersForm.name" placeholder="请输入客户姓名" />
    </el-form-item>
    <el-form-item label="客户地址:" prop="address">
      <el-input v-model="customersForm.address" placeholder="请输入客户地址" />
    </el-form-item>
    <el-form-item label="客户电话:" prop="phone">
      <el-input v-model="customersForm.phone" placeholder="请输入客户电话" />
    </el-form-item>
  </el-form>
</template>

<script>
import { isValidPhone } from '@/utils/validate'

export default {
  name: 'CustomersAddUpdate',
  props: {
    customersForm: {
      type: Object,
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
      customersFormRules: {
        name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        phone: [{ required: true, trigger: 'blur', validator: checkPhone }],
        address: [
          { required: true, message: '请输入客户地址', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetCustomersFormFields() {
      this.$refs.customersForm.resetfields()
    }
  }
}
</script>
