import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, calculateStars } from '../lib/scoring';

test('정답·시간·콤보 보너스와 지원 모드', () => {
  for (const [combo, expected] of [[1,140],[3,150],[5,160],[10,190]]) {
    assert.equal(calculateScore({firstTry:true, fastAnswer:true, combo, supportMode:false}), expected);
  }
  assert.equal(calculateScore({firstTry:false, fastAnswer:true, combo:10, supportMode:false}),100);
  assert.equal(calculateScore({firstTry:true, fastAnswer:true, combo:10, supportMode:true}),100);
});
test('별은 최초 정답률과 힌트 기준으로 결정된다', () => {
  for (const [correct,hints,stars] of [[6,0,0],[7,0,1],[8,0,2],[9,2,3],[9,3,2],[10,0,3]]) {
    assert.equal(calculateStars(correct,10,hints),stars);
  }
});
