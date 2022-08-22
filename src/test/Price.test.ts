import { Cow } from '../Cow'
import { Price, renderCow, renderBasic } from '../Price'

const price: Price = {
  priceCalfF4month: 2586000,
  priceCalfM4month: 3589161,
  priceCalfF6month: 3784502,
  priceCalfM6month: 4943403,
  priceCowF: 6053165,
  priceCowM: 4864200,
  priceCowC: 8153000,
  stdCuffWeightF: 137.1,
  stdCuffWeightM: 160.4,
}

/*
  이 테스트는 2020-6-5을 기준으로 작성된 테스트 케이스입니다.
*/
const testCows = [
  // 0
  new Cow({
    name: '소1',
    type: '한우',
    id: '1184 9626 4',
    sex: '암',
    age: '40',
    weight: '643',
    pregnancy: '',
  }),
  // 1
  new Cow({
    name: '소2',
    type: '한우',
    id: '1184 9649 0',
    sex: '암',
    age: '38',
    weight: '574',
    pregnancy: '',
  }),
  // 2
  new Cow({
    name: '소3',
    type: '한우',
    id: '1185 0060 7',
    sex: '암',
    age: '36',
    weight: '498',
    pregnancy: '9',
  }),
  // 3
  new Cow({
    name: '소5',
    type: '한우',
    id: '1244 1620 4',
    sex: '수',
    age: '28',
    weight: '633',
    pregnancy: '',
  }),
  // 4
  new Cow({
    name: '소12',
    type: '한우',
    id: '1393 2539 0',
    sex: '암',
    age: '12',
    weight: '279',
    pregnancy: '',
  }),
  // 5
  new Cow({
    name: '소15',
    type: '한우',
    id: '1310 4539 8',
    sex: '거세',
    age: '25',
    weight: '593',
    pregnancy: '',
  }),
  // 6
  new Cow({
    name: '소21',
    type: '한우',
    id: '0034 8136 2',
    sex: '암',
    age: '173',
    weight: '632',
    pregnancy: '',
  }),
  // 7
  new Cow({
    name: '소89',
    type: '한우',
    id: '1471 6195 4',
    sex: '수',
    age: '1',
    weight: '-',
    pregnancy: '',
  }),
  // 8
  new Cow({
    name: '소91',
    type: '한우',
    id: '1471 6197 9',
    sex: '암',
    age: '1',
    weight: '-',
    pregnancy: '',
  }),
  // 9
  new Cow({
    name: '소93',
    type: '한우',
    id: '1503 3531 2',
    sex: '거세',
    age: '3',
    weight: '-',
    pregnancy: '',
  }),
  // 10
  new Cow({
    name: '소95',
    type: '한우',
    id: '1503 3533 7',
    sex: '수',
    age: '2',
    weight: '-',
    pregnancy: '',
  }),
]

test('renderBasic', () => {
  expect(renderBasic(testCows[0])).toBe(
    '□ 소1 한우 1184 9626 4 암 40개월 643kg',
  )
  expect(renderBasic(testCows[1])).toBe(
    '□ 소2 한우 1184 9649 0 암 38개월 574kg',
  )
  expect(renderBasic(testCows[2])).toBe(
    '□ 소3 한우 1185 0060 7 암 36개월 498kg 임신9개월',
  )
  expect(renderBasic(testCows[3])).toBe(
    '□ 소5 한우 1244 1620 4 수 28개월 633kg',
  )
  expect(renderBasic(testCows[4])).toBe(
    '□ 소12 한우 1393 2539 0 암 12개월 279kg',
  )
  expect(renderBasic(testCows[5])).toBe(
    '□ 소15 한우 1310 4539 8 거세 25개월 593kg',
  )
  expect(renderBasic(testCows[6])).toBe(
    '□ 소21 한우 0034 8136 2 암 173개월 632kg',
  )
  expect(renderBasic(testCows[7])).toBe('□ 소89 한우 1471 6195 4 수 1개월')
  expect(renderBasic(testCows[8])).toBe('□ 소91 한우 1471 6197 9 암 1개월')
  expect(renderBasic(testCows[9])).toBe('□ 소93 한우 1503 3531 2 거세 3개월')
  expect(renderBasic(testCows[10])).toBe('□ 소95 한우 1503 3533 7 수 2개월')
})

test('renderCow', () => {
  expect(renderCow(testCows[0], price)[1]).toBe(6486975)
  expect(renderCow(testCows[1], price)[1]).toBe(5925739)
  expect(renderCow(testCows[2], price)[1]).toBe(7469693)
  expect(renderCow(testCows[3], price)[1]).toBe(5131731)
  expect(renderCow(testCows[4], price)[1]).toBe(4479950)
  expect(renderCow(testCows[5], price)[1]).toBe(8101891)
  expect(renderCow(testCows[6], price)[1]).toBe(2550400)
  expect(renderCow(testCows[7], price)[1]).toBe(2722811)
  expect(renderCow(testCows[8], price)[1]).toBe(1961793)
  expect(renderCow(testCows[9], price)[1]).toBe(3217868)
  expect(renderCow(testCows[10], price)[1]).toBe(2970340)
})
