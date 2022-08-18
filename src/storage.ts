import Price from './Price'

const PRICE = 'PRICE'

export function loadPrice(): Price {
  const jsonString = window.localStorage.getItem(PRICE)
  const price = jsonString ? JSON.parse(jsonString) : {}
  return { ...new Price(), ...price } as Price
}

export function savePrice(price: Price): void {
  window.localStorage.setItem(PRICE, JSON.stringify(price))
}
