import test from 'node:test';
import assert from 'node:assert/strict';
import { worlds } from '../data/worlds';
import { questions, getStageQuestions } from '../data/questions';
import { removeBatchim } from '../lib/hangul';

test('35개 스테이지와 316개 유효한 학습 문제', () => {
  assert.equal(worlds.length, 7);
  assert.equal(questions.length, 316);
  assert.equal(new Set(questions.map(q => q.id )).size, 316);
  for (const world of worlds) {
    assert.equal(world.stages.length, 5);
    for (const stage of world.stages) {
      assert.equal(getStageQuestions(world.id, stage.id).length, stage.questionCount);
    }
  }
  for (const q of questions) {
    assert.equal(new Set(q.choices).size, q.choices.length, q.id);
    assert.equal(q.choices.filter(c => c === q.answer).length, 1, q.id);
    assert.ok(q.explanation.length > 5, q.id);
    if (q.type === 'audio') assert.ok(q.audioSrc && q.audioText);
  }
});
test('최종 임무는 사용자가 제공한 CSV의 유형 구성을 따른다', () => {
  const final = getStageQuestions(5, 5);
  assert.equal(final.filter(q => q.type === 'image').length, 2);
  assert.equal(final.filter(q => q.type === 'sentence').length, 4);
  assert.equal(final.filter(q => q.type === 'audio').length, 4);
  assert.equal(final.filter(q => q.type === 'fix-spelling').length, 3);
  assert.equal(final.filter(q => q.type === 'word-choice').length, 2);
});
test('CSV의 문제·보기·완성 문장·음성 대본을 보존한다', () => {
  const first = questions.find(q => q.id === '1-1-01')!;
  assert.equal(first.question, '높고 큰 땅을 무엇이라고 할까요?');
  assert.equal(first.hint, '등산할 때 올라가요.');
  assert.deepEqual(first.choices, ['ㄱ', 'ㄴ', 'ㄹ']);
  assert.equal(questions.find(q => q.id === '1-1-06')!.word, '신');
  const sentence = questions.find(q => q.id === '3-1-01')!;
  assert.equal(sentence.answer, '낮');
  assert.equal(sentence.question, '__에는 해가 밝게 떠 있어요.');
  const spelling = questions.find(q => q.id === '5-5-04')!;
  assert.equal(spelling.correctSentence, '밖에 비가 와요.');
  assert.equal(questions.find(q => q.id === '5-5-15')!.type, 'audio');
  assert.equal(questions.filter(q => q.type === 'audio').length, 14);
});
test('겹받침도 지정된 음절에서 정확하게 제거한다', () => {
  assert.equal(removeBatchim('닭', 0), '다');
  assert.equal(removeBatchim('읽다', 0), '이다');
  assert.equal(removeBatchim('산', 0), '사');
});
test('단어 열이 비어 있는 음성·맞춤법 문제도 정답 단어를 피드백에 보여준다',()=>{
  for(const q of questions.filter(q=>q.type==='audio'||q.type==='fix-spelling')) {
    assert.ok(q.word.trim().length>0,q.id);
    assert.ok(!q.explanation.includes('‘’'),q.id);
    assert.equal(q.word,q.answer,q.id);
  }
});
