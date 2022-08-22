import { Cow, CowSex } from './Cow'
import { formatPrice, getMarker } from './utils'

/**
 * 가축평가액에 관련된 것들을 처리하는 클래스
 */
export interface Price {
  // 송아지-암-4~5개월
  priceCalfF4month: number

  // 송아지-수-4~5개월
  priceCalfM4month: number

  // 송아지-암-6~7개월
  priceCalfF6month: number

  // 송아지-수-6~7개월
  priceCalfM6month: number

  // 한우-600kg-암
  priceCowF: number

  // 한우-600kg-수
  priceCowM: number

  // 한우-600kg-거세
  priceCowC: number

  // 송아지 표준 발육 체중 (암)
  stdCuffWeightF: number

  // (수)
  stdCuffWeightM: number
}

/**
 *
 * @param cow 소
 * @returns [결과, 가격]
 */
export function renderCow(cow: Cow, price: Price): [string, number] {
  let out = renderBasic(cow)

  let sentence, value

  // 성별이 없는 소 = 유산된 태아
  if (!cow.sex) {
    ;[sentence, value] = renderFetus(cow, price)
  }
  // 송아지
  else if (cow.age !== undefined && cow.age <= 7) {
    ;[sentence, value] = renderCuff(cow, price)
  }
  // 다 큰 소
  else {
    ;[sentence, value] = renderAdult(cow, price)
  }

  out += '\n' + sentence

  return [out, value]
}

/**
 * 가축별 제목을 만든다.
 * @param cow
 */
export function renderBasic(cow: Cow): string {
  let out = `□ ${cow.name} ${cow.type} ${cow.id}`

  if (cow.sex) out = `${out} ${cow.sex}`
  if (cow.age) out = `${out} ${cow.age}개월`
  if (cow.weight) out = `${out} ${cow.weight}kg`
  if (cow.pregnancy) out = `${out} 임신${cow.pregnancy}개월`

  return out
}

/**
 * 유사산 태아의 경우
 * @param cow
 */
function renderFetus(cow: Cow, price: Price): [string, number] {
  const priceCuffAverage = Math.floor(
    (price.priceCalfF4month + price.priceCalfM4month) / 2,
  )
  let marker = 1

  // 1
  let out = `${getMarker(marker)} 송아지 4-5개월령의 암,수 평균가격\n`
  out += `  (${formatPrice(price.priceCalfF4month)} + ${formatPrice(
    price.priceCalfM4month,
  )}) ÷ 2 = ${formatPrice(priceCuffAverage)}\n`

  marker += 1

  // 2
  const value = Math.floor((priceCuffAverage * cow.pregnancy!) / 14.5)

  out += `${getMarker(marker)} 유사산 발생 당시 임신 개월수 (${
    cow.pregnancy
  }개월)\n`
  out += `  ${getMarker(marker - 1)} × ${cow.pregnancy} ÷ 14.5 = ${formatPrice(
    value,
  )}\n`

  marker += 1

  return [out, value]
}

function determineBaseValue(sex: CowSex, age: number, price: Price): number {
  if (age <= 5) {
    if (sex === CowSex.Female) {
      return price.priceCalfF4month
    }
    return price.priceCalfM4month
  }
  if (sex === CowSex.Female) {
    return price.priceCalfF6month
  }
  return price.priceCalfM6month
}

function renderCuff(cow: Cow, price: Price): [string, number] {
  if (!cow.sex) throw new Error('송아지 성별이 누락되었습니다.')
  if (cow.age === undefined) throw new Error('송아지 연령이 누락되었습니다.')

  let marker = 1
  let nextStr,
    nextValue,
    out = ''

  // 1
  const baseValue = determineBaseValue(cow.sex, cow.age, price)
  if (cow.age <= 3) {
    ;[nextStr, nextValue, marker] = renderCuff3Base(baseValue, marker, cow)
  } else if (cow.age <= 5) {
    ;[nextStr, nextValue, marker] = renderCuff4567Base(baseValue, marker)
  } else if (cow.age <= 7) {
    ;[nextStr, nextValue, marker] = renderCuff4567Base(baseValue, marker)
  }
  out += nextStr

  return [out, nextValue as number]
}

function renderCuff3Base(
  prevPrice: number,
  marker: number,
  cow: Cow,
): [string, number, number] {
  if (cow.age === undefined) throw new Error('송아지 연령이 누락되었습니다.')

  const nextPrice = Math.floor(((cow.age + 10) / 14.5) * prevPrice)

  let out = `${getMarker(marker)} 송아지${cow.age}개월 (3개월이하)\n`
  out += `  = (${cow.age} + 10) ÷ 14.5 × ${formatPrice(
    prevPrice,
  )} = ${formatPrice(nextPrice)}\n`

  return [out, nextPrice, marker + 1]
}

function renderCuff4567Base(
  prevPrice: number,
  marker: number,
): [string, number, number] {
  let out = `${getMarker(marker)} 농협조사 산지가격\n`
  out += `  = ${formatPrice(prevPrice)}\n`

  return [out, prevPrice, marker + 1]
}

function renderAdult(cow: Cow, price: Price): [string, number] {
  if (cow.age === undefined) throw new Error('연령이 누락되었습니다.')

  let out = ''
  let marker = 1
  let nextStr, nextPrice

  // 거세 여부로 공식이 결정된다.
  if (cow.sex === CowSex.Castrated) {
    if (cow.weight! <= 600) {
      ;[nextStr, nextPrice, marker] = renderUnder600Castrated(
        marker,
        cow,
        price,
      )
    } else {
      ;[nextStr, nextPrice, marker] = renderOver600Castrated(marker, cow, price)
    }
  } else {
    // 무게 검증
    if (cow.weight! <= 600) {
      ;[nextStr, nextPrice, marker] = renderUnder600(marker, cow, price)
    } else {
      ;[nextStr, nextPrice, marker] = renderOver600(marker, cow, price)
    }
  }
  out += nextStr

  // 노령우
  if (cow.age > 60) {
    ;[nextStr, nextPrice, marker] = renderOldCow(nextPrice, marker, cow)
    out += nextStr
  }

  // 임신우
  if (cow.pregnancy) {
    ;[nextStr, nextPrice, marker] = renderpregnancy(
      nextPrice,
      marker,
      cow,
      price,
    )
    out += nextStr
  }

  return [out, nextPrice]
}

function renderUnder600Castrated(
  marker: number,
  cow: Cow,
  price: Price,
): [string, number, number] {
  if (!cow.weight) throw new Error('생체량이 누락되었습니다.')

  let out = ''

  const nextPrice = Math.floor(
    price.priceCalfM6month +
      ((cow.weight - price.stdCuffWeightM) *
        (price.priceCowC - price.priceCalfM6month)) /
        (600 - price.stdCuffWeightM),
  )

  out += `${getMarker(marker)} 한우 거세우 ${cow.weight}kg (600kg 이하)\n`
  out += `  = ${price.priceCalfM6month} + (${cow.weight} - ${price.stdCuffWeightM}) × (${price.priceCowC} - ${price.priceCalfM6month}) ÷ (600 - ${price.stdCuffWeightM})\n`
  out += `  = ${formatPrice(nextPrice)}\n`

  return [out, nextPrice, marker + 1]
}

function renderOver600Castrated(
  marker: number,
  cow: Cow,
  price: Price,
): [string, number, number] {
  if (!cow.weight) throw new Error('생체량이 누락되었습니다.')
  let out = ''

  const nextPrice = Math.floor(
    price.priceCowC + ((cow.weight - 600) * price.priceCowC) / 600,
  )

  out += `${getMarker(marker)} 한우 거세우 ${cow.weight}kg (600kg 초과)\n`
  out += `  = ${price.priceCowC} + (${cow.weight} - 600) × ${price.priceCowC} ÷ 600\n`
  out += `  = ${formatPrice(nextPrice)}\n`

  return [out, nextPrice, marker + 1]
}

function renderUnder600(
  marker: number,
  cow: Cow,
  price: Price,
): [string, number, number] {
  if (!cow.weight) throw new Error('생체량이 누락되었습니다.')

  let out = ''

  const baseValue =
    cow.sex === '암' ? price.priceCalfF6month : price.priceCalfM6month
  const tempValue = cow.sex === '암' ? price.priceCowF : price.priceCowM
  const stdWeight =
    cow.sex === '암' ? price.stdCuffWeightF : price.stdCuffWeightM
  const nextPrice = Math.floor(
    baseValue +
      ((cow.weight - stdWeight) * (tempValue - baseValue)) / (600 - stdWeight),
  )

  out += `${getMarker(marker)} 한우 ${cow.weight}kg (600kg 이하)\n`
  out += `  = ${formatPrice(baseValue)} + [(${
    cow.weight
  } - ${stdWeight}) × (${formatPrice(tempValue)} - ${formatPrice(
    baseValue,
  )}) ÷ (600 - ${stdWeight})]\n`
  out += `  = ${formatPrice(nextPrice)}\n`

  return [out, nextPrice, marker + 1]
}

function renderOver600(
  marker: number,
  cow: Cow,
  price: Price,
): [string, number, number] {
  if (!cow.weight) throw new Error('생체량이 누락되었습니다.')

  let out = ''

  const baseValue = cow.sex === '암' ? price.priceCowF : price.priceCowM
  const stdWeight = 600
  const nextPrice = Math.floor(
    baseValue + ((cow.weight - stdWeight) * baseValue) / stdWeight,
  )

  out += `${getMarker(marker)} 한우 ${cow.weight}kg (${stdWeight}kg 초과)\n`
  out += `  = ${formatPrice(baseValue)} + [(${
    cow.weight
  } - ${stdWeight}) × ${formatPrice(baseValue)} ÷ ${stdWeight}]\n`
  out += `  = ${formatPrice(nextPrice)}\n`

  return [out, nextPrice, marker + 1]
}

// 월령에 따른 평가액 상한선 조정 (24개월령)
function renderOldCow(
  prevPrice: number,
  marker: number,
  cow: Cow,
): [string, number, number] {
  if (!cow.age) throw new Error('연령이 누락되었습니다.')

  let out = ''

  /* 
      60개월령 까지는 평가상한가격의 100% 적용
      61~119개월령은 매1개월 증가 시 마다 평가상한가격의 1%씩 감액 적용
      120개월령 이상은  평가상한가격의 40% 적용
    */
  const discount = Math.max(100 - Math.max(cow.age - 60, 0), 40)
  const nextPrice = Math.floor((prevPrice * discount) / 100)

  out += `${getMarker(marker)} 월령에 따른 평가액 상한선 조정 (${
    cow.age
  }개월령)\n`
  out += `  ${getMarker(marker - 1)} × ${discount}% = ${formatPrice(
    nextPrice,
  )}\n`

  return [out, nextPrice, marker + 1]
}

// 임신우
function renderpregnancy(
  prevPrice: number,
  marker: number,
  cow: Cow,
  price: Price,
): [string, number, number] {
  if (!cow.pregnancy) throw new Error('임신우의 임신 개월수가 누락되었습니다.')

  let out = ''

  // 송아지 4-5개월령의 암,수 평균가격
  const priceCuffF = price.priceCalfF4month
  const priceCuffM = price.priceCalfM4month
  const priceCuffA = Math.floor((priceCuffF + priceCuffM) / 2)
  const parentMarker = marker - 1

  out += `${getMarker(marker)} 송아지 4-5개월령의 암,수 평균가격\n`
  out += `  (${formatPrice(priceCuffF)} + ${formatPrice(
    priceCuffM,
  )}) ÷ 2 = ${formatPrice(priceCuffA)}\n`

  ++marker

  // 유사산 발생 당시 임신 개월수
  const childPrice = Math.floor((priceCuffA * cow.pregnancy) / 14.5)
  const childMarker = marker

  out += `${getMarker(marker)} 유사산 발생 당시 임신 개월수 (${
    cow.pregnancy
  }개월)\n`
  out += `  ${getMarker(marker - 1)} × ${cow.pregnancy} ÷ 14.5 = ${formatPrice(
    childPrice,
  )}\n`

  ++marker

  // 총 합
  const nextPrice = prevPrice + childPrice

  out += `${getMarker(marker)} 임신우 가격\n`
  out += `  (${getMarker(parentMarker)} + ${getMarker(
    childMarker,
  )}) = ${nextPrice}\n`

  return [out, nextPrice, marker]
}
