import Link from 'next/link';
import type { World,Progress } from '../../types/game';
import { worldPieces } from '../../lib/progress';
import { StarRating } from './StarRating';
import { PuzzlePieceProgress } from './PuzzlePieceProgress';
export function WorldCard({world,progress,unlocked}:{world:World;progress:Progress;unlocked:boolean}){
  const pieces=worldPieces(progress,world.id);
  const stars=Object.values(progress.stages).filter(s=>s.worldId===world.id).reduce((n,s)=>n+s.stars,0);
  const content=<><div className="world-card-top"><span className="world-emblem" style={{background:`${world.color}12`}}>{world.icon}</span><span className="pill">WORLD 0{world.id}</span><span className="world-state">{pieces===5?'✓ 구조 완료':unlocked?'작전 가능':'🔒 잠김'}</span></div><h2>{world.title}</h2><p>{world.description}</p><div className="world-stage-stars">{world.stages.map(s=><div key={s.id}><small>{world.id}-{s.id}</small><StarRating stars={progress.stages[`${world.id}-${s.id}`]?.stars}/></div>)}</div><div className="world-progress-bar"><span style={{width:`${pieces*20}%`,background:world.color}}/></div><div className="world-card-bottom"><PuzzlePieceProgress count={pieces}/><span>★ {stars} / 15</span></div>{pieces===5&&<p className="badge-label">🎖️ {world.reward}</p>}<div className="world-card-link">{unlocked?'임무 선택하기 →':`월드 ${world.id-1} 보스를 클리어하면 열려요`}</div></>;
  return unlocked?<Link href={`/game/${world.slug}`} className="world-card">{content}</Link>:<article className="world-card locked">{content}</article>;
}
