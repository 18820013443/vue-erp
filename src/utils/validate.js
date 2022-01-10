/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function checkPhone(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!isValidPhone) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}

export function isValidPhone(str) {
  const reg = /^[1][3, 4, 5, 6, 7, 8][0-9]{9}$/
  // console.log(reg.test(str))
  return reg.test(str)
}

