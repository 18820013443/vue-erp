<template>
  <el-form ref="editObjectForm" :model="editObjectForm" :rules="editObjectFormRules" label-width="85px">
    <el-form-item label="款号:" prop="clothe_num">
      <el-input v-model="editObjectForm.clothe_num" placeholder="请输入款号" />
    </el-form-item>
    <el-form-item label="颜色:" prop="color">
      <el-input v-model="editObjectForm.color" placeholder="请输入颜色" />
    </el-form-item>
    <el-form-item label="数量:" prop="amount">
      <el-input v-model.number="editObjectForm.amount" placeholder="请输入数量" />
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: 'AddUpdateForm',
  props: {
    editObjectForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editObjectFormRules: {
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
    resetEditObjectFormFields() {
      this.$refs.editObjectForm.resetFields()
    }
  }
}
</script>
