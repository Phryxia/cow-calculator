import Cow from '../Cow';
import Price from '../Price';

// 유사산태아
const cow1 = new Cow({
  name: "소1",
  type: "한우",
  id: "1184 8871 2",
  sex: "-",
  age: "-",
  weight: "-",
  pregnant: "임신2개월"
});

// 평범한 한우
const cow2 = new Cow({
  name: "소2",
  type: "한우",
  id: "1184 8871 2",
  sex: "암",
  age: "27개월",
  weight: "550kg",
  pregnant: ""
});

// 거세우
const cow3 = new Cow({
  name: "소3",
  type: "한우",
  id: "1184 8871 2",
  sex: "거세",
  age: "70개월",
  weight: "610kg",
  pregnant: ""
});

function setDOM() {
  document.body.innerHTML = '<div>'
  + '<input id="price-calf-f-4~5month" value="2800000" />'
  + '<input id="price-calf-m-4~5month" value="3391805" />'
  + '<input id="price-calf-f-6~7month" value="3724590" />'
  + '<input id="price-calf-m-6~7month" value="4440894" />'
  + '<input id="price-cow-f" value="5535102" />'
  + '<input id="price-cow-m" value="5546400" />'
  + '<input id="discount-brucella" value="80" />'
  + '<input id="discount-tuberculosis" value="100" />'
  + '<input id="discount-footandmouth" value="80" />'
  + '<select id="desease">'
  + '  <option selected value="brucella"></option>'
  + '  <option value="tuberculosis"></option>'
  + '  <option value="footandmouth"></option>'
  + '</select>'
  + '<input id="standard-f" value="137.1" />'
  + '<input id="standard-m" value="160.4" />'
  + '</div>';
}

test('renderBasic', () => {
  const price = new Price();
  
  expect(price.renderBasic(cow1)).toBe('□ 소1 한우 1184 8871 2 임신2개월');
  expect(price.renderBasic(cow2)).toBe('□ 소2 한우 1184 8871 2 암 27개월 550kg');
});

test('renderFetus', () => {
  const price = new Price();

  setDOM();

  expect(price.renderFetus(cow1))
  .toBe('① 송아지 4-5개월령의 암,수 평균가격\n'
    + '  (2,800,000 + 3,391,805) ÷ 2 = 3,095,902\n'
    + '② 유사산 발생 당시 임신 개월수 (2개월)\n'
    + '  ① × 2 ÷ 14.5 = 427,021\n'
    + '③ 소 브루셀라병 양성우\n'
    + '  ② × 80 ÷ 100 = 341,616\n');
});

test('renderCuff', () => {
  const price = new Price();
  const cow = new Cow({
    name: "소4",
    type: "한우",
    id: "1184 8871 2",
    sex: "수",
    age: "5",
    weight: "-",
    pregnant: ""
  });

  setDOM();

  expect(price.renderCuff(cow))
  .toBe();
});