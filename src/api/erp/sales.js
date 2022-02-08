import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/sales/orders',
    // baseURL: 'http://39.101.151.118:8080',
    method: 'get',
    params: query
  })
}

export function fetchOrder(id) {
  return request({
    url: '/sales/orders/' + id + '/',
    method: 'get'
  })
}

export function reviseOrder(id, data) {
  return request({
    url: '/sales/orders/' + id + '/',
    method: 'put',
    data
  })
}

export function createOrder(data) {
  return request({
    url: '/sales/orders/',
    method: 'post',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: '/sales/orders/' + id + '/',
    method: 'delete'
  })
}

export function fetchData(query) {
  return request({
    url: '/sales/orders/issued',
    method: 'get',
    params: query
  })
}

export function deleteIssuedOrder(id) {
  return request({
    url: '/sales/orders/issued/' + id + '/',
    method: 'delete'
  })
}

export function reviseIssuedOrder(id, data) {
  return request({
    url: '/sales/orders/issued/' + id + '/',
    method: 'put',
    data
  })
}

export function fetchIssuedOrder(id) {
  return request({
    url: '/sales/orders/issued/' + id + '/',
    method: 'get'
  })
}

export function fetchCustomers(query) {
  return request({
    url: '/sales/customers',
    method: 'get',
    params: query
  })
}

export function fetchCustomer(id) {
  return request({
    url: '/sales/customers/' + id + '/',
    method: 'get'
  })
}

export function reviseCustomer(id, data) {
  return request({
    url: '/sales/customers/' + id + '/',
    method: 'put',
    data
  })
}

export function createCustomer(data) {
  return request({
    url: '/sales/customers/',
    method: 'post',
    data
  })
}

export function deleteCustomer(id) {
  return request({
    url: '/sales/customers/' + id + '/',
    method: 'delete'
  })
}

export function fetchIncomes(query) {
  return request({
    url: '/warehouse/income/',
    method: 'get',
    params: query
  })
}

export function fetchIncome(id) {
  return request({
    url: '/warehouse/income/' + id + '/',
    method: 'get'
  })
}

export function createIncome(data) {
  return request({
    url: '/warehouse/income/',
    method: 'post',
    data
  })
}

export function reviseIncome(id, data) {
  return request({
    url: '/warehouse/income/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteIncome(id) {
  return request({
    url: '/warehouse/income/' + id + '/',
    method: 'delete'
  })
}

export function fetchAllRequest(query) {
  return request({
    url: '/warehouse/inventory/',
    method: 'get',
    params: query
  })
}

export function fetchSingleRequest(id) {
  return request({
    url: '/warehouse/inventory/' + id + '/',
    method: 'get'
  })
}

export function createRequest(data) {
  return request({
    url: '/warehouse/inventory/',
    method: 'post',
    data
  })
}

export function reviseRequest(id, data) {
  return request({
    url: '/warehouse/inventory/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteRequest(id) {
  return request({
    url: '/warehouse/inventory/' + id + '/',
    method: 'delete'
  })
}
