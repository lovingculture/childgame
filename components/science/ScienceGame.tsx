'use client';
import { useEffect,useRef,useState } from 'react';
import Link from 'next/link';
import { scienceWorlds,scienceLabels,getScienceTitles,getScienceQuestions,type ScienceWorld } from '../../data/science';
import { useScienceProgress } from '../../hooks/useScienceProgress';
import { useGame } from '../../hooks/useGame';
import { ScoreBoard } from '../game/ScoreBoard';
import { ProgressBar } from '../game/ProgressBar';
import { AnswerButton } from '../game/AnswerButton';
import { StarRating } from '../game/StarRating';
import { RewardModal } from '../game/RewardModal';
import { newGameRewards } from '../../data/game-rewards';
import { applyResult,totalStars } from '../../lib/progress';
export function ScienceGame({world,stage}:{world:ScienceWorld;stage:number}){
  const {ready,difficulty}=useScienceProgress();const [attempt,setAttempt]=useState(0);
  if(!ready)return <p className="loading" role="status">과학 임무를 준비하는 중이에요…</p>;
  return <SciencePlay key={`${difficulty}-${attempt}`} world={world} stage={stage} retry={()=>setAttempt(n=>n+1)}/>;
}
function SciencePlay({world,stage,retry}:{world:ScienceWorld;stage:number;retry:()=>void}){
  const {progress,difficulty,saveResult,storageError}=useScienceProgress();
  const game=useGame(getScienceQuestions(world.id,stage,difficulty));const saved=useRef(false);const [rewardTitles,setRewardTitles]=useState<string[]>([]);
  const wasCleared=useRef(progress.stages[`${world.id}-${stage}`]?.puzzlePiece);
  useEffect(()=>{game.startTimer();},[game]);
  useEffect(()=>{if(game.result&&!saved.current){saved.current=true;const next=applyResult(progress,world.id,stage,game.result);setRewardTitles(newGameRewards('science',scienceWorlds.length*15,totalStars(progress),totalStars(next)));saveResult(world.id,stage,game.result);}},[game.result,world.id,stage,saveResult,progress]);
  const question=game.state.queue[game.state.index],feedback=game.state.feedback;
  const next=stage<5?`/science/${world.slug}/${stage+1}`:world.id<scienceWorlds.length?`/science/${scienceWorlds[world.id].slug}`:null;
  return <div className="play-shell shell science-shell"><div className="game-heading"><Link className="back-link" href={`/science/${world.slug}`}>← 단계 선택</Link><div><small>생명구조대 / {world.id}-{stage}</small><h1>{getScienceTitles(world.id,difficulty)[stage-1]}</h1></div><span className="pill">{world.icon} {world.title}</span></div><p className="difficulty-game-label">{scienceLabels[difficulty]}</p>
    {storageError&&<p className="notice" role="status">학습 기록을 저장하지 못했어요. 지금 학습은 계속할 수 있어요.</p>}
    {game.result?<section className="result-card"><span className="large-emoji">{game.result.cleared?'🎉':'🌱'}</span><span className="eyebrow">SCIENCE MISSION REPORT</span><h1>{game.result.cleared?'과학 구조 임무 완료!':'한 번 더 탐구해 볼까요?'}</h1><div className="result-stars"><StarRating stars={game.result.stars}/></div><div className="result-stats"><div><span>획득 점수</span><strong>{game.result.score}<small>점</small></strong></div><div><span>최초 정답률</span><strong>{game.result.accuracy}<small>%</small></strong></div><div><span>최고 콤보</span><strong>{game.result.bestCombo}<small>연속</small></strong></div></div><p className="result-rate">처음 푼 {game.result.total}문제 중 {game.result.firstCorrect}문제 정답 · 힌트 {game.result.hints}회</p><div className="result-piece">{game.result.cleared?(wasCleared.current?'이미 모은 구조 조각이에요.':'🧩 구조 조각 +1'):'최초 정답률 70% 이상이면 구조 조각을 받아요.'}</div>{game.result.unresolved.length>0&&<div className="review-needed"><h2>다시 살펴볼 개념</h2>{game.result.unresolved.map(q=><p key={q.id}>{q.explanation}</p>)}</div>}<div className="result-actions">{next&&<Link className="button" href={next}>다음 임무 →</Link>}<button className="button secondary" onClick={retry}>다시 탐구하기</button><Link className="text-link" href="/science">과학 작전 지도</Link></div></section>:<>
      <ScoreBoard score={game.state.score} combo={game.state.combo} lives={game.state.lives}/>
      {game.state.round>0&&<p className="review-banner">재탐구 임무 · 틀린 문제를 다시 생각해요! ({game.state.round} / 2)</p>}
      {game.state.lives===0&&<p className="support-banner">탐구 지원 모드 · 천천히 읽고 계속 풀어 보세요.</p>}
      <ProgressBar current={game.state.index+1} total={game.state.queue.length}/>
      <section className="game-card science-question"><div className="game-card-label"><span className="pill muted">{world.icon} 관찰하고 생각해요</span><span>MISSION {String(game.state.index+1).padStart(2,'0')}</span></div><h2 className="question-text">{question.question}</h2><p className="answer-instruction">질문의 조건과 과학적 근거에 맞는 답을 골라 주세요.</p><div className="answer-grid">{question.choices.map((choice,i)=><AnswerButton key={choice} choice={choice} index={i} selected={feedback?.choice===choice} correct={feedback?.correct??null} disabled={Boolean(feedback)} onClick={()=>game.answer(choice)}/>)}</div><div className="hint-area">{!feedback&&<button className="hint-button" disabled={game.state.hinted} onClick={game.hint}>{game.state.hinted?'힌트를 확인했어요':'💡 힌트 보기 · −20점'}</button>}{game.state.hinted&&!feedback&&<p className="hint-text">{question.hint}</p>}</div>{feedback&&<div role="status" className={`feedback-box ${feedback.correct?'success-box':'retry-box'}`}><div><strong>{feedback.correct?'✓ 과학 구조 성공!':'다시 생각해 봐요.'}</strong>{feedback.correct&&<b>+{feedback.points}점</b>}</div><p>{question.explanation}</p>{!feedback.correct&&<small>잠시 뒤 재탐구 임무에서 다시 만나요.</small>}<button className="button" onClick={game.next}>{game.state.index+1===game.state.queue.length?(game.state.pending.length&&game.state.round<2?'재탐구 임무로 →':'결과 확인하기 →'):'다음 문제 →'}</button></div>}</section>
    </>}
    <RewardModal titles={rewardTitles} onClose={()=>setRewardTitles([])}/>
  </div>;
}
