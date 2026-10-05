import Link from 'next/link';
import type { World,Stage,StageProgress } from '../../types/game';
import { StarRating } from './StarRating';
export function StageCard({world,stage,record,unlocked,audioPending,challenge=false}:{world:World;stage:Stage;record?:StageProgress;unlocked:boolean;audioPending:boolean;challenge?:boolean}){
  const playable=unlocked&&!audioPending;
  const content=<><div className="stage-card-top"><span className="stage-number">{world.id}-{stage.id}</span><span className="stage-status">{audioPending?'🎙 녹음 준비 중':!unlocked?'🔒':record?.cleared?'✓ 완료':stage.boss?'⚡ 보스':'도전 가능'}</span></div><span className="stage-symbol">{stage.boss?'🏆':!challenge&&world.id===5&&stage.id===3?'🎧':record?.cleared?'🧩':'⚑'}</span><h2>{stage.title}</h2><p>{stage.questionCount}문제 · {stage.boss?'종합 구조 임무':world.id===7?'한자의 음과 뜻':world.id===6?'어휘의 뜻과 쓰임':challenge?'문맥·표기 판단':'차근차근 연습'}</p><StarRating stars={record?.stars}/><div className="stage-bottom">{record?`최고 ${record.bestScore.toLocaleString()}점`:audioPending?'녹음이 등록되면 시작할 수 있어요':playable?'구조 임무 시작 →':'이전 임무를 먼저 완료해요'}</div></>;
  return playable?<Link className={`stage-card ${stage.boss?'boss':''}`} href={`/game/${world.slug}/${stage.id}`}>{content}</Link>:<article className="stage-card locked">{content}</article>;
}

