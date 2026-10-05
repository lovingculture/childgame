import { getGameRewards,type RewardGame } from '../../data/game-rewards';
export function GameCollection({game,stars,maxStars}:{game:RewardGame;stars:number;maxStars:number}){
  const rewards=getGameRewards(game,maxStars),next=rewards.find(reward=>reward.stars>stars);
  return <section className="collection-panel"><div className="section-heading"><span className="eyebrow">YOUR COLLECTION</span><h2>별이 모이면 선물이 열려요</h2><p>{next?`별 ${next.stars}개를 모으면 ${next.title} 보상을 받아요.`:'보상을 모두 모았어요!'}</p></div><div className="reward-list">{rewards.map(reward=><div className={stars>=reward.stars?'reward-item unlocked':'reward-item'} key={reward.title}><span>{reward.icon}</span><strong>{reward.title}</strong><small>{stars>=reward.stars?'✓ 획득':`★ ${reward.stars}개`}</small></div>)}</div><p className="learning-tip">현재 게임과 난이도에서 모은 별로 보상이 열려요. 같은 기기·브라우저·사이트 주소에서 기록이 유지돼요.</p></section>;
}
