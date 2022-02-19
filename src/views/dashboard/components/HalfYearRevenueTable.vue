<template>
  <el-table :data="list" style="width: 100%;padding-top: 10px;" :row-style="{height: '37px'}" :cell-style="{padding: '0px'}" stripe>
    <el-table-column label="月份" min-width="195">
      <template slot-scope="scope">
        {{ scope.row.month }}
      </template>
    </el-table-column>
    <el-table-column label="销售额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.revenue }}
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
      // console.log(this.list)

      // this.$store.dispatch('getPreSixMonthsRevenueAction')
      var monthList = this.$store.state.preSevenMonthsRevenue.x_pre_seven_months
      // console.log(monthList)
      var revenueList = this.$store.state.preSevenMonthsRevenue.y_sales_revenue
      for (var i = 0; i < monthList.length; i++) {
        var dic = {}
        dic['month'] = monthList[i]
        dic['revenue'] = revenueList[i]
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
