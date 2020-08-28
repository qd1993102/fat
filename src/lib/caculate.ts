/*** method **
*  add / subtract / multiply /divide
*
*/
export enum OPERATE_ENUM {
  add = 'add',
  subtract = 'subtract',
  multiply = 'multiply',
  divide = 'divide'
}
const genCaculate = function() {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(num: number) {
    return Math.floor(num) === num
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum: number) {
    const ret = { times: 1, num: 0 }
    if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    const strfi = floatNum + ''
    const dotPos = strfi.indexOf('.')
    const len = strfi.substr(dotPos + 1).length
    const times = Math.pow(10, len)
    const intNum = Number(floatNum.toString().replace('.', ''))
    ret.times = times
    ret.num = intNum
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a: number, b: number, op: OPERATE_ENUM, digits?: number) {
    const o1 = toInteger(a)
    const o2 = toInteger(b)
    const n1 = o1.num
    const n2 = o2.num
    const t1 = o1.times
    const t2 = o2.times
    const max = t1 > t2 ? t1 : t2
    let result = null
    switch (op) {
      case OPERATE_ENUM.add:
        if (t1 === t2) { // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) { // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else { // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max
      case OPERATE_ENUM.subtract:
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max
      case OPERATE_ENUM.multiply:
        result = (n1 * n2) / (t1 * t2)
        return result
      case OPERATE_ENUM.divide:
        result = (n1 / n2) * (t2 / t1)
        return result
    }
  }

  // 加减乘除的四个接口
  function add(a: number, b: number, digits?: number) {
    return operation(a, b, OPERATE_ENUM.add, digits)
  }
  function subtract(a: number, b: number, digits?: number) {
    return operation(a, b, OPERATE_ENUM.subtract, digits)
  }
  function multiply(a: number, b: number, digits?: number) {
    return operation(a, b, OPERATE_ENUM.multiply, digits)
  }
  function divide(a: number, b: number, digits?: number) {
    return operation(a, b, OPERATE_ENUM.divide, digits)
  }

  // exports
  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide
  }
};
const caculate = genCaculate()
export default caculate