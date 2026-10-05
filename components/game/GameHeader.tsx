import Link from 'next/link';
import type { World,Stage } from '../../types/game';
export function GameHeader({world,stage,practice}:{world:World;stage:Stage;practice:boolean}){return <div className="game-heading"><Link href={`/game/${world.slug}`} className="back-link">← 임무 목록</Link><div><small>WORLD {world.id} / STAGE {world.id}-{stage.id}</small><h1>{practice?'보너스 연습 임무':stage.title}</h1></div><span className="pill">{practice?'별 보상 없는 복습':stage.boss?'⚡ 보스 임무':'🌱 학습 임무'}</span></div>;}
