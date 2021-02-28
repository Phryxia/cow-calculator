import Cow from './Cow';
import Util from './Util';

/**
 * 가축평가액에 관련된 것들을 처리하는 클래스
 */
export default class Price {
  // 송아지-암-4~5개월
  public priceCalfF4month: number;

  // 송아지-수-4~5개월
  public priceCalfM4month: number;

  // 송아지-암-6~7개월
  public priceCalfF6month: number;

  // 송아지-수-6~7개월
  public priceCalfM6month: number;

  // 한우-600kg-암
  public priceCowF: number;

  // 한우-600kg-수
  public priceCowM: number;

  // 한우-600kg-거세
  public priceCowC: number;

  // 송아지 표준 발육 체중 (암)
  public stdCuffWeightF: number = 137.1;

  // (수)
  public stdCuffWeightM: number = 160.4; 

  /**
   * 주어진 소를 분석하여 렌더한다.
   * @param cow 
   */
  public renderCow(cow: Cow): [string, number] {
    let out = this.renderBasic(cow);

    let sentence, price;

    // 성별이 없는 소 = 유산된 태아
    if (cow.sex === null)
      [sentence, price] = this.renderFetus(cow);

    // 송아지
    else if (cow.age <= 7)
      [sentence, price] = this.renderCuff(cow);

    // 다 큰 소
    else
      [sentence, price] = this.renderGeneral(cow);
    
    out += '\n' + sentence;

    return [out, price];
  }

  /**
   * 가축별 제목을 만든다.
   * @param cow 
   */
  private renderBasic(cow: Cow): string {
    let out = '□';
    out += ` ${cow.name}`;
    out += ` ${cow.type}`;
    out += ` ${cow.id}`;
    out += cow.sex === null ? '' : ` ${cow.sex}`;
    out += cow.age === null ? '' : ` ${cow.age}개월`;
    out += cow.weight === null ? '' : ` ${cow.weight}kg`;
    out += cow.pregnant === null ? '' : ` 임신${cow.pregnant}개월`;
    return out;
  }

  /**
   * 유사산 태아의 경우
   * @param cow 
   */
  private renderFetus(cow: Cow): [string, number] {
    const priceCuffF = this.priceCalfF4month;
    const priceCuffM = this.priceCalfM4month;
    const priceCuffA = Math.floor((priceCuffF + priceCuffM) / 2);
    let marker = 1;
    
    // 1
    let out = `${Util.getMarker(marker)} 송아지 4-5개월령의 암,수 평균가격\n`;
    out += `  (${Util.format(priceCuffF)} + ${Util.format(priceCuffM)}) ÷ 2 = ${Util.format(priceCuffA)}\n`
    
    ++marker;

    // 2
    const secondValue = Math.floor(priceCuffA * cow.pregnant / 14.5);

    out += `${Util.getMarker(marker)} 유사산 발생 당시 임신 개월수 (${cow.pregnant}개월)\n`;
    out += `  ${Util.getMarker(marker - 1)} × ${cow.pregnant} ÷ 14.5 = ${Util.format(secondValue)}\n`;

    ++marker;

    return [out, secondValue];
  }

  /**
   * 송아지
   * @param cow 
   */
  private renderCuff(cow: Cow): [string, number] {
    let marker = 1;
    let nextStr, nextValue, out = '';

    // 1
    if (cow.age <= 3) {
      const baseValue = cow.sex === '암' ? this.priceCalfF4month : this.priceCalfM4month;
      [nextStr, nextValue, marker] = this.renderCuff3Base(baseValue, marker, cow);
    }
    else if (cow.age <= 5) {
      const baseValue = cow.sex === '암' ? this.priceCalfF4month : this.priceCalfM4month;
      [nextStr, nextValue, marker] = this.renderCuff4567Base(baseValue, marker);
    }
    else if (cow.age <= 7) {
      const baseValue = cow.sex === '암' ? this.priceCalfF6month : this.priceCalfM6month;
      [nextStr, nextValue, marker] = this.renderCuff4567Base(baseValue, marker);
    }
    out += nextStr;

    return [out, nextValue];
  }

  /**
   * 3개월 이하 송아지 관련 렌더
   * @param prevPrice 
   * @param marker 
   * @param cow 
   */
  private renderCuff3Base(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';
    const nextPrice = Math.floor((cow.age + 10) / 14.5 * prevPrice);

    out += `${Util.getMarker(marker)} 송아지${cow.age}개월 (3개월이하)\n`;
    out += `  = (${cow.age} + 10) ÷ 14.5 × ${Util.format(prevPrice)} = ${Util.format(nextPrice)}\n`;

    return [out, nextPrice, marker + 1];
  }

  /**
   * 4 ~ 7개월 송아지 관련 렌더
   * @param prevPrice 
   * @param marker 
   * @param cow 
   */
  private renderCuff4567Base(prevPrice: number, marker: number): [string, number, number] {
    let out = '';

    out += `${Util.getMarker(marker)} 농협조사 산지가격\n`;
    out += `  = ${Util.format(prevPrice)}\n`;

    return [out, prevPrice, marker + 1];
  }

  /**
   * 다 큰 소를 계산하여 렌더한다.
   * @param cow 
   */
  private renderGeneral(cow: Cow): [string, number] {
    let out = '';
    let marker = 1;
    let nextStr, nextPrice;

    // 거세 여부로 공식이 결정된다.
    if (cow.sex === '거세') {
      if (cow.weight <= 600)
        [nextStr, nextPrice, marker] = this.renderUnder600C(null, marker, cow);
      else
        [nextStr, nextPrice, marker] = this.renderOver600C(null, marker, cow);
    }
    
    else {
      // 무게 검증
      if (cow.weight <= 600)
        [nextStr, nextPrice, marker] = this.renderUnder600(null, marker, cow);
      else
        [nextStr, nextPrice, marker] = this.renderOver600(null, marker, cow);
    }
    out += nextStr;

    // 월령에 따른...
    if (cow.age > 60) {
      [nextStr, nextPrice, marker] = this.renderOldCow(nextPrice, marker, cow);
      out += nextStr;
    }

    // 임신우
    if (cow.pregnant) {
      [nextStr, nextPrice, marker] = this.renderPregnant(nextPrice, marker, cow);
      out += nextStr;
    }

    return [out, nextPrice];
  }

  /**
   * 거세우 관련 렌더.
   * 반환을 [렌더된 문자열, 누적된 값, 누적된 마커번호]로 한다.
   * @param prevPrice 이전까지 누적해온 가격
   * @param marker 이전까지 세어온 마커 번호
   */
  private renderCastration(prevPrice: number, marker: number): [string, number, number] {
    let out = '';
    const nextPrice = Math.floor(prevPrice * 1.2);

    out += `${Util.getMarker(marker)} 거세우\n`;
    out += `  ${Util.getMarker(marker - 1)} × 1.2 = ${Util.format(nextPrice)}\n`;
    
    return [out, nextPrice, marker + 1];
  }
  
  /**
   * 무게가 600kg 이하인 거세우의 가격을 계산
   * [렌더된 문자열, 가격, 마커번호]를 반환한다.
   * @param prevPrice 안쓰는 값
   * @param marker 
   * @param cow 
   */
  private renderUnder600C(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    const nextPrice = Math.floor(this.priceCalfM6month + (cow.weight - this.stdCuffWeightM) * (this.priceCowC - this.priceCalfM6month) / (600 - this.stdCuffWeightM));

    out += `${Util.getMarker(marker)} 한우 거세우 ${cow.weight}kg (600kg 이하)\n`;
    out += `  = ${this.priceCalfM6month} + (${cow.weight} - ${this.stdCuffWeightM}) × (${this.priceCowC} - ${this.priceCalfM6month}) ÷ (600 - ${this.stdCuffWeightM})\n`;

    return [out, nextPrice, marker + 1];
  }

  /**
   * 무게가 600kg 초과인 거세우의 가격을 계산
   * [렌더된 문자열, 가격, 마커번호]를 반환한다.
   * @param prevPrice 안쓰는 값
   * @param marker 
   * @param cow 
   */
  private renderOver600C(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    const nextPrice = Math.floor(this.priceCowC + (cow.weight - 600) * this.priceCowC / 600);

    out += `${Util.getMarker(marker)} 한우 거세우 ${cow.weight}kg (600kg 초과)\n`;
    out += `  = ${this.priceCowC} + (${cow.weight} - 600) × ${this.priceCowC} ÷ 600\n`;

    return [out, nextPrice, marker + 1];
  }

  /**
   * 무게가 600kg 이하인 소의 베이스 가격을 계산
   * @param prevPrice 안쓰는 값
   * @param marker 
   * @param cow 
   */
  private renderUnder600(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    const baseValue = cow.sex === '암' ? this.priceCalfF6month : this.priceCalfM6month;
    const tempValue = cow.sex === '암' ? this.priceCowF : this.priceCowM;
    const stdWeight = cow.sex === '암' ? this.stdCuffWeightF : this.stdCuffWeightM;
    const nextPrice = Math.floor(baseValue + (cow.weight - stdWeight) * (tempValue - baseValue) / (600 - stdWeight));

    out += `${Util.getMarker(marker)} 한우 ${cow.weight}kg (600kg 이하)\n`;
    out += `  = ${Util.format(baseValue)} + [(${cow.weight} - ${stdWeight}) × (${Util.format(tempValue)} - ${Util.format(baseValue)}) ÷ (600 - ${stdWeight})]\n`;
    out += `  = ${Util.format(nextPrice)}\n`;

    return [out, nextPrice, marker + 1];
  }

  /**
   * 무게가 600kg 초과인 소의 베이스 가격을 계산
   * @param prevPrice 안쓰는 값
   * @param marker 
   * @param cow 
   */
  private renderOver600(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    const baseValue = cow.sex === '암' ? this.priceCowF : this.priceCowM;
    const stdWeight = 600;
    const nextPrice = Math.floor(baseValue + ((cow.weight - stdWeight) * baseValue / stdWeight));

    out += `${Util.getMarker(marker)} 한우 ${cow.weight}kg (${stdWeight}kg 초과)\n`;
    out += `  = ${Util.format(baseValue)} + [(${cow.weight} - ${stdWeight}) × ${Util.format(baseValue)} ÷ ${stdWeight}]\n`;
    out += `  = ${Util.format(nextPrice)}\n`;

    return [out, nextPrice, marker + 1];
  }

  /**
   * 월령에 따른 평가액 상한선 조정 렌더
   * @param prevPrice 
   * @param marker 
   * @param cow 
   */
  private renderOldCow(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    /* 
      60개월령 까지는 평가상한가격의 100% 적용
      61~119개월령은 매1개월 증가 시 마다 평가상한가격의 1%씩 감액 적용
      120개월령 이상은  평가상한가격의 40% 적용
    */
    const discount = Math.max(100 - Math.max(cow.age - 60, 0), 40);
    const nextPrice = Math.floor(prevPrice * discount / 100);

    out += `${Util.getMarker(marker)} 월령에 따른 평가액 상한선 조정 (${cow.age}개월령)\n`;
    out += `  ${Util.getMarker(marker - 1)} × ${discount}% = ${Util.format(nextPrice)}\n`;
    
    return [out, nextPrice, marker + 1];
  }

  /**
   * 임신우 계산
   * @param prevPrice 
   * @param marker 
   * @param cow 
   */
  private renderPregnant(prevPrice: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    // 송아지 4-5개월령의 암,수 평균가격
    const priceCuffF = this.priceCalfF4month;
    const priceCuffM = this.priceCalfM4month;
    const priceCuffA = Math.floor((priceCuffF + priceCuffM) / 2);
    const parentMarker = marker - 1;

    out += `${Util.getMarker(marker)} 송아지 4-5개월령의 암,수 평균가격\n`;
    out += `  (${Util.format(priceCuffF)} + ${Util.format(priceCuffM)}) ÷ 2 = ${Util.format(priceCuffA)}\n`
    
    ++marker;

    // 유사산 발생 당시 임신 개월수
    const childPrice = Math.floor(priceCuffA * cow.pregnant / 14.5);
    const childMarker = marker;

    out += `${Util.getMarker(marker)} 유사산 발생 당시 임신 개월수 (${cow.pregnant}개월)\n`;
    out += `  ${Util.getMarker(marker - 1)} × ${cow.pregnant} ÷ 14.5 = ${Util.format(childPrice)}\n`;

    ++marker;

    // 총 합
    const nextPrice = prevPrice + childPrice;

    out += `${Util.getMarker(marker)} 임신우 가격\n`;
    out += `  (${Util.getMarker(parentMarker)} + ${Util.getMarker(childMarker)}) = ${nextPrice}\n`;

    return [out, nextPrice, marker];
  }
};