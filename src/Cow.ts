const numRegex = /[0-9]+/

export enum CowSex {
  Male = '수',
  Female = '암',
  Castrated = '거세',
}

export class Cow {
  name: string // 축종
  type: string // 품종
  id: string // 개체번호
  sex?: CowSex // 성별 (태아는 성별 없음)
  age?: number // 연령 (단위: 개월, 태아는 연령 없음)
  weight?: number // 생체량 (송아지는 생체량 없음)
  pregnancy?: number // 임신 개월 수, 유사산 태아인 경우 반드시 존재 (부모의 임신 개월 수)

  /**
   * 사용자 입력에서 받은 걸 그대로 넣어주기만 하면 된다.
   * {
   *  name: "소1",
   *  type: "한우",
   *  id: "1184 8871 2",
   *  sex: "암",
   *  age: "43개월",
   *  weight: "441kg",
   *  pregnancy: "임신3개월"
   * }
   * @param args
   */
  public constructor(args: any) {
    this.name = args.name
    this.type = args.type
    this.id = args.id
    this.sex = parseSex(args.sex)
    this.age = parseAge(args.age)
    this.weight = parseWeight(args.weight)
    this.pregnancy = parsePregnancy(args.pregnancy)
  }
}

function parseSex(str: string): CowSex | undefined {
  return str === '-' ? undefined : (str as CowSex)
}

// xx개월에서 숫자를 추출한다.
function parseAge(str: string): number | undefined {
  // 태아의 경우 나이가 없다.
  const result = str.match(numRegex)
  if (!result) {
    return undefined
  }
  return Number.parseInt(result[0])
}

// 무게에서 kg을 떼고 숫자를 추출한다. 숫자가 없으면 undefined을 반환한다.
function parseWeight(str: string): number | undefined {
  // 송아지의 경우 생체량이 없다.
  const result = str.match(numRegex)
  if (!result) {
    return undefined
  }
  return Number.parseInt(result[0])
}

// 임신x개월에서 숫자만 추출한다. 숫자가 없으면 undefined을 반환한다.
function parsePregnancy(str: string): number | undefined {
  const result = str.match(numRegex)
  if (!result) {
    return undefined
  }
  return Number.parseInt(result[0])
}
