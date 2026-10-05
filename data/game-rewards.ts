import { rewards } from './rewards';
export type RewardGame='numbers'|'science';
const titles:Record<RewardGame,string[]>={
  numbers:['웃는 숫자 대원','연산 구조대 모자','특별 계산 배지','연산 탐험가 배지','황금 숫자 헬멧','완벽 연산 대원 트로피'],
  science:['웃는 탐구 대원','생명 구조대 모자','특별 탐구 배지','과학 탐험가 배지','황금 탐구 헬멧','완벽 생명 대원 트로피'],
};
export function getGameRewards(game:RewardGame,maxStars:number){
  return rewards.map((reward,index)=>({...reward,title:titles[game][index],stars:maxStars===60?(index+1)*10:reward.stars}));
}
export function newGameRewards(game:RewardGame,maxStars:number,before:number,after:number){
  return getGameRewards(game,maxStars).filter(reward=>before<reward.stars&&after>=reward.stars).map(reward=>reward.title);
}
