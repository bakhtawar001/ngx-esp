export function randomGenerator(maximum: number) {
  return Math.floor(Math.random() * maximum + 1);
}
export function randomStringGenerator(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export function ArrayEqual(actual: Array<string>, expected: Array<string>) {
  if (actual.length != expected.length) {
    assert.fail('The length of the Arrays are not equal.');
  } else {
    actual.forEach(($el, index, $list) => {
      // eslint-disable-next-line no-empty
      if ($el.trim() == expected[index].trim()) {
      } else {
        assert.fail(
          `The ${index}th element in the list mismatch. The actual value is : ${actual[index]}, and the expected value is : ${expected[index]}.`
        );
      }
    });
  }
}
export function getRandomNumbers(length: number, flag: number) {
  const arr: Array<number> = [];
  while (arr.length < flag) {
    const r = Math.floor(Math.random() * length) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}
export function compareArray(list: Array<string>, order: string, callback) {
  const newList: Array<string> = list;
  if (order == 'asc') {
    newList.sort();
    if (JSON.stringify(list) == JSON.stringify(newList)) callback(true);
    else callback(false);
  } else {
    newList.sort();
    newList.reverse();
    if (JSON.stringify(list) == JSON.stringify(newList)) callback(true);
    else callback(false);
  }
}

export function sortArrayCheck(list: Array<any>, order: string) {
  console.log(`Input Array : ${list}`);
  const newList: Array<any> = [];
  for (let i = 0; i < list.length; i++) {
    newList[i] = list[i];
  }
  if (order == 'asc') {
    newList.sort();
    console.log(
      `After Sorting the input Array in Ascending Order : ${newList}.`
    );
    expect(list).to.eql(newList);
  } else if (order == 'dsc') {
    newList.sort();
    newList.reverse;
    expect(list).to.equal(newList);
  } else {
    assert.fail('Unknown input order Parameter.');
  }
}

export function esc() {
  return cy.get('body').type('{esc}');
}
