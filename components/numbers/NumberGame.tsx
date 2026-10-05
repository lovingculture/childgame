'use client';
import { useEffect,useRef,useState } from 'react';
import Link from 'next/link';
import { getNumberAreas,numberLevelLabels,type NumberArea } from '../../data/numbers';
import { generateNumberQuestions,type NumberQuestion } from '../../lib/number-questions';
import { generateGradeQuestions } from '../../lib/number-grade-questions';
import { useNumberProgress } from '../../hooks/useNumberProgress';
import { useGame } from '../../hooks/useGame';
import { ScoreBoard } from '../game/ScoreBoard';
import { ProgressBar } from '../game/ProgressBar';
import { AnswerButton } from '../game/AnswerButton';
import { StarRating } from '../game/StarRating';
import { CharacterMessage } from '../game/CharacterMessage';
import { RewardModal } from '../game/RewardModal';
import { newGameRewards } from '../../data/game-rewards';
import { applyResult,totalStars } from '../../lib/progress';
export function NumberGame({area:requestedArea,stage}:{area:NumberArea;stage:number}) {
  const {ready,difficulty}=useNumberProgress();
  const area=getNumberAreas(difficulty).find(item=>item.slug===requestedArea.slug);
  const [items,setItems]=useState<NumberQuestion[]|null>(null);
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{if(ready&&area){const seed=Date.now()^Math.floor(Math.random()*4294967296);setItems(difficulty==='basic'?generateNumberQuestions(area.id,stage,seed):generateGradeQuestions(difficulty,area.id,stage,seed));}},[ready,area,difficulty,stage,attempt]);
  if(ready&&!area)return <div className="game-shell shell number-shell"><p>이 영역은 선택한 난이도에 없어요. 작전 지도에서 난이도와 연산을 골라 주세요.</p><Link className="button" href="/numbers">숫자 작전 지도</Link></div>;
  if(!ready||!area||!items)return <p className="loading" role="status">숫자 구조 임무를 준비하는 중이에요…</p>;
  return <NumberPlay key={`${difficulty}-${area.slug}-${stage}-${attempt}`} area={area} stage={stage} items={items} onRetry={()=>{setItems(null);setAttempt(n=>n+1);}}/>;
}
function NumberPlay({area,stage,items,onRetry}:{area:NumberArea;stage:number;items:NumberQuestion[];onRetry:()=>void}) {
  const {progress,difficulty,saveResult,storageError}=useNumberProgress();
  const numberAreas=getNumberAreas(difficulty);
  const game=useGame(items);
  const saved=useRef(false);
  const [rewardTitles,setRewardTitles]=useState<string[]>([]);
  const initial=useRef(progress.stages[`${area.id}-${stage}`]);
  const current=game.state.queue[game.state.index] as NumberQuestion;
  const feedback=game.state.feedback;
  const next=stage<5?`/numbers/${area.slug}/${stage+1}`:area.id<numberAreas.length?`/numbers/${numberAreas[area.id].slug}`:null;
  useEffect(()=>{game.startTimer();},[game]);
  useEffect(()=>{
    if(game.result&&!saved.current){saved.current=true;const next=applyResult(progress,area.id,stage,game.result);setRewardTitles(newGameRewards('numbers',numberAreas.length*15,totalStars(progress),totalStars(next)));saveResult(area.id,stage,game.result);}
  },[area.id,stage,game.result,saveResult,progress,numberAreas.length]);
  return <div className="play-shell shell number-shell"><div className="game-heading"><Link className="back-link" href={`/numbers/${area.slug}`}>← 단계 선택</Link><div><small>숫자구조대 / {numberLevelLabels[difficulty]} / {area.id}-{stage}</small><h1>{area.stages[stage-1].title}</h1></div><span className="pill">{area.title}</span></div>
    {storageError&&<p className="notice" role="status">이번 기록을 저장하지 못했어요. 지금 학습은 계속할 수 있어요.</p>}
    {game.result?<section className="result-card number-result"><span className="large-emoji">{game.result.cleared?'★':'＋'}</span><span className="eyebrow">NUMBER MISSION REPORT</span><h1>{game.result.cleared?'숫자 구조 임무 완료!':'계산에 한 걸음 더 가까워졌어요!'}</h1><p>다시 풀거나 다른 임무를 자유롭게 골라 보세요.</p><div className="result-stars"><StarRating stars={game.result.stars}/></div><div className="result-stats"><div><span>획득 점수</span><strong>{game.result.score.toLocaleString()}<small>점</small></strong></div><div><span>최초 정답률</span><strong>{game.result.accuracy}<small>%</small></strong></div><div><span>최고 콤보</span><strong>{game.result.bestCombo}<small>연속</small></strong></div></div><p className="result-rate">처음 푼 10문제 중 {game.result.firstCorrect}문제 정답 · 힌트 {game.result.hints}회</p><div className="result-piece">{game.result.cleared?(initial.current?.puzzlePiece?'이미 모은 구조 조각이에요.':'구조 조각 +1'):'최초 정답률 70%부터 구조 조각을 받을 수 있어요.'}</div>{game.result.unresolved.length>0&&<div className="review-needed"><h2>다시 살펴볼 계산</h2>{game.result.unresolved.map(q=><div key={q.id}><p>{q.explanation}</p></div>)}</div>}<div className="result-actions">{next&&<Link href={next} className="button">다음 임무 →</Link>}<button className="button secondary" onClick={onRetry}>새 문제로 다시 도전</button><Link href="/numbers" className="text-link">숫자 작전 지도</Link></div></section>:<>
      <ScoreBoard score={game.state.score} combo={game.state.combo} lives={game.state.lives}/>
      {game.state.round>0&&<p className="review-banner">재구조 임무 · 틀린 계산을 다시 풀어요! ({game.state.round} / 2)</p>}
      {game.state.lives===0&&<p className="support-banner">구조 지원 모드 · 천천히 계산해도 괜찮아요.</p>}
      <ProgressBar current={game.state.index+1} total={game.state.queue.length}/>
      <section className="game-card number-question"><div className="game-card-label"><span className="pill muted">{area.operation==='÷'?'나눗셈 구조':'숫자를 구해요'}</span><span>MISSION {String(game.state.index+1).padStart(2,'0')}</span></div><h2 className="question-text">{current.question}</h2>{current.expression&&<div className="number-expression">{current.expression}</div>}<p className="answer-instruction">{current.remainder?'몫과 나머지가 모두 맞는 답을 골라 주세요.':difficulty==='expert'&&(current.expression.includes('/')||current.question.includes('/'))?'알맞은 답을 골라 주세요. 분수는 기약분수로 나타내요.':'알맞은 답을 골라 주세요.'}</p><div className={`answer-grid number-options ${current.remainder?'remainder-options':current.choices.some(choice=>choice.length>7)?'compact-number-options':''}`}>{current.choices.map((choice,index)=><AnswerButton key={choice} choice={choice} index={index} selected={feedback?.choice===choice} correct={feedback?.correct??null} disabled={Boolean(feedback)} onClick={()=>game.answer(choice)}/>)}</div><div className="hint-area">{!feedback&&<button className="hint-button" disabled={game.state.hinted} onClick={game.hint}>{game.state.hinted?'힌트를 확인했어요':'힌트 보기 · −20점'}</button>}{game.state.hinted&&!feedback&&<p className="hint-text">{current.hint}</p>}</div>{feedback&&<div className={`feedback-box ${feedback.correct?'success-box':'retry-box'}`} role="status"><div><strong>{feedback.correct?'✓ 숫자 구조 성공!':'다시 계산해 봐요.'}</strong>{feedback.correct&&<b>+{feedback.points}점</b>}</div><p>{current.explanation}</p>{!feedback.correct&&<small>잠시 뒤 재구조 임무에서 다시 풀 수 있어요.</small>}<button className="button" onClick={game.next}>{game.state.index+1===game.state.queue.length?'임무 이어가기 →':'다음 문제 →'}</button></div>}</section>
      <CharacterMessage message={feedback?.correct?'좋아! 숫자도 하나씩 구조하고 있어!':feedback?'풀이를 읽고 다시 계산해 보자.':difficulty==='basic'?'일의 자리부터, 차근차근 계산해 보자!':'분수와 소수의 계산 원리를 떠올려 보자!'}/>
    </>}
    <RewardModal titles={rewardTitles} onClose={()=>setRewardTitles([])}/>
  </div>;
}
