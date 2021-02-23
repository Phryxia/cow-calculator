import Cow from './Cow';
import Price from './Price';

const $input = document.querySelector('#input') as HTMLTextAreaElement;
const $output = document.querySelector('#output') as HTMLTextAreaElement;

let cows = null;
let price = new Price();

$input.onchange = () => {
  cows = [];

  const content = $input.value.trim();
  const lines = content.split('\n');

  for (let lineNum = 0; lineNum < lines.length; lineNum += 8) {
    // 헤더가 같이 복사된 경우 그 행 전체를 패스한다.
    if (lines[lineNum] === '축종')
      continue;

    const cow = new Cow({
      name: lines[lineNum],
      type: lines[lineNum + 1],
      id: lines[lineNum + 2],
      sex: lines[lineNum + 3],
      age: lines[lineNum + 4],
      weight: lines[lineNum + 5],
      pregnant: lines[lineNum + 6]
    });

    cows.push(cow);
  }

  // render
  $output.value = '';
  for (const cow of cows) {
    $output.value += price.renderCow(cow) + '\n';
  }
};