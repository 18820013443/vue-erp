<template>
  <el-form ref="incomeForm" :model="incomeForm" :rules="incomeFormRules" label-width="85px">
    <el-form-item label="入库日期:" :required="true">
      <el-date-picker
        v-model="incomeForm.date"
        type="date"
        placeholder="入库日期"
        class="full-width"
      />
    </el-form-item>
    <el-form-item label="包号:" prop="bag_num">
      <el-input v-model.number="incomeForm.bag_num" placeholder="请输入包号" />
    </el-form-item>
    <el-form-item label="款号:" prop="clothe_num">
      <el-input v-model="incomeForm.clothe_num" placeholder="请输入款号" />
    </el-form-item>
    <el-form-item label="颜色:" prop="color">
      <el-input v-model="incomeForm.color" placeholder="请输入颜色" />
    </el-form-item>
    <el-form-item label="数量:" prop="amount">
      <el-input v-model.number="incomeForm.amount" placeholder="请输入数量" />
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: 'IncomeAddUpdate',
  props: {
    incomeForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      incomeFormRules: {
        bag_num: [
          { type: 'integer', required: true, message: '请输入整数包号', trigger: 'blur' }
        ],
        clothe_num: [
          { required: true, message: '请输入款号', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请输入颜色', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        amount: [
          { type: 'integer', required: true, message: '请输入整数数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetIncomeFormFields() {
      this.$refs.incomeForm.resetFields()
    }
  }
}
</script>
