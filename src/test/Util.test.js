import { formatPrice, padZero, getMarker } from '../utils'

/*
  formatPrice
*/
test('formatPrice', () => {
  expect(formatPrice(0)).toBe('0')
  expect(formatPrice(1)).toBe('1')
  expect(formatPrice(11)).toBe('11')
  expect(formatPrice(111)).toBe('111')
  expect(formatPrice(1111)).toBe('1,111')
  expect(formatPrice(11111)).toBe('11,111')
  expect(formatPrice(111111)).toBe('111,111')
  expect(formatPrice(1111111)).toBe('1,111,111')
  expect(formatPrice(1000)).toBe('1,000')
  expect(formatPrice(1001)).toBe('1,001')
  expect(formatPrice(1010)).toBe('1,010')
})

/*
  Util.padZero
*/
test('Util.padZero', () => {
  expect(padZero(0)).toBe('000')
  expect(padZero(1)).toBe('001')
  expect(padZero(11)).toBe('011')
  expect(padZero(111)).toBe('111')
})

/*
  getMarker
*/
test('getMarker', () => {
  expect(getMarker(1)).toBe('①')
  expect(getMarker(2)).toBe('②')
  expect(getMarker(3)).toBe('③')
  expect(getMarker(4)).toBe('④')
  expect(getMarker(5)).toBe('⑤')
})
