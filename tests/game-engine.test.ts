import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, answerQuestion, nextQuestion, useHint, getGameResult } from '../lib/game-engine';
import type { Question } from '../types/game';
import { questions } from '../data/questions';
test('받침 마을 4단계 숲은 ㅍ이 정답이고 ㅂ은 오답이다', () => {
  const forest = questions.find(item => item.id === '1-4-09')!;
  assert.equal(answerQuestion(createGame([forest]),'ㅍ',1000).feedback?.correct,true);
  assert.equal(answerQuestion(createGame([forest]),'ㅂ',1000).feedback?.correct,false);
});
const q: Question = {id:'sample',world:1,stage:1,type:'batchim',question:'높은 땅',word:'산',stem:'사',answer:'ㄴ',choices:['ㄱ','ㄴ','ㄹ'],hint:'높은 땅이에요.',explanation:'산에는 ㄴ 받침을 써요.',difficulty:1};
test('오답은 최대 두 차례 복습한 뒤 미해결로 종료한다', () => {
  let s = createGame([q]);
  for(let round=0; round<3; round++) {
    assert.equal(s.round,round);
    s=answerQuestion(s,'ㄱ',1000);
    s=nextQuestion(s);
  }
  assert.equal(s.finished,true);
  assert.equal(s.lives,0);
  assert.equal(getGameResult(s).unresolved.length,1);
});
test('복습 정답은 기본 점수만 지급하고 최초 정답률을 바꾸지 않는다', () => {
  let s=nextQuestion(answerQuestion(createGame([q]),'ㄱ',1000));
  s=nextQuestion(answerQuestion(s,'ㄴ',1000));
  assert.equal(getGameResult(s).score,100);
  assert.equal(getGameResult(s).accuracy,0);
  assert.equal(getGameResult(s).unresolved.length,0);
});
test('지원 모드에서도 계속 풀고 중복 답변·힌트는 반영되지 않는다', () => {
  const items=Array.from({length:4},(_,i)=>({...q,id:`sample-${i}`}));
  let s=createGame(items);
  assert.deepEqual(nextQuestion(s),s);
  s=useHint(s);
  assert.equal(useHint(s).hints,1);
  assert.equal(s.score,0);
  for(let i=0;i<3;i++) s=nextQuestion(answerQuestion(s,'ㄱ',1000));
  assert.equal(s.lives,0);
  s=answerQuestion(s,'ㄴ',1000);
  assert.equal(s.score,100);
  assert.deepEqual(answerQuestion(s,'ㄴ',1000),s);
});
