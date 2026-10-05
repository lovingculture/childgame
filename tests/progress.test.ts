import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress, applyResult, isStageUnlocked } from '../lib/progress';
import { readProgress, writeProgress } from '../lib/storage';
import type { GameResult } from '../types/game';
const result: GameResult = {accuracy:90,stars:3,cleared:true,score:1400,bestCombo:8,hints:1,unresolved:[],firstCorrect:9,total:10};
test('모든 단계를 자유롭게 선택하고 최초 조각·최고 기록을 보존한다',()=>{
  let p=emptyProgress();
  assert.equal(isStageUnlocked(p,1,1),true);
  for(let world=1;world<=7;world++) for(let stage=1;stage<=5;stage++) {
    assert.equal(isStageUnlocked(p,world,stage),true);
  }
  for(const [world,stage] of [[0,1],[8,1],[1,0],[1,6],[1.5,1],[1,2.5],[NaN,1]]) {
    assert.equal(isStageUnlocked(p,world,stage),false);
  }
  p=applyResult(p,1,1,result);
  assert.equal(isStageUnlocked(p,1,2),true);
  p=applyResult(p,1,1,{...result,cleared:false,stars:0,score:30,bestCombo:1});
  assert.equal(p.stages['1-1'].stars,3);
  assert.equal(p.stages['1-1'].bestScore,1400);
  assert.equal(p.stages['1-1'].puzzlePiece,true);
  assert.equal(p.stages['1-1'].attempts,2);
  p=applyResult(p,1,5,result);
  assert.equal(isStageUnlocked(p,2,1),true);
  assert.equal(isStageUnlocked(p,0,1),false);
});
test('손상·버전 불일치·저장 차단에 안전한 기본값',()=>{
  for(const raw of ['{','{"version":9}', '{"version":1,"stages":{"1-1":{"stars":999}},"settings":{}}']) {
    assert.deepEqual(readProgress({getItem:()=>raw}),emptyProgress());
  }
  assert.deepEqual(readProgress({getItem:()=>{throw Error('blocked')}}),emptyProgress());
  assert.equal(writeProgress({setItem:()=>{throw Error('blocked')}},emptyProgress()),false);
  const p=applyResult(emptyProgress(),1,1,result);
  assert.deepEqual(readProgress({getItem:()=>JSON.stringify(p)}),p);
});
