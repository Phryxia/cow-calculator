import { Cow } from './Cow'
import { price } from './dom/configuration'
import './styles.css'
import { copyToClipboard } from './utils'

const $input = document.querySelector('#input') as HTMLTextAreaElement
const $output = document.querySelector('#output') as HTMLTextAreaElement
const $priceOutput = document.querySelector(
  '#price-output',
) as HTMLTextAreaElement

function calculate() {
  // 안전 장치
  if (isNotCompleted()) {
    alert('모든 산지일평균가격을 제대로 입력해주세요.')
    return
  }

  if (!$input.value) return

  // 계산하기
  const cows = parseCows()

  // 계산과정 렌더
  const renderedCalculations = renderCalculationProcess(cows)

  // 결과값 렌더
  renderFinalOutcomes(renderedCalculations)
}

$input.addEventListener('change', calculate)
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

function parseCows(): Cow[] {
  const cows = [] as Cow[]

  const contents = $input.value.trim()
  const lines = contents.split('\n')

  // 입력 양식에서
  for (let lineNum = 0; lineNum < lines.length; lineNum += 8) {
    // header/footer인 경우
    if (['축종', '금회 신청액'].includes(lines[lineNum])) continue

    try {
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
    } catch (e) {
      console.warn(e)
    }
  }

  return cows
}

function renderCalculationProcess(cows: Cow[]): number[] {
  const prices = [] as number[]
  $output.value = ''
  for (const cow of cows) {
    const [sentence, value] = price.renderCow(cow)
    $output.value += sentence + '\n'

    prices.push(value)
  }
  return prices
}

function renderFinalOutcomes(prices: number[]): void {
  $priceOutput.value = ''
  for (const price of prices) {
    $priceOutput.value += price + '\n'
  }
}

$output.addEventListener('click', () => {
  copyToClipboard($output.value)
  alert('계산식이 복사되었습니다.')
})

$priceOutput.addEventListener('click', () => {
  copyToClipboard($priceOutput.value)
  alert('최종 가격이 복사되었습니다.')
})
