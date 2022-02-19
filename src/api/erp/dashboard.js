import request from '@/utils/request'

export function fetchSummaryList() {
  return request({
    url: '/dashboard/total_summary/',
    method: 'get'
  })
}

export function getSevenDaysSummaryList(type) {
  if (type === 'totalSalesAmount') {
    return request({
      url: '/dashboard/seven_dates_sales/',
      method: 'get'
    })
  } else if (type === 'totalRevenue') {
    return request({
      url: '/dashboard/seven_dates_revenue/',
      method: 'get'
    })
  } else if (type === 'totalOrders') {
    return request({
      url: '/dashboard/seven_dates_orders/',
      method: 'get'
    })
  }
}

export function getHalfYearRevenueList() {
  return request({
    url: '/dashboard/seven_months_revenue/',
    method: 'get'
  })
}

export function getTopSevenCustomersList() {
  return request({
    url: '/dashboard/top_seven_customers/',
    method: 'get'
  })
}

