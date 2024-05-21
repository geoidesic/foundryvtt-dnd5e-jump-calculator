import {
  parseHeightString,
  calculateLongJump, 
  calculateHighJump, 
  calculateReach, 
  convertDecimalToHeightString, 
  getLongJumpDistance, 
  getHighJumpDistance,
  convertFeetAndInchesToDecimal
} from '../'
import { vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock';


const fetchMocker = createFetchMock(vi);

beforeEach(() => {
  fetchMocker.doMock();
});

test('parseHeightString exists', () => {
  assert.exists(parseHeightString);
  assert.isFunction(parseHeightString, 'parseHeightString is a function')
});

test('calculateLongJump exists', () => {
  assert.exists(calculateLongJump);
  assert.isFunction(calculateLongJump, 'calculateLongJump is a function')
});

test('calculateHighJump exists', () => {
  assert.exists(calculateHighJump);
  assert.isFunction(calculateHighJump, 'calculateHighJump is a function')
});

test('calculateReach exists', () => {
  assert.exists(calculateReach);
  assert.isFunction(calculateReach, 'calculateReach is a function')
});


/**
 * Test height parser
 */
test(`parseHeightString 0' 1"`, () => {
  const val = parseHeightString(`0' 1"`);
  assert.equal(val, '0.1');
})
test(`parseHeightString 0' 2"`, () => {
  const val = parseHeightString(`0' 2"`);
  assert.equal(val, '0.2');
})
test(`parseHeightString 1' 4"`, () => {
  const val = parseHeightString(`1' 4"`);
  assert.equal(val, '1.4');
})
test(`parseHeightString 6' 11"`, () => {
  const val = parseHeightString(`6' 11"`);
  assert.equal(val, '6.11');
})
test(`parseHeightString 6' 13"`, () => {
  const val = parseHeightString(`6' 13"`);
  assert.equal(val, '6.13');
})
test(`parseHeightString 12' 13"`, () => {
  const val = parseHeightString(`12' 13"`);
  assert.equal(val, '12.13');
})
test(`parseHeightString 120' 13" `, () => {
  const val = parseHeightString(`120' 13"`);
  assert.equal(val, '120.13');
})

/**
 * Test getLongJumpDistance
 */
test('getLongJumpDistance 16 Strength, standing', () => {
  assert.equal(getLongJumpDistance(16), 8);
});
test('getLongJumpDistance 20 Strength, standing', () => {
  assert.equal(getLongJumpDistance(20), 10);
});
test('getLongJumpDistance 9 Strength, standing', () => {
  assert.equal(getLongJumpDistance(9), 4.5);
});
test('getLongJumpDistance 13 Strength, standing', () => {
  assert.equal(getLongJumpDistance(13), 6.5);
});
test('getLongJumpDistance 15 Strength, standing', () => {
  assert.equal(getLongJumpDistance(15), 7.5);
});
test('getLongJumpDistance 16 Strength, running', () => {
  assert.equal(getLongJumpDistance(16, 'running'), 16);
});
test('getLongJumpDistance 20 Strength, running', () => {
  assert.equal(getLongJumpDistance(20, 'running'), 20);
});
test('getLongJumpDistance 9 Strength, running', () => {
  assert.equal(getLongJumpDistance(9, 'running'), 9);
});
test('getLongJumpDistance 13 Strength, running', () => {
  assert.equal(getLongJumpDistance(13, 'running'), 13);
});
test('getLongJumpDistance 15 Strength, running', () => {
  assert.equal(getLongJumpDistance(15, 'running'), 15);
});

/**
 * Test getHighJumpDistance
 */
test('getHighJumpDistance 16 Strength, standing', () => {
  assert.equal(getHighJumpDistance(16), "9.5");
});
test('getHighJumpDistance 20 Strength, standing', () => {
  assert.equal(getHighJumpDistance(20), "11.5");
});
test('getHighJumpDistance 9 Strength, standing', () => {
  assert.equal(getHighJumpDistance(9), "6");
});
test('getHighJumpDistance 13 Strength, standing', () => {
  assert.equal(getHighJumpDistance(13), "8");
});
test('getHighJumpDistance 15 Strength, standing', () => {
  assert.equal(getHighJumpDistance(15), "9");
});
test('getHighJumpDistance 16 Strength, running', () => {
  assert.equal(getHighJumpDistance(16, 'running'), "19");
});
test('getHighJumpDistance 20 Strength, running', () => {
  assert.equal(getHighJumpDistance(20, 'running'), "23");
});
test('getHighJumpDistance 9 Strength, running', () => {
  assert.equal(getHighJumpDistance(9, 'running'), "12");
});
test('getHighJumpDistance 13 Strength, running', () => {
  assert.equal(getHighJumpDistance(13, 'running'), "16");
});
test('getHighJumpDistance 15 Strength, running', () => {
  assert.equal(getHighJumpDistance(15, 'running'), "18");
});

/**
 * Test calculateLongJump
 */
test('calculateLongJump 16 Strength, standing', () => {
  assert.equal(calculateLongJump(16), `8' 0"`);
});
test('calculateLongJump 9 Strength, standing', () => {
  assert.equal(calculateLongJump(9), `4' 6"`);
});
test('calculateLongJump 11 Strength, standing', () => {
  assert.equal(calculateLongJump(11), `5' 6"`);
});
test('calculateLongJump 20 Strength, standing', () => {
  assert.equal(calculateLongJump(20), `10' 0"`);
});
test('calculateLongJump 16 Strength, running', () => {
  assert.equal(calculateLongJump(16, 'running'), `16' 0"`);
});
test('calculateLongJump 9 Strength, running', () => {
  assert.equal(calculateLongJump(9, 'running'), `9' 0"`);
});
test('calculateLongJump 11 Strength, running', () => {
  assert.equal(calculateLongJump(11, 'running'), `11' 0"`);
});
test('calculateLongJump 20 Strength, running', () => {
  assert.equal(calculateLongJump(20, 'running'), `20' 0"`);
});


/**
 * Test calculateHighJump
 */
test('calculateHighJump 16 Strength, standing', () => {
  assert.equal(calculateHighJump(16), `9' 6"`);
});
test('calculateHighJump 9 Strength, standing', () => {
  assert.equal(calculateHighJump(9), `6' 0"`);
});
test('calculateHighJump 11 Strength, standing', () => {
  assert.equal(calculateHighJump(11), `7' 0"`);
});
test('calculateHighJump 20 Strength, standing', () => {
  assert.equal(calculateHighJump(20), `11' 6"`);
});
test('calculateHighJump 16 Strength, running', () => {
  assert.equal(calculateHighJump(16, 'running'), `19' 0"`);
});
test('calculateHighJump 9 Strength, running', () => {
  assert.equal(calculateHighJump(9, 'running'), `12' 0"`);
});
test('calculateHighJump 11 Strength, running', () => {
  assert.equal(calculateHighJump(11, 'running'), `14' 0"`);
});
test('calculateHighJump 20 Strength, running', () => {
  assert.equal(calculateHighJump(20, 'running'), `23' 0"`);
});

/**
 * Test convertDecimalToHeightString
 */
test('convertDecimalToHeightString 0.1', () => {
  assert.equal(convertDecimalToHeightString(0.1), `0' 1"`);
});

test('convertDecimalToHeightString 6.5', () => {
  assert.equal(convertDecimalToHeightString(6.5), `6' 6"`);
});
test('convertDecimalToHeightString 12.5', () => {
  assert.equal(convertDecimalToHeightString(12.5), `12' 6"`);
});
test('convertDecimalToHeightString 9.5', () => {
  assert.equal(convertDecimalToHeightString(9.5), `9' 6"`);
});
test('convertDecimalToHeightString 8.25', () => {
  assert.equal(convertDecimalToHeightString(8.25), `8' 3"`);
});

/**
 * Test convertFeetAndInchesToDecimal
 */
test('convertFeetAndInchesToDecimal 6ft 6in, running', () => {
  assert.equal(convertFeetAndInchesToDecimal('6', '6'), 6.5);
});
test('convertFeetAndInchesToDecimal 12ft 2in, running', () => {
  assert.equal(convertFeetAndInchesToDecimal('12', '2'), 12.2);
});
test('convertFeetAndInchesToDecimal 12ft 3in, running', () => {
  assert.equal(convertFeetAndInchesToDecimal('12', '3'), 12.3);
});
test('convertFeetAndInchesToDecimal 12ft 4in, running', () => {
  assert.equal(convertFeetAndInchesToDecimal('12', '4'), 12.3);
});
test('convertFeetAndInchesToDecimal 12ft 5in, running', () => {
  assert.equal(convertFeetAndInchesToDecimal('12', '5'), 12.4);
});
test('convertFeetAndInchesToDecimal 12ft 6in, running', () => {
  assert.equal(convertFeetAndInchesToDecimal('12', '6'), 12.5);
});

/**
 * Test calculateReach
 */
test('calculateReach 5 ft 6 in', () => {
  assert.equal(calculateReach('5.6'), `8' 3"`);
});
test('calculateReach 12 ft 11 in', () => {
  assert.equal(calculateReach('12.11'), `19' 4"`);
});
test('calculateReach 6 ft 3 in', () => {
  assert.equal(calculateReach('6.3'), `9' 4"`);
});
test('calculateReach 6 ft 0 in', () => {
  assert.equal(calculateReach('6.0'), `9' 0"`);
});
test('calculateReach 6 ft 1 in', () => {
  assert.equal(calculateReach('6.1'), `9' 1"`);
});