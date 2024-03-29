import ClipboardJS from '../node_modules/clipboard/src/clipboard'
import { Cow } from './Cow'
import { price, addConfigChangeHandler } from './dom/configuration'
import { openToast } from './dom/modal'
import { renderCow } from './Price'

const $input = document.querySelector('#input') as HTMLTextAreaElement
const $output = document.querySelector('#output') as HTMLTextAreaElement
const $priceOutput = document.querySelector(
  '#price-output',
) as HTMLTextAreaElement

function calculate(showToast: boolean) {
  // 안전 장치
  if (isNotCompleted()) {
    if (showToast) {
      openToast('모든 산지일평균가격을 제대로 입력해주세요.', true)
    }
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

addConfigChangeHandler(() => calculate(false))
$input.addEventListener('change', () => calculate(true))

function isNotCompleted(): boolean {
  return !Object.values(price).every(Boolean)
}

function parseCows(): Cow[] {
  const cows = [] as Cow[]

  const contents = $input.value.trimLeft()
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
      console.warn(`at line number ${lineNum}`)
    }
  }

  return cows
}

function renderCalculationProcess(cows: Cow[]): number[] {
  const prices = [] as number[]
  $output.value = ''
  for (const cow of cows) {
    const [sentence, value] = renderCow(cow, price)
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

const clipboard = new ClipboardJS('.copy-to-click')

clipboard.on('success', (e) => {
  const target = e.trigger.id === 'output' ? '계산식' : '최종가격'
  openToast(`${target}을 클립보드에 복사하였습니다.`)
})
