/* eslint-disable @typescript-eslint/no-explicit-any */

export function isType(
  type:
    | 'Boolean'
    | 'Number'
    | 'String'
    | 'Undefined'
    | 'Null'
    | 'Array'
    | 'Object'
    | 'Function',
  value: any,
) {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

export const isBoolean = isType.bind(undefined, 'Boolean')

export function isNumber(value): value is string {
  return isType('Number', value)
}

export function isString(value): value is string {
  return isType('String', value)
}

export function isUndefined(value): value is undefined {
  return isType('Undefined', value)
}

export const isNull = isType.bind(undefined, 'Null')
export const isArray = isType.bind(undefined, 'Array')
export const isObject = isType.bind(undefined, 'Object')
export const isFunction = isType.bind(undefined, 'Function')

/**
 * isBoolean | isNumber | isString
 * @param value any
 */
export const isSimple = (value: any) => isBoolean(value)
  || isNumber(value)
  || isString(value)

/**
 * isNull | isUndefined
 * @param value any
 */
export const isPureEmpty = (value: any) => isNull(value) || isUndefined(value)

/**
 * isNull | isUndefined | <Empty String> '' | <Empty Object> {} | <Empty Array> []
 * @param value any
 */
export function isEmpty(value: any): value is undefined {
  if (isPureEmpty(value)) {
    return true
  }
  if (isString(value) && value === '') {
    return true
  }
  if (isObject(value) && JSON.stringify(value) === '{}') {
    return true
  }
  if (isArray(value) && value.length === 0) {
    return true
  }
  return false
}

export function isFalsy(value: any) {
  return value === false || value === 0 || isEmpty(value)
}

export function isMobile(mobile: string) {
  return /^1[\d]{10}$/.test(mobile)
}

export class ValidatorError extends Error {
  code?: string

  message: string

  constructor(msg: string, code?: string) {
    super(msg)
    this.message = msg
    this.code = code
  }
}
