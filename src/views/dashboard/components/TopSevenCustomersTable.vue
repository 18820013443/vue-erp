<template>
  <el-table :data="list" style="width: 100%;padding-top: 10px;" :row-style="{height: '37px'}" :cell-style="{padding: '0px'}" stripe>
    <!-- <el-table-column
      align="center"
      prop="id"
      label="序号"
      type="index"
      min-width="30"
    /> -->
    <el-table-column label="客户姓名" min-width="195">
      <template slot-scope="scope">
        {{ scope.row.customerName }}
      </template>
    </el-table-column>
    <el-table-column label="总订单金额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.orderPrice }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { getHalfYearRevenueList } from '@/api/erp/dashboard'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // getHalfYearRevenueList().then(response => {
      //   var monthList = response.x_pre_seven_months
      //   var revenueList = response.y_sales_revenue
      //   for (var i = 0; i < monthList.length; i++) {
      //     var dic = {}
      //     dic['month'] = monthList[i]
      //     dic['revenue'] = revenueList[i]
      //     this.list.push(dic)
      //   }
      // })
      var customerNameList = this.$store.state.topTenCustomers.customer_names
      var orderPriceList = this.$store.state.topTenCustomers.total_order_price
      for (var i = 0; i < customerNameList.length; i++) {
        var dic = {}
        dic['customerName'] = customerNameList[i]
        dic['orderPrice'] = orderPriceList[i]
        this.list.push(dic)
      }
    }
  }
}
</script>

<style>
  .el-table .cell{
    padding-left: 40px;
  }
  .el-table th>.cell{
    padding-left: 40px;
  }
</style>
