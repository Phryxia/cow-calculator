import Util from '../Util';

/*
  Util.format
*/
test('Util.format', () => {
  expect(Util.format(0)).toBe('0');
  expect(Util.format(1)).toBe('1');
  expect(Util.format(11)).toBe('11');
  expect(Util.format(111)).toBe('111');
  expect(Util.format(1111)).toBe('1,111');
  expect(Util.format(11111)).toBe('11,111');
  expect(Util.format(111111)).toBe('111,111');
  expect(Util.format(1111111)).toBe('1,111,111');
  expect(Util.format(1000)).toBe('1,000');
  expect(Util.format(1001)).toBe('1,001');
  expect(Util.format(1010)).toBe('1,010');
});

/*
  Util.padZero
*/
test('Util.padZero', () => {
  expect(Util.padZero(0)).toBe('000');
  expect(Util.padZero(1)).toBe('001');
  expect(Util.padZero(11)).toBe('011');
  expect(Util.padZero(111)).toBe('111');
});

/*
  Util.getMarker
*/
test('Util.getMarker', () => {
  expect(Util.getMarker(1)).toBe('①');
  expect(Util.getMarker(2)).toBe('②');
  expect(Util.getMarker(3)).toBe('③');
  expect(Util.getMarker(4)).toBe('④');
  expect(Util.getMarker(5)).toBe('⑤');
});