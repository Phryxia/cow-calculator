import { Cow, CowSex } from '../../Cow'
import Price from '../../Price'

function getPrice(cow: Cow, price: Price): number {
  if (!cow.weight) return 0

  if (cow.weight < 600) {
    return (
      price.priceCalfM6month +
      ((cow.weight - 160.4) * (price.priceCowC - price.priceCalfM6month)) /
        (600 - 160.4)
    )
  }
  return price.priceCowC + ((cow.weight - 600) * price.priceCowC) / 600
}

describe('거세우 2020.6.2 - 거세우 600kg 이상', () => {
  const price = new Price()
  price.priceCalfM6month = 5013466
  price.priceCowC = 8688000

  const cows: Cow[] = [
    {
      id: '4',
      name: '',
      type: '',
      age: 25,
      weight: 740,
      sex: CowSex.Castrated,
    },
    {
      id: '5',
      name: '',
      type: '',
      age: 26,
      weight: 600,
      sex: CowSex.Castrated,
    },
    {
      id: '6',
      name: '',
      type: '',
      age: 25,
      weight: 690,
      sex: CowSex.Castrated,
    },
    {
      id: '7',
      name: '',
      type: '',
      age: 28,
      weight: 740,
      sex: CowSex.Castrated,
    },
    {
      id: '8',
      name: '',
      type: '',
      age: 27,
      weight: 830,
      sex: CowSex.Castrated,
    },
  ]

  for (const cow of cows) {
    test(`거세우 ${cow.id}번 검증`, () => {
      const [, result] = price.renderCow(cow)
      expect(result).toBeCloseTo(getPrice(cow, price), -1)
    })
  }
})

describe('거세우 2020.6.5 - 거세우 600kg 미만', () => {
  const price = new Price()
  price.priceCalfM6month = 4943403
  price.priceCowC = 8153000

  const cows: Cow[] = [
    {
      id: '7',
      name: '',
      type: '',
      age: 11,
      weight: 300,
      sex: CowSex.Castrated,
    },
    {
      id: '9',
      name: '',
      type: '',
      age: 8,
      weight: 230,
      sex: CowSex.Castrated,
    },
    {
      id: '10',
      name: '',
      type: '',
      age: 13,
      weight: 380,
      sex: CowSex.Castrated,
    },
    {
      id: '11',
      name: '',
      type: '',
      age: 17,
      weight: 460,
      sex: CowSex.Castrated,
    },
    {
      id: '12',
      name: '',
      type: '',
      age: 14,
      weight: 450,
      sex: CowSex.Castrated,
    },
  ]

  for (const cow of cows) {
    test(`거세우 ${cow.id}번 검증`, () => {
      const [, result] = price.renderCow(cow)
      expect(result).toBeCloseTo(getPrice(cow, price), -1)
    })
  }
})
