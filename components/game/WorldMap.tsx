'use client';
import Link from 'next/link';
import { worlds } from '../../data/worlds';
import { rewards } from '../../data/rewards';
import { useProgress } from '../../hooks/useProgress';
import { isStageUnlocked,totalStars } from '../../lib/progress';
import { DifficultySelector } from './DifficultySelector';
import { WorldCard } from './WorldCard';
import { RescueCaptain } from '../characters/RescueCaptain';
export function WorldMap(){
  const {progress,ready,storageError}=useProgress();
  const stars=totalStars(progress);
  const nextReward=rewards.find(r=>r.stars>stars);
  const pieces=Object.values(progress.stages).filter(s=>s.puzzlePiece).length;
  return <div className="game-shell shell"><div className="page-heading"><div><span className="eyebrow">RESCUE OPERATIONS</span><h1>받침구조대 작전 지도</h1><p>어느 곳으로 떠나 볼까요? 한 단계씩 받침을 구조해요.</p></div><span className="pill muted">나의 첫 모험부터, 차근차근</span></div><DifficultySelector/>{!ready?<p className="loading" role="status">학습 기록을 불러오는 중이에요…</p>:<>{storageError&&<p className="notice" role="status">학습 기록을 저장할 수 없어요. 지금은 계속 플레이할 수 있지만 창을 닫으면 기록이 사라질 수 있어요.</p>}<section className="mission-summary"><div className="summary-character"><RescueCaptain gold={stars>=60} hat={stars>=20} smile={stars>=10}/></div><div className="summary-copy"><small>나의 구조 기록</small><h2>{pieces?`${pieces}개의 임무를 구조했어요!`:'첫 번째 구조 임무를 시작해요!'}</h2><p>{nextReward?`별 ${nextReward.stars}개를 모으면 ${nextReward.title} 보상을 받아요.`:stars>=105?'모든 별을 모았어요. 완벽한 구조대원이에요!':'보상을 모두 받았어요. 어휘·한자 마을에도 도전해 보세요!'}</p></div><div className="summary-stat"><span>★</span><strong>{stars}<small> / 105</small></strong><label>모은 별</label></div><div className="summary-stat"><span>🧩</span><strong>{pieces}<small> / 35</small></strong><label>구조 조각</label></div></section><div className="world-card-grid">{worlds.map(w=><WorldCard key={w.id} world={w} progress={progress} unlocked={isStageUnlocked(progress,w.id,1)}/>)}</div><section className="collection-panel"><div className="section-heading"><span className="eyebrow">YOUR COLLECTION</span><h2>별이 모이면 선물이 열려요</h2></div><div className="reward-list">{rewards.map(r=><div className={stars>=r.stars?'reward-item unlocked':'reward-item'} key={r.stars}><span>{r.icon}</span><strong>{r.title}</strong><small>{stars>=r.stars?'✓ 획득':`★ ${r.stars}개`}</small></div>)}</div>{stars>=45&&<Link className="button secondary" href={`/game/${worlds[0].slug}/1?practice=1`}>보너스 연습 임무 →</Link>}</section></>}</div>;
}
