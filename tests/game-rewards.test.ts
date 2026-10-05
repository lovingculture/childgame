import test from 'node:test';
import assert from 'node:assert/strict';
import { getGameRewards,newGameRewards } from '../data/game-rewards';
import { applyResult,emptyProgress,totalStars } from '../lib/progress';
test('두 게임의 모든 난이도에서 여섯 보상을 획득할 수 있다',()=>{
  for(const [game,maximum] of [['numbers',135],['numbers',60],['numbers',75],['science',90]] as const){
    const rewards=getGameRewards(game,maximum);
    assert.equal(rewards.length,6);assert.equal(new Set(rewards.map(r=>r.stars)).size,6);
    assert.ok(rewards.every(r=>r.stars>0&&r.stars<=maximum));
    assert.equal(newGameRewards(game,maximum,0,maximum).length,6);
  }
  assert.deepEqual(getGameRewards('numbers',60).map(r=>r.stars),[10,20,30,40,50,60]);
});
test('최고 별 기록으로 새 보상만 알리고 재도전에는 중복 알림을 띄우지 않는다',()=>{
  const result={accuracy:100,stars:3,cleared:true,score:100,bestCombo:3,hints:0,unresolved:[],firstCorrect:3,total:3};
  let p=emptyProgress();for(const stage of [1,2,3])p=applyResult(p,1,stage,result);
  const next=applyResult(p,1,4,result);
  assert.equal(newGameRewards('numbers',135,totalStars(p),totalStars(next)).length,1);
  assert.equal(newGameRewards('science',90,totalStars(p),totalStars(next)).length,1);
  const retry=applyResult(next,1,4,result);
  assert.deepEqual(newGameRewards('numbers',135,totalStars(next),totalStars(retry)),[]);
  assert.deepEqual(newGameRewards('science',90,0,3),[]);
  assert.deepEqual(newGameRewards('numbers',75,12,12),[]);
});
