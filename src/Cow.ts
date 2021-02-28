const numRegex = /[0-9]+/;

export default class Cow {
  // 축종
  public name: string;

  // 품종
  public type: string;

  // 개체번호
  public id: string;

  // 성별
  public sex: "암" | "수" | "거세" | null;

  // 연령 (단위: 개월)
  public age: number | null;

  // 생체량 (주의: 송아지는 생체량이 null임)
  public weight: number | null;

  // 임신 여부
  public pregnant: number | null;

  /**
   * 사용자 입력에서 받은 걸 그대로 넣어주기만 하면 된다.
   * {
   *  name: "소1",
   *  type: "한우",
   *  id: "1184 8871 2",
   *  sex: "암",
   *  age: "43개월",
   *  weight: "441kg",
   *  pregnant: "임신3개월"
   * }
   * @param args 
   */
  public constructor(args: any) {
    this.name = args.name;
    this.type = args.type;
    this.id = args.id;
    this.sex = Cow.parseSex(args.sex) as '암' | '수' | '거세' | null;
    this.age = Cow.parseAge(args.age);
    this.weight = Cow.parseWeight(args.weight);
    this.pregnant = Cow.parsePregnant(args.pregnant);
  }

  private static parseSex(str: string): string | null {
    return str === '-' ? null : str;
  }

  // xx개월에서 숫자를 추출한다.
  private static parseAge(str: string): number | null {
    // 태아의 경우 나이가 없다.
    if (!str || str === '-')
      return null;
      
    const result = str.match(numRegex);
    if (!result)
      return null;
    else
      return Number.parseInt(result[0]);
  }

  // 무게에서 kg을 떼고 숫자를 추출한다. 숫자가 없으면 null을 반환한다.
  private static parseWeight(str: string): number | null {
    // 송아지의 경우 생체량이 없다.
    if (!str || str === '-')
      return null;

    const result = str.match(numRegex);
    if (!result)
      return null;
    else
      return Number.parseInt(result[0]); 
  }

  // 임신x개월에서 숫자만 추출한다. 숫자가 없으면 null을 반환한다.
  private static parsePregnant(str: string): number | null {
    if (!str)
      return null;
    
    const result = str.match(numRegex);
    if (!result)
      return null;
    else
      return Number.parseInt(result[0]); 
  }
};