export default class Util {
  public static format(x: number): string {
    let stack = [];

    while (x > 0) {
      if (x / 1000 < 1)
        stack.push(`${x % 1000}`);
      else
        stack.push(Util.padZero(x % 1000));

      x = Math.floor(x / 1000);

      if (x > 0)
        stack.push(',');
    }

    if (stack.length === 0)
      stack.push('0');

    return stack.reverse().join('');
  }

  private static padZero(x: number): string {
    if (x === 0)
      return '000';
    
    let out = `${x}`;
    const numOfDigits = Math.floor(Math.log10(x)) + 1;
    for (let i = 0; i < 3 - numOfDigits; ++i) {
      out = '0' + out;
    }

    return out;
  }

  private static markers: string[] = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

  /**
   * 숫자를 마커로 바꾼다.
   * @param x 1 ~ 10의 숫자
   */
  public static getMarker(x: number): string {
    return Util.markers[x - 1];
  }
};