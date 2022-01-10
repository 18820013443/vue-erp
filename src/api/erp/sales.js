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
