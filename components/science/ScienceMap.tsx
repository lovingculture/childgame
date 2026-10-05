'use client';
import Link from 'next/link';
import type { Difficulty } from '../../types/game';
import { scienceWorlds,scienceLabels,getScienceTitles,type ScienceWorld } from '../../data/science';
import { useScienceProgress } from '../../hooks/useScienceProgress';
import { totalStars,worldPieces } from '../../lib/progress';
import { StarRating } from '../game/StarRating';
import { GameCollection } from '../game/GameCollection';
export function ScienceMap({world}:{world?:ScienceWorld}){
  const {progress,difficulty,selectDifficulty,ready,storageError}=useScienceProgress();
  const pieces=Object.values(progress.stages).filter(s=>s.puzzlePiece).length;
  return <div className="game-shell shell science-shell">
    <Link className="back-link" href={world?'/science':'/'}>← {world?'과학 작전 지도':'게임 선택'}</Link>
    <div className="page-heading"><div><span className="eyebrow">SCIENCE RESCUE</span><h1>{world?world.title:'생명구조대 작전 지도'}</h1><p>{world?world.description:'관찰하고 비교하고 근거를 찾으며 과학을 구조해요.'}</p></div><span className="large-emoji">{world?.icon??'🔬'}</span></div>
    <section className="difficulty-selector" aria-label="과학 난이도"><div role="group" aria-label="난이도 선택">{(['basic','challenge','expert']as Difficulty[]).map(level=><button key={level} disabled={!ready} aria-pressed={difficulty===level} onClick={()=>selectDifficulty(level)}>{scienceLabels[level]}</button>)}</div><p>{difficulty==='basic'?'생활 속 관찰·분류 통합교과 탐구':difficulty==='challenge'?'현상 비교·원인과 결과 과학': '실험 조건·표와 자료 해석 과학'}</p><small>난이도마다 6개 테마 · 30단계 · 90문항. 과학 기록은 한글·연산 기록과 따로 저장돼요.</small></section>
    {!ready?<p role="status" className="loading">과학 학습 기록을 불러오는 중이에요…</p>:<>
      {storageError&&<p className="notice" role="status">이 브라우저에서 기록을 저장할 수 없어요. 지금 학습은 계속할 수 있어요.</p>}
      <section className="number-summary"><div className="number-summary-copy"><small>{scienceLabels[difficulty]}</small><h2>{world?`${worldPieces(progress,world.id)} / 5단계 완료`:'작은 발견이 과학의 시작이에요'}</h2><p>원하는 단계부터 자유롭게 출동하세요.</p></div><div><strong>{totalStars(progress)}<small> / 90</small></strong><span>모은 별</span></div><div><strong>{pieces}<small> / 30</small></strong><span>구조 조각</span></div></section>
      {world?<div className="stage-card-grid">{getScienceTitles(world.id,difficulty).map((title,i)=>{
        const record=progress.stages[`${world.id}-${i+1}`];
        return <Link className={`stage-card ${i===4?'boss':''}`} key={i} href={`/science/${world.slug}/${i+1}`}><div className="stage-card-top"><span className="stage-number">{world.id}-{i+1}</span><span className="stage-status">{record?.cleared?'✓ 완료':i===4?'종합 임무':'자유 선택'}</span></div><span className="stage-symbol">{world.icon}</span><h2>{title}</h2><p>3문제 · {i===4?'종합 탐구':'관찰과 생각'}</p><StarRating stars={record?.stars}/><div className="stage-bottom">{record?`최고 ${record.bestScore}점`:'과학 임무 시작 →'}</div></Link>;
      })}</div>:<div className="number-area-grid">{scienceWorlds.map(w=><Link key={w.id} className="number-area-card" href={`/science/${w.slug}`}><div className="number-area-top"><span className="number-area-symbol">{w.icon}</span><small>THEME 0{w.id}</small></div><h2>{w.title}</h2><p>{w.description}</p><div className="number-stage-stars">{[1,2,3,4,5].map(stage=><StarRating key={stage} stars={progress.stages[`${w.id}-${stage}`]?.stars}/>)}</div><div className="number-area-bottom"><span>{worldPieces(progress,w.id)} / 5단계</span><strong>탐구하러 가기 →</strong></div></Link>)}</div>}
      {!world&&<GameCollection game="science" stars={totalStars(progress)} maxStars={scienceWorlds.length*15}/>}
      <p className="learning-tip">교과 개념을 게임용 테마로 구성했습니다. 실제 실험은 교사·보호자의 안내를 따라요.</p>
    </>}
  </div>;
}
