import type { World } from '../types/game';

const definitions = [
  ['batchim-village','받침 마을','작은 받침 하나로 시작하는 첫 구조 임무','🏡','기본 받침 구조대 배지','#5B6CFF',['ㄴ 받침','ㄹ 받침','ㅁ 받침','ㅂ · ㅇ 받침','마을을 지켜라!']],
  ['confusion-forest','헷갈림 숲','소리는 비슷해도 모양은 달라요','🌳','받침 탐정 배지','#2A9D78',['ㅅ · ㅈ 구별','ㅈ · ㅊ 구별','ㄷ · ㅌ 구별','ㅂ · ㅍ 구별','숲의 비밀을 풀어라!']],
  ['sentence-city','문장 도시','문장 속 단서를 따라 단어를 구조해요','🏙️','문장 구조 전문가 배지','#E79A2A',['짧은 문장','문장 빈칸','헷갈리는 단어','맞춤법 고치기','도시 구조 작전!']],
  ['double-cave','겹받침 동굴','두 개의 받침이 함께하는 특별한 탐험','⛰️','겹받침 마스터 배지','#8B5CF6',['쌍받침 ㄲ · ㅆ','겹받침 ㄺ','겹받침 ㄻ · ㄼ','겹받침 ㅄ · ㄳ · ㅀ','동굴을 밝혀라!']],
  ['dictation-hq','받아쓰기 본부','보고, 읽고, 들으며 최고의 대원이 돼요','🚨','받침구조대 최고 대원','#EC6B8B',['그림 단어 구조','문장 받침 완성','소리 듣고 선택','맞춤법 고치기','최종 구조 작전!']],
  ['vocabulary-village','어휘 마을','낱말의 뜻과 쓰임을 익히고 표현의 힘을 키워요','📚','어휘 탐험가 배지','#168B91',['낱말의 뜻 알아보기','반대말 찾기','비슷한 말 찾기','상황에 맞는 낱말','이야기 속 어휘 종합']],
  ['hanja-village','한자 마을','한자의 음과 뜻을 읽고 한자어까지 차근차근 배워요','字','한자 탐험가 배지','#B37A2D',['자연을 나타내는 한자','생활과 크기의 한자','위치와 방향의 한자','몸과 물길의 한자','두 글자 한자 낱말']],
] as const;
export const worlds: World[] = definitions.map((d, index) => ({
  id:index+1,slug:d[0],title:d[1],description:d[2],icon:d[3],reward:d[4],color:d[5],
  stages:d[6].map((title,i)=>({id:i+1,title,focus:title,boss:i===4,questionCount:index>=5?5:i===4?(index<3?12:15):10})),
}));
export function findWorld(slug: string) { return worlds.find(w=>w.slug===slug); }
