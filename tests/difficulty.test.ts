import test from 'node:test';
import assert from 'node:assert/strict';
import { challengeQuestions } from '../data/challenge';
import { getStageQuestions, questions } from '../data/questions';
import { readProgress, writeProgress, STORAGE_KEY, CHALLENGE_STORAGE_KEY } from '../lib/storage';
import { emptyProgress, applyResult } from '../lib/progress';
import { answerQuestion, createGame } from '../lib/game-engine';

test('도전 175문항은 35단계에 5개씩 있고 중복 없이 정답 선택이 가능하다',()=>{
  assert.equal(challengeQuestions.length,175);
  assert.equal(new Set(challengeQuestions.map(q=>q.question )).size,175);
  for(let world=1;world<=7;world++) for(let stage=1;stage<=5;stage++) {
    const items=getStageQuestions(world,stage,'challenge');
    assert.equal(items.length,5);
    for(const q of items) {
      assert.equal(new Set(q.choices).size,4);
      assert.equal(q.choices.filter(c=>c===q.answer).length,1);
      assert.equal(answerQuestion(createGame([q]),q.answer,1000).feedback?.correct,true);
      assert.ok(q.hint && q.explanation);
      assert.ok(!questions.some(b=>b.question===q.question));
    }
  }
});
test('기본 문제는 같은 질문과 정답을 반복하지 않는다 (기존 녹음 제외)',()=>{
  const signatures=questions.filter(q=>q.type!=='audio').map(q=>`${q.question}|${q.word}|${q.answer}`);
  assert.equal(new Set(signatures).size,signatures.length);
});
test('6학년 도전은 대부분 복합 빈칸 또는 문장 교정이며 힌트를 풀이와 분리한다',()=>{
  const complex=challengeQuestions.filter(q=>q.answer.includes(' · ')||q.answer.length>=12);
  assert.ok(complex.length>=90,`복합·문장형 ${complex.length}/125`);
  for(const q of challengeQuestions) assert.ok(!q.explanation.endsWith(q.hint),q.id);
});
test('기본 기록을 보존하면서 도전 기록은 독립적으로 저장하고 복원한다',()=>{
  const store=new Map<string,string>();
  const storage={getItem:(key:string)=>store.get(key)??null,setItem:(key:string,value:string)=>{store.set(key,value);}};
  const result={accuracy:100,stars:3,cleared:true,score:500,bestCombo:5,hints:0,unresolved:[],firstCorrect:5,total:5};
  const basic=applyResult(emptyProgress(),1,1,result);
  assert.equal(writeProgress(storage,basic),true);
  assert.deepEqual(readProgress(storage,'challenge'),emptyProgress());
  const challenge=applyResult(emptyProgress(),2,1,result);
  assert.equal(writeProgress(storage,challenge,'challenge'),true);
  assert.deepEqual(readProgress(storage),basic);
  assert.deepEqual(readProgress(storage,'challenge'),challenge);
  assert.ok(store.has(STORAGE_KEY) && store.has(CHALLENGE_STORAGE_KEY));
});
