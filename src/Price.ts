import Cow from './Cow';
import Util from './Util';

/**
 * 가축평가액에 관련된 것들을 처리하는 클래스
 */
export default class Price {
  /**
   * 산지일평균가격을 반환한다.
   * @param domId 송아지-암-4-5개월령: "price-calf-f-4~5month",
   * 송아지-수-4-5개월령: "price-calf-m-4~5month",
   * 송아지-암-6~7개월령: "price-calf-f-6~7month",
   * 송아지-수-6~7개월령: "price-calf-m-6~7month",
   * 한우600kg-암: "price-cow-f",
   * 한우600kg-수: "price-cow-m"
   */
  public getAveragePrice(
    domId: 'price-calf-f-4~5month' |
      'price-calf-m-4~5month' |
      'price-calf-f-6~7month' |
      'price-calf-m-6~7month' |
      'price-cow-f' |
      'price-cow-m'
  ): number {
    const $dom = document.getElementById(domId) as HTMLInputElement;
    return parseInt($dom.value);
  }

  /**
   * 살처분보상금 감액을 %로 반환한다.
   * @param deseaseId 
   */
  public getDiscountRate(
    deseaseId: 'brucella' | 
      'tuberculosis' | 
      'footandmouth'
  ): number {
    const $dom = document.getElementById('discount-' + deseaseId) as HTMLInputElement;
    return parseFloat($dom.value);
  }

  /**
   * 현재 선택된 전염병 종류를 String으로 반환한다.
   */
  public getCurrentDesease(): string {
    const $dom = document.getElementById('desease') as HTMLSelectElement;
    return $dom.value;
  }

  /**
   * 7개월 송아지 표준발육체중을 반환한다.
   * @param sex 
   */
  public getStandardWeight(sex: '암' | '수' | '거세'): number {
    const $dom = document.getElementById(`standard-${sex === '암' ? 'f' : 'm'}`) as HTMLInputElement;
    return parseFloat($dom.value);
  }

  /**
   * 주어진 소를 분석하여 렌더한다.
   * @param cow 
   */
  public renderCow(cow: Cow): string {
    let out = this.renderBasic(cow);

    // 성별이 없는 소 = 유산된 태아
    if (cow.sex === null)
      out += '\n' + this.renderFetus(cow);

    // 송아지
    else if (cow.age <= 7)
      out += '\n' + this.renderCuff(cow);

    // 다 큰 소
    else
      out += '\n' + this.renderGeneral(cow);

    return out;
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
  private renderFetus(cow: Cow): string {
    const priceCuffF = this.getAveragePrice('price-calf-f-4~5month');
    const priceCuffM = this.getAveragePrice('price-calf-m-4~5month');
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

    // 질병
    let nextStr, nextValue;

    [nextStr, nextValue, marker] = this.renderDesease(secondValue, marker);
    out += nextStr;

    return out;
  }

  /**
   * 송아지
   * @param cow 
   */
  private renderCuff(cow: Cow): string {
    let marker = 1;
    let nextStr, nextValue, out = '';

    // 1
    if (cow.age <= 3) {
      const baseValue = cow.sex === '암' ? this.getAveragePrice('price-calf-f-4~5month') : this.getAveragePrice('price-calf-m-4~5month');
      [nextStr, nextValue, marker] = this.renderCuff3Base(baseValue, marker, cow);
    }
    else if (cow.age <= 5) {
      const baseValue = cow.sex === '암' ? this.getAveragePrice('price-calf-f-4~5month') : this.getAveragePrice('price-calf-m-4~5month');
      [nextStr, nextValue, marker] = this.renderCuff4567Base(baseValue, marker);
    }
    else if (cow.age <= 7) {
      const baseValue = cow.sex === '암' ? this.getAveragePrice('price-calf-f-6~7month') : this.getAveragePrice('price-calf-m-6~7month');
      [nextStr, nextValue, marker] = this.renderCuff4567Base(baseValue, marker);
    }
    out += nextStr;

    // 거세우
    if (cow.sex === '거세') {
      [nextStr, nextValue, marker] = this.renderCastration(nextValue, marker);
      out += nextStr;
    }

    // 질병
    [nextStr, nextValue, marker] = this.renderDesease(nextValue, marker);
    out += nextStr;

    return out;
  }

  /**
   * 다 큰 소를 계산하여 렌더한다.
   * @param cow 
   */
  private renderGeneral(cow: Cow): string {
    let out = '';
    let marker = 1;
    let nextStr, nextValue;

    // 무게 검증
    if (cow.weight <= 600)
      [nextStr, nextValue, marker] = this.renderUnder600(0, marker, cow);
    else
      [nextStr, nextValue, marker] = this.renderOver600(0, marker, cow);
    out += nextStr;

    // 거세우
    if (cow.sex === '거세') {
      [nextStr, nextValue, marker] = this.renderCastration(nextValue, marker);
      out += nextStr;
    }

    // 월령에 따른...
    if (cow.age > 60) {
      [nextStr, nextValue, marker] = this.renderOldCow(nextValue, marker, cow);
      out += nextStr;
    }

    // 임신우
    if (cow.pregnant) {
      // 송아지 4-5개월령의 암,수 평균가격
      const priceCuffF = this.getAveragePrice('price-calf-f-4~5month');
      const priceCuffM = this.getAveragePrice('price-calf-m-4~5month');
      const priceCuffA = Math.floor((priceCuffF + priceCuffM) / 2);
      const parentMarker = marker - 1;

      out += `${Util.getMarker(marker)} 송아지 4-5개월령의 암,수 평균가격\n`;
      out += `  (${Util.format(priceCuffF)} + ${Util.format(priceCuffM)}) ÷ 2 = ${Util.format(priceCuffA)}\n`
      
      ++marker;

      // 유사산 발생 당시 임신 개월수
      const secondValue = Math.floor(priceCuffA * cow.pregnant / 14.5);
      const childMarker = marker;

      out += `${Util.getMarker(marker)} 유사산 발생 당시 임신 개월수 (${cow.pregnant}개월)\n`;
      out += `  ${Util.getMarker(marker - 1)} × ${cow.pregnant} ÷ 14.5 = ${Util.format(secondValue)}\n`;

      ++marker;

      // 질병의 특수한 경우
      nextStr = this.renderDeseasePregnant(nextValue, secondValue, parentMarker, childMarker);
      out += nextStr;
    }

    else {
      // 질병
      [nextStr, nextValue, marker] = this.renderDesease(nextValue, marker);
      out += nextStr;
    }

    return out;
  }

  /**
   * 3개월 이하 송아지 관련 렌더
   * @param value 
   * @param marker 
   * @param cow 
   */
  private renderCuff3Base(value: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';
    const nextValue = Math.floor((cow.age + 10) / 14.5 * value);

    out += `${Util.getMarker(marker)} 송아지${cow.age}개월 (3개월이하)\n`;
    out += `  = (${cow.age} + 10) ÷ 14.5 × ${Util.format(value)} = ${Util.format(nextValue)}\n`;

    return [out, nextValue, marker + 1];
  }

  /**
   * 4 ~ 7개월 송아지 관련 렌더
   * @param value 
   * @param marker 
   * @param cow 
   */
  private renderCuff4567Base(value: number, marker: number): [string, number, number] {
    let out = '';

    out += `${Util.getMarker(marker)} 농협조사 산지가격\n`;
    out += `  = ${Util.format(value)}\n`;

    return [out, value, marker + 1];
  }

  /**
   * 거세우 관련 렌더.
   * 반환을 [렌더된 문자열, 누적된 값, 누적된 마커번호]로 한다.
   * @param value 이전까지 누적해온 가격
   * @param marker 이전까지 세어온 마커 번호
   */
  private renderCastration(value: number, marker: number): [string, number, number] {
    let out = '';
    const nextValue = Math.floor(value * 1.2);

    out += `${Util.getMarker(marker)} 거세우\n`;
    out += `  ${Util.getMarker(marker - 1)} × 1.2 = ${Util.format(nextValue)}\n`;
    
    return [out, nextValue, marker + 1];
  }

  /**
   * 질병을 렌더한다.
   * 반환을 [렌더된 문자열, 누적된 값, 누적된 마커번호]로 한다.
   * @param value 이전까지 누적해온 가격
   * @param marker 이전까지 세어온 마커 번호
   */
  private renderDesease(value: number, marker: number): [string, number, number] {
    let out = '';
    let nextValue = value;
    
    const desease = this.getCurrentDesease();
    
    // 2021년 2월 기준으로는 결핵은 감액이 없어서 표시할 필요가 없다.
    if (desease !== 'tuberculosis') {
      const label = desease === 'brucella' ? '소 브루셀라병 양성우' : '소 구제역 백신 접종으로 인한 폐사';
      const discount = this.getDiscountRate(desease as any);
      nextValue = Math.floor(value * discount / 100);
      
      out += `${Util.getMarker(marker)} ${label}\n`;
      out += `  ${Util.getMarker(marker - 1)} × ${discount} ÷ 100 = ${Util.format(nextValue)}\n`;
      
      ++marker;
    }

    return [out, nextValue, marker];
  }

  /**
   * 임신우인 경우에 질병을 렌더한다. 특수성을 인정.
   * @param valueParent 부모의 가격
   * @param valueChild 태아의 가격
   * @param markerParent 부모의 마커 번호
   * @param markerChild 자식의 마커 번호
   */
  private renderDeseasePregnant(
    valueParent: number, 
    valueChild: number,
    markerParent: number, 
    markerChild: number
  ): string {
    let out = '';
    let nextValue;

    // 부모 마커와 자식 마커 중 큰 번호 다음이 현재 마커 번호가 된다.
    const marker = Math.max(markerParent, markerChild) + 1;

    const desease = this.getCurrentDesease();
    
    // 2021년 2월 기준으로는 결핵은 감액이 없어서 표시할 필요가 없다.
    if (desease !== 'tuberculosis') {
      const label = desease === 'brucella' ? '소 브루셀라병 양성우' : '소 구제역 백신 접종으로 인한 폐사';
      const discount = this.getDiscountRate(desease as any);
      nextValue = Math.floor((valueParent + valueChild) * discount / 100);
      
      out += `${Util.getMarker(marker)} ${label}\n`;
      out += `  ( ${Util.getMarker(markerParent)} + ${Util.getMarker(markerChild)} ) × ${discount} ÷ 100 = ${Util.format(nextValue)}\n`;
    }
    else {
      out += `${Util.getMarker(marker)} 임신우 가격\n`;
      out += `  ( ${Util.getMarker(markerParent)} + ${Util.getMarker(markerChild)} )`;
      out += ` = ${Util.format(valueParent + valueChild)}\n`;
    }

    return out;
  }
  
  /**
   * 무게가 600kg 이하인 소의 베이스 가격을 계산
   * @param value 
   * @param marker 
   * @param cow 
   */
  private renderUnder600(value: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    const baseValue = cow.sex === '암' ? this.getAveragePrice('price-calf-f-6~7month') : this.getAveragePrice('price-calf-m-6~7month');
    const tempValue = cow.sex === '암' ? this.getAveragePrice('price-cow-f') : this.getAveragePrice('price-cow-m');
    const stdWeight = this.getStandardWeight(cow.sex);
    const nextValue = Math.floor(baseValue + (cow.weight - stdWeight) * (tempValue - baseValue) / (600 - stdWeight));

    out += `${Util.getMarker(marker)} 한우 ${cow.weight}kg (600kg 이하)\n`;
    out += `  = ${Util.format(baseValue)} + [(${cow.weight} - ${stdWeight}) × (${Util.format(tempValue)} - ${Util.format(baseValue)}) ÷ (600 - ${stdWeight})]\n`;
    out += `  = ${Util.format(nextValue)}\n`;

    return [out, nextValue, marker + 1];
  }

  /**
   * 무게가 600kg 초과인 소의 베이스 가격을 계산
   * @param value 
   * @param marker 
   * @param cow 
   */
  private renderOver600(value: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    const baseValue = cow.sex === '암' ? this.getAveragePrice('price-calf-f-6~7month') : this.getAveragePrice('price-calf-m-6~7month');
    const stdWeight = 600;
    const nextValue = Math.floor(baseValue + ((cow.weight - stdWeight) * baseValue / stdWeight));

    out += `${Util.getMarker(marker)} 한우 ${cow.weight}kg (${stdWeight}kg 초과)\n`;
    out += `  = ${Util.format(baseValue)} + [(${cow.weight} - ${stdWeight}) × ${Util.format(baseValue)} ÷ ${stdWeight}]\n`;
    out += `  = ${Util.format(nextValue)}\n`;

    return [out, nextValue, marker + 1];
  }

  /**
   * 월령에 따른 평가액 상한선 조정 렌더
   * @param value 
   * @param marker 
   * @param cow 
   */
  private renderOldCow(value: number, marker: number, cow: Cow): [string, number, number] {
    let out = '';

    /* 
      60개월령 까지는 평가상한가격의 100% 적용
      61~119개월령은 매1개월 증가 시 마다 평가상한가격의 1%씩 감액 적용
      120개월령 이상은  평가상한가격의 40% 적용
    */
    const discount = Math.max(100 - Math.max(cow.age - 60, 0), 40);
    const nextValue = Math.floor(value * discount / 100);

    out += `${Util.getMarker(marker)} 월령에 따른 평가액 상한선 조정 (${cow.age}개월령)\n`;
    out += `  ${Util.getMarker(marker - 1)} × ${discount}% = ${Util.format(nextValue)}\n`;
    
    return [out, nextValue, marker + 1];
  }
};