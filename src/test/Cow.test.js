import Cow from '../Cow';

test('Cow 1', () => {
  const cow = new Cow({
    name: "소1",
    type: "한우",
    id: "1184 8871 2",
    sex: "암",
    age: "43개월",
    weight: "441kg",
    pregnant: "임신3개월"
  });
  expect(cow)
  .toEqual({
    name: "소1",
    type: "한우",
    id: "1184 8871 2",
    sex: "암",
    age: 43,
    weight: 441,
    pregnant: 3
  });
});

test('Cow 2', () => {
  const cow = new Cow({
    name: "소1",
    type: "한우",
    id: "1184 8871 2",
    sex: "-",
    age: "-",
    weight: "-",
    pregnant: "임신2개월"
  });
  expect(cow)
  .toEqual({
    name: "소1",
    type: "한우",
    id: "1184 8871 2",
    sex: null,
    age: null,
    weight: null,
    pregnant: 2
  });
});

test('Cow 3', () => {
  const cow = new Cow({
    name: "소1",
    type: "한우",
    id: "1184 8871 2",
    sex: "거세",
    age: "1개월",
    weight: "-",
    pregnant: ""
  });
  expect(cow)
  .toEqual({
    name: "소1",
    type: "한우",
    id: "1184 8871 2",
    sex: "거세",
    age: 1,
    weight: null,
    pregnant: null
  });
});