import Price from '../Price'
import { loadPrice, savePrice } from '../storage'

export const price: Price = loadPrice()

const $config: Record<string, HTMLInputElement> = {
  priceCalfF4month: document.getElementById(
    'price-calf-f-4~5month',
  )! as HTMLInputElement,
  priceCalfM4month: document.getElementById(
    'price-calf-m-4~5month',
  )! as HTMLInputElement,
  priceCalfF6month: document.getElementById(
    'price-calf-f-6~7month',
  )! as HTMLInputElement,
  priceCalfM6month: document.getElementById(
    'price-calf-m-6~7month',
  )! as HTMLInputElement,
  priceCowF: document.getElementById('price-cow-f')! as HTMLInputElement,
  priceCowM: document.getElementById('price-cow-m')! as HTMLInputElement,
  priceCowC: document.getElementById('price-cow-c')! as HTMLInputElement,
  stdCuffWeightF: document.getElementById('standard-f')! as HTMLInputElement,
  stdCuffWeightM: document.getElementById('standard-m')! as HTMLInputElement,
}

for (const key in $config) {
  const dom = $config[key]

  dom.addEventListener('change', () => {
    const prevValue = price[key] as number
    const newValue = parseFloat(dom.value)

    if (Number.isNaN(newValue)) {
      dom.value = prevValue.toString()
    } else {
      dom.value = newValue.toString()
      price[key] = newValue
      savePrice(price)
    }
  })

  // 부팅 시 초기화
  dom.value = price[key].toString()
}
