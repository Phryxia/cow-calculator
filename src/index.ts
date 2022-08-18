import { Cow } from './Cow'
import Price from './Price'
import { loadPrice, savePrice } from './storage'
import './styles.css'

const $input = document.querySelector('#input') as HTMLTextAreaElement
const $output = document.querySelector('#output') as HTMLTextAreaElement
const $priceOutput = document.querySelector(
  '#price-output',
) as HTMLTextAreaElement
const $button = document.querySelector('#calculate-button') as HTMLInputElement

const pricer = loadPrice()

$button.onclick = () => {
  // 안전 장치
  if (isNotCompleted()) {
    alert('모든 산지일평균가격을 제대로 입력해주세요.')
    return
  }

  // DOM에서 값 불러오기
  setPricer(pricer)

  // 계산하기
  const cows = parseCows()

  // 계산과정 렌더
  const prices = renderCalculationProcess(cows)

  // 결과값 렌더
  renderFinalOutcomes(prices)
}

function isNotCompleted(): boolean {
  const doms = document.querySelectorAll('.price-input')
  let warn = false

  // 하나라도 가격이 0이거나 숫자가 아니면
  for (const $dom of doms) {
    const $temp = $dom as HTMLInputElement
    warn ||= $temp.value === '0' || isNaN(parseInt($temp.value))
  }

  return warn
}

function setPricer(pricer: Price) {
  pricer.priceCalfF4month = parseInt(
    (document.getElementById('price-calf-f-4~5month') as HTMLInputElement)
      .value,
  )
  pricer.priceCalfM4month = parseInt(
    (document.getElementById('price-calf-m-4~5month') as HTMLInputElement)
      .value,
  )
  pricer.priceCalfF6month = parseInt(
    (document.getElementById('price-calf-f-6~7month') as HTMLInputElement)
      .value,
  )
  pricer.priceCalfM6month = parseInt(
    (document.getElementById('price-calf-m-6~7month') as HTMLInputElement)
      .value,
  )
  pricer.priceCowF = parseInt(
    (document.getElementById('price-cow-f') as HTMLInputElement).value,
  )
  pricer.priceCowM = parseInt(
    (document.getElementById('price-cow-m') as HTMLInputElement).value,
  )
  pricer.priceCowC = parseInt(
    (document.getElementById('price-cow-c') as HTMLInputElement).value,
  )
  pricer.stdCuffWeightF = parseFloat(
    (document.getElementById('standard-f') as HTMLInputElement).value,
  )
  pricer.stdCuffWeightM = parseFloat(
    (document.getElementById('standard-m') as HTMLInputElement).value,
  )
  savePrice(pricer)
}

function parseCows(): Cow[] {
  const cows = [] as Cow[]

  const content = $input.value.trim()
  const lines = content.split('\n')

  // 입력 양식에서
  for (let lineNum = 0; lineNum < lines.length; lineNum += 8) {
    // header인 경우
    if (lines[lineNum] === '축종') continue
    // footer인 경우
    else if (lines[lineNum] === '금회 신청액') continue

    const cow = new Cow({
      name: lines[lineNum],
      type: lines[lineNum + 1],
      id: lines[lineNum + 2],
      sex: lines[lineNum + 3],
      age: lines[lineNum + 4],
      weight: lines[lineNum + 5],
      pregnancy: lines[lineNum + 6],
    })

    cows.push(cow)
  }

  return cows
}

/**
 * 계산과정을 렌더링하여 DOM에 출력하고, 계산결과값을 배열로 반환한다.
 * @param cows 파싱한 소
 */
function renderCalculationProcess(cows: Cow[]): number[] {
  const prices = [] as number[]
  $output.value = ''
  for (const cow of cows) {
    const [sentence, price] = pricer.renderCow(cow)
    $output.value += sentence + '\n'

    prices.push(price)
  }
  return prices
}

/**
 * 계산결과값을 렌더링하여 DOM에 출력한다.
 * @param prices 계산결과값
 */
function renderFinalOutcomes(prices: number[]): void {
  $priceOutput.value = ''
  for (const price of prices) {
    $priceOutput.value += price + '\n'
  }
}
