import type { Question, Stage } from '../types/game';
import { vocabularyGroups } from './challenge-vocabulary';
import { grammarGroups } from './challenge-grammar';
import { editingGroups } from './challenge-editing';
import { vocabularyVillageQuestions } from './vocabulary-village';
import { hanjaVillageQuestions } from './hanja-village';

const stageTitles = [
  ['문맥 속 낱말 구별','뜻과 쓰임 판단','행동에 맞는 표현','의미와 관계 이해','상황에 맞는 선택'],
  ['혼동 표현 집중 탐구','생각을 설명하는 어휘','글과 발표의 표현','문맥 종합 판단','세 가지 조건 해결'],
  ['의존 명사와 조사','부정 표현과 되·돼','뜻에 따른 불규칙 활용','겹받침의 표기와 소리','문장 규칙 종합'],
  ['문맥에 따른 띄어쓰기','어미에 따른 활용 판별','뜻과 자격을 구분하는 표기','겹받침 발음 심화','종합 문장 감별'],
  ['두 곳 고쳐 쓰기','문맥에 맞게 교정','세 가지 규칙 점검','기사·보고서 다듬기','최종 교정 데스크'],
  ['상황에 맞는 낱말','학습 어휘의 역할','관용 표현 읽기','문장 뜻 그대로','어휘 종합 판단'],
  ['한 글자의 음과 뜻','배움과 친구의 한자어','생활 속 한자어','태도와 가치의 한자어','문맥으로 푸는 한자어'],
];
export function getChallengeStage(world:number,stage:Stage):Stage {
  const title=stageTitles[world-1][stage.id-1];
  return {...stage,title,focus:title,questionCount:5};
}

const groups=[...vocabularyGroups,...grammarGroups,...editingGroups];

export const challengeQuestions: Question[] = [...groups.flatMap((group,index)=>group.map((line,i)=>{
  const [question,answer,wrong,explanation,hint]=line.split('|');
  const choices=[answer,...wrong.split(',')];
  const offset=(index+i)%4;
  return {
    id:`challenge-${Math.floor(index/5)+1}-${index%5+1}-${i+1}`,
    world:Math.floor(index/5)+1,stage:index%5+1,type:'sentence' as const,
    word:answer,question,answer,choices:[...choices.slice(offset),...choices.slice(0,offset)],
    hint,explanation:`정답은 ‘${answer}’이에요. ${explanation}`,difficulty:3,
  };
})),...vocabularyVillageQuestions('challenge'),...hanjaVillageQuestions('challenge')];

