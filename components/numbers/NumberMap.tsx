'use client';
import Link from 'next/link';
import { getNumberAreas,numberLevelLabels,type NumberArea } from '../../data/numbers';
import { useNumberProgress } from '../../hooks/useNumberProgress';
import { totalStars,worldPieces } from '../../lib/progress';
import { StarRating } from '../game/StarRating';
import { BatchimRobot } from '../characters/BatchimRobot';
import { NumberDifficultySelector } from './NumberDifficultySelector';
import { GameCollection } from '../game/GameCollection';
export function NumberMap({area:requestedArea}:{area?:NumberArea}) {
  const {progress,difficulty,ready,storageError}=useNumberProgress();
  const numberAreas=getNumberAreas(difficulty);
  const area=numberAreas.find(item=>item.slug===requestedArea?.slug);
  const pieces=Object.values(progress.stages).filter(s=>s.puzzlePiece).length;
  return <div className="game-shell shell number-shell">
    <Link href={area?'/numbers':'/'} className="back-link">← {area?'숫자 작전 지도':'게임 선택'}</Link>
    <div className="page-heading"><div><span className="eyebrow">NUMBER RESCUE {area?`/ AREA ${String(area.id).padStart(2,'0')}`:''}</span><h1>{area?area.title:'숫자구조대 작전 지도'}</h1><p>{area?area.description:'덧셈부터 나머지까지, 원하는 연산과 단계를 골라 출동해요.'}</p></div><span className="number-symbol" aria-hidden="true">{area?area.operation:'123'}</span></div>
    <NumberDifficultySelector/>
    {!ready?<p className="loading" role="status">숫자 학습 기록을 불러오는 중이에요…</p>:<>
      {requestedArea&&!area&&<p className="notice">선택한 난이도의 연산 영역에서 임무를 골라 주세요.</p>}
      {storageError&&<p className="notice" role="status">기록을 저장할 수 없어요. 지금은 풀 수 있지만 창을 닫으면 기록이 남지 않을 수 있어요.</p>}
      <section className="number-summary"><div className="number-summary-copy"><small>{numberLevelLabels[difficulty]} · 나의 숫자 구조 기록</small><h2>{area?`${worldPieces(progress,area.id)} / 5개의 단계 완료`:'매일 조금씩, 계산에 자신감이 생겨요'}</h2><p>받침구조대와 숫자구조대의 기록은 따로 저장돼요.</p></div><div><strong>{totalStars(progress)}<small> / {numberAreas.length*15}</small></strong><span>모은 별</span></div><div><strong>{pieces}<small> / {numberAreas.length*5}</small></strong><span>구조 조각</span></div></section>
      {area?<><div className="stage-card-grid">{area.stages.map(stage=>{
        const record=progress.stages[`${area.id}-${stage.id}`];
        return <Link className={`stage-card ${stage.id===5?'boss':''}`} href={`/numbers/${area.slug}/${stage.id}`} key={stage.id}><div className="stage-card-top"><span className="stage-number">{area.id}-{stage.id}</span><span className="stage-status">{record?.cleared?'✓ 완료':stage.id===5?'종합 임무':'자유 선택'}</span></div><span className="stage-symbol">{stage.id===5?'★':area.operation}</span><h2>{stage.title}</h2><p>10문제 · {stage.id===5?'풀이와 함께 연습':'차근차근 연습'}</p><StarRating stars={record?.stars}/><div className="stage-bottom">{record?`최고 ${record.bestScore.toLocaleString()}점`:'구조 임무 시작 →'}</div></Link>;
      })}</div><div className="learning-tip">원하는 단계를 자유롭게 골라 보세요. 최초 정답률 70% 이상이면 구조 조각을 받아요.</div></>:<div className="number-area-grid">{numberAreas.map(item=>{
        const stars=Object.values(progress.stages).filter(s=>s.worldId===item.id).reduce((sum,s)=>sum+s.stars,0);
        return <Link href={`/numbers/${item.slug}`} className="number-area-card" key={item.id}><div className="number-area-top"><span className="number-area-symbol">{item.operation}</span><small>AREA {String(item.id).padStart(2,'0')}</small></div><h2>{item.title}</h2><p>{item.description}</p><div className="number-stage-stars">{item.stages.map(stage=><StarRating key={stage.id} stars={progress.stages[`${item.id}-${stage.id}`]?.stars}/>)}</div><div className="number-area-bottom"><span>★ {stars} / 15 · {worldPieces(progress,item.id)} / 5단계</span><strong>출동하기 →</strong></div></Link>;
      })}</div>}
      {!area&&<GameCollection game="numbers" stars={totalStars(progress)} maxStars={numberAreas.length*15}/>}
      <div className="number-note"><BatchimRobot/><p>모르는 문제는 힌트를 보고 다시 도전해요.<br/>틀려도 괜찮아요. 다른 단계로 자유롭게 이동할 수 있어요.</p></div>
    </>}
  </div>;
}
