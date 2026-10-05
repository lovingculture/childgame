import type { Question, Stage } from '../types/game';
import { expertVocabularyGroups } from './expert-vocabulary';
import { expertGrammarGroups } from './expert-grammar';
import { expertEditingGroups } from './expert-editing';
import { vocabularyVillageQuestions } from './vocabulary-village';
import { hanjaVillageQuestions } from './hanja-village';

const stageTitles = [
  ['실용 표현의 정확한 선택','설명글의 관계 읽기','문맥에 따른 낱말의 뜻','정보의 비교와 요약','상황 속 어휘 적용'],
  ['조건과 근거의 판단','논리와 표현의 범위','비유 표현의 의미','제한과 가능성 읽기','어휘와 논리 종합 판단'],
  ['문맥 속 단어의 역할','문장 성분과 꾸밈','발음 변화와 표기','높임의 대상과 호응','연결과 부정의 범위'],
  ['행동의 주체와 대상','겹받침과 소리 변화 심화','부정의 이유와 논리','자연스러운 문장과 중의성','문법과 의미 종합'],
  ['뜻과 문장 관계','호응과 표현 점검','세 가지 조건 교정','글의 흐름 다듬기','최종 편집 회의'],
  ['문맥 속 다의어','추상 개념의 구별','관용 표현과 비유','논리 관계를 드러내는 어휘','복합 맥락의 어휘 판단'],
  ['공통 한자의 음훈과 뜻','두 글자의 뜻과 단어 구성','사회생활 속 한자어','자료와 판단의 한자어','한자어 관계 종합'],
];
export function getExpertStage(world:number,stage:Stage):Stage {
  const title=stageTitles[world-1][stage.id-1];
  return {...stage,title,focus:title,questionCount:5};
}

const groups=[...expertVocabularyGroups,...expertGrammarGroups,...expertEditingGroups];
export const expertQuestions:Question[]=[...groups.flatMap((group,index)=>group.map((line,i)=>{
  const [question,answer,wrong,explanation,hint]=line.split('|');
  const choices=[answer,...wrong.split(',')],offset=(index+i)%4;
  return {
    id:`expert-${Math.floor(index/5)+1}-${index%5+1}-${i+1}`,
    world:Math.floor(index/5)+1,stage:index%5+1,type:'sentence' as const,
    word:answer,question,answer,choices:[...choices.slice(offset),...choices.slice(0,offset)],
    hint,explanation:`정답은 ‘${answer}’이에요. ${explanation}`,difficulty:3,
  };
})),...vocabularyVillageQuestions('expert'),...hanjaVillageQuestions('expert')];
