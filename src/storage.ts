import { Price } from './Price'

const PRICE = 'PRICE'

export function loadPrice(): Price {
  const jsonString = window.localStorage.getItem(PRICE)
  const price: Price = jsonString
    ? JSON.parse(jsonString)
    : {
        priceCalfF4month: 0,
        priceCalfF6month: 0,
        priceCalfM4month: 0,
        priceCalfM6month: 0,
        priceCowC: 0,
        priceCowF: 0,
        priceCowM: 0,
        stdCuffWeightF: 137.1,
        stdCuffWeightM: 160.4,
      }
  return price
}

export function savePrice(price: Price): void {
  window.localStorage.setItem(PRICE, JSON.stringify(price))
}
