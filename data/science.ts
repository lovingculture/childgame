import type { Difficulty,Question } from '../types/game';
import { basicScience } from './science/basic';
import { challengeScience } from './science/challenge';
import { expertScience } from './science/expert';

export const scienceLabels:Record<Difficulty,string>={basic:'🌱 기본',challenge:'🔥 도전',expert:'🏆 최고 수준'};
export const scienceWorlds=[
  {id:1,slug:'life-forest',title:'생명 탐험 숲',icon:'🌿',description:'동식물의 모습부터 생물과 환경의 관계까지'},
  {id:2,slug:'matter-lab',title:'물질 연구 마을',icon:'🧪',description:'생활 속 재료부터 용액과 기체까지'},
  {id:3,slug:'energy-city',title:'힘과 에너지 도시',icon:'⚡',description:'밀고 당기기부터 전기와 에너지까지'},
  {id:4,slug:'earth-cave',title:'지구 탐사 동굴',icon:'🌍',description:'돌과 흙부터 지층·지구의 변화까지'},
  {id:5,slug:'space-station',title:'날씨와 우주 관측소',icon:'🔭',description:'계절과 밤하늘부터 날씨 자료와 우주까지'},
  {id:6,slug:'environment-hq',title:'환경 구조 본부',icon:'♻️',description:'생활 속 실천부터 생태계·기후 문제 해결까지'},
];
export type ScienceWorld=typeof scienceWorlds[number];
const titles:Record<Difficulty,string[][]>={
  basic:[['동물의 특징','식물의 모습','생물 돌보기','자연 속 생물','생명 관찰 임무'],['생활 속 재료','촉감과 분류','물과 얼음','공기와 변화','재료 탐험 임무'],['밀기와 당기기','힘과 움직임','소리 듣기','빛과 그림자','안전한 에너지 생활'],['돌과 모래','흙 관찰','산과 강','물과 우리 생활','안전한 땅 탐사'],['오늘의 날씨','계절의 모습','낮과 밤','달 관찰','날씨 기록 임무'],['쓰레기 줄이기','물과 전기 아끼기','생물의 집 지키기','환경 생활 습관','우리 반 환경 약속']],
  challenge:[['동물의 생활','식물의 구조','생물의 한살이','환경과 생물','생명 탐구 방법'],['물질의 성질','고체·액체·기체','물의 상태 변화','혼합물 분리','물질 비교 실험'],['힘의 효과','자석의 성질','소리의 성질','빛과 그림자 탐구','힘과 소리 종합'],['암석 분류','물과 땅의 변화','지층과 화석','화산과 지진','지구 탐사 자료'],['날씨 요소','태양계의 천체','태양과 그림자','달의 모습 변화','관측 자료 해석'],['생물과 환경','자원 다시 쓰기','환경 실천 비교','생물의 다양성','환경 해결 계획']],
  expert:[['식물의 기능','우리 몸의 기능','균류와 분해','생태계와 적응','생명 실험 설계'],['용해와 용액','용액의 진하기','산성과 염기성','여러 가지 기체','분리 방법 판단'],['힘과 마찰','전기 회로','전자석과 비교','열의 이동','에너지 전환'],['지구와 바다','자전과 공전','밤낮의 원리','지층과 지형 해석','침식 실험 설계'],['수증기와 날씨','기압과 바람','계절 변화','달과 우주 모형','날씨·기후 자료'],['먹이 관계','생태계의 균형','기후변화 탐구','지속 가능한 에너지','환경 자료로 판단']],
};
export function getScienceTitles(world:number,level:Difficulty){return titles[level][world-1];}
export function getScienceQuestions(world:number,stage:number,level:Difficulty):Question[]{
  const bank=level==='basic'?basicScience:level==='challenge'?challengeScience:expertScience;
  const rows=bank[(world-1)*5+stage-1]??[];
  return rows.map((line,i)=>{
    const [question,answer,wrong,explanation]=line.split('|');
    const choices=[answer,...wrong.split('~')],offset=(world+stage+i)%4;
    return {id:`science-${level}-${world}-${stage}-${i+1}`,world,stage,type:'word-choice',question,word:answer,answer,
      choices:[...choices.slice(offset),...choices.slice(0,offset)],difficulty:level==='basic'?1:level==='challenge'?2:3,
      hint:`‘${titles[level][world-1][stage-1]}’에서 배운 특징을 떠올려 보세요. 관찰한 사실과 짐작을 구별하고 질문의 조건을 하나씩 확인해요.`,
      explanation:`정답은 ‘${answer}’이에요. ${explanation}`};
  });
}
