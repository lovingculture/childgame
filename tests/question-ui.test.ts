import test from 'node:test';
import assert from 'node:assert/strict';
import { getAnswerInstruction } from '../lib/question-ui';
test('문장 문제도 보기 형식에 맞춰 단어 또는 받침을 안내한다',()=>{
  assert.equal(getAnswerInstruction('ㄴ'),'빈자리에 들어갈 받침을 골라 주세요.');
  assert.equal(getAnswerInstruction('ㄺ'),'빈자리에 들어갈 받침을 골라 주세요.');
  assert.equal(getAnswerInstruction('낮'),'알맞은 단어를 선택해 주세요.');
  assert.equal(getAnswerInstruction('낳았다 · 나았다'),'빈칸 순서에 맞는 조합을 선택해 주세요.');
  assert.equal(getAnswerInstruction('할 수밖에 없었다.'),'문맥에 맞고 표기가 바른 표현을 선택해 주세요.');
});
