<template>
  <div class="dashboard-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :pre-seven-days="PreSevenDays" />
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:10px;">
        <half-year-revenue-table />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <!-- <bar-chart :pre-six-months="PreSixMonths" /> -->
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:10px;">
        <top-seven-customers-table />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import HalfYearRevenueTable from './components/HalfYearRevenueTable'
import BarChart from './components/BarChart'
import TopSevenCustomersTable from './components/TopSevenCustomersTable'
import PieChart from './components/PieChart'

import { getSevenDaysSummaryList } from '@/api/erp/dashboard'
// import { getSixMonthsRevenueList } from '@/api/erp/dashboard'

const lineChartData = {
  totalCustomers: {
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  totalSalesAmount: {
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  totalRevenue: {
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  totalOrders: {
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    HalfYearRevenueTable,
    BarChart,
    TopSevenCustomersTable,
    PieChart
  },
  data() {
    return {
      lineChartData: lineChartData.totalRevenue,
      PreSevenDays: [],
      preSixMonths: []
    }
  },
  created() {
    this.getLineChartData('totalRevenue')
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
      this.getLineChartData(type)
    },
    getLineChartData(type) {
      getSevenDaysSummaryList(type).then(response => {
        // this.preSixMonths = this.$store.state.preSixMonthsRevenue.x_pre_seven_months
        this.PreSevenDays = response['x_pre_seven_days']
        // console.log(this.preSixMonths)
        if (type === 'totalSalesAmount') {
          this.lineChartData.actualData = response['y_sales_count']
        } else if (type === 'totalRevenue') {
          this.lineChartData.actualData = response['y_sales_revenue']
        } else if (type === 'totalOrders') {
          this.lineChartData.actualData = response['y_orders_count']
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
