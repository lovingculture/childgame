'use client';
import { useEffect,useRef,useState } from 'react';
import Link from 'next/link';
import type { World,Stage,Question } from '../../types/game';
import { useProgress } from '../../hooks/useProgress';
import { useGame } from '../../hooks/useGame';
import { isStageUnlocked,totalStars,worldPieces } from '../../lib/progress';
import { challengeQuestions,getChallengeStage } from '../../data/challenge';
import { expertQuestions,getExpertStage } from '../../data/expert';
import { rewards } from '../../data/rewards';
import { GameHeader } from './GameHeader';
import { ScoreBoard } from './ScoreBoard';
import { ProgressBar } from './ProgressBar';
import { GameCard } from './GameCard';
import { CharacterMessage } from './CharacterMessage';
import { StageResult } from './StageResult';
import { RewardModal } from './RewardModal';
export function GameSession({world,stage,items,missing,practice=false}:{world:World;stage:Stage;items:Question[];missing:string[];practice?:boolean}){
  const {progress,ready,difficulty}=useProgress();
  const [attempt,setAttempt]=useState(0);
  if(!ready)return <p className="loading" role="status">학습 기록을 불러오는 중이에요…</p>;
  if(!isStageUnlocked(progress,world.id,stage.id)||(practice&&totalStars(progress)<45))return <div className="shell empty-state"><span className="large-emoji">🔒</span><h1>아직 열리지 않은 임무예요.</h1><p>{practice?'별 45개를 모으면 보너스 연습 임무가 열려요.':'이전 임무를 완료하면 시작할 수 있어요.'}</p><Link href="/game" className="button">작전 지도로 →</Link></div>;
  if(difficulty==='basic'&&missing.length)return <div className="shell empty-state"><span className="large-emoji">🎙️</span><h1>녹음 준비 중이에요.</h1><p>문장 듣기 파일이 등록되면 이 임무를 시작할 수 있어요.</p><Link href={`/game/${world.slug}`} className="button">다른 임무 보기 →</Link></div>;
  return <Play key={`${difficulty}-${world.id}-${stage.id}-${attempt}`} world={world} stage={difficulty==='expert'?getExpertStage(world.id,stage):difficulty==='challenge'?getChallengeStage(world.id,stage):stage} items={difficulty==='basic'?items:(difficulty==='expert'?expertQuestions:challengeQuestions).filter(q=>q.world===world.id&&q.stage===stage.id)} practice={practice} retry={()=>setAttempt(n=>n+1)}/>;
}
function Play({world,stage,items,practice,retry}:{world:World;stage:Stage;items:Question[];practice:boolean;retry:()=>void}){
  const {progress,saveResult,storageError,updateSettings,difficulty}=useProgress();
  const game=useGame(items);
  const saved=useRef(false);
  const initial=useRef(progress);
  const [rewardTitles,setRewardTitles]=useState<string[]>([]);
  const [modalClosed,setModalClosed]=useState(false);
  const newPiece=Boolean(game.result?.cleared&&!initial.current.stages[`${world.id}-${stage.id}`]?.puzzlePiece);
  useEffect(()=>{game.startTimer();},[game]);
  useEffect(()=>{
    if(!game.result||saved.current||practice)return;
    saved.current=true;
    const oldStars=totalStars(initial.current);
    const oldRecord=initial.current.stages[`${world.id}-${stage.id}`];
    const earned=oldStars-(oldRecord?.stars??0)+Math.max(oldRecord?.stars??0,game.result.stars);
    const titles=rewards.filter(r=>oldStars<r.stars&&earned>=r.stars).map(r=>`${r.icon} ${r.title}`);
    if(newPiece&&worldPieces(initial.current,world.id)===4)titles.push(`🎖️ ${world.reward}`);
    setRewardTitles(titles);
    saveResult(world.id,stage.id,game.result);
  },[game.result,newPiece,practice,saveResult,stage.id,world.id,world.reward]);
  return <div className="play-shell shell"><GameHeader world={world} stage={stage} practice={practice}/><p className="difficulty-game-label">{world.id===7?(difficulty==='expert'?'🏆 최고 수준 · 한자어와 문맥 종합':difficulty==='challenge'?'🔥 도전 · 한자어의 음과 뜻':'🌱 기본 · 쉬운 한자의 음과 뜻'):world.id===6?(difficulty==='expert'?'🏆 최고 수준 · 문맥과 어휘 종합 판단':difficulty==='challenge'?'🔥 도전 · 어휘의 뜻과 쓰임':'🌱 기본 · 낱말의 뜻과 관계'):difficulty==='expert'?'🏆 최고 수준 · 독해와 문법 종합 판단':difficulty==='challenge'?'🔥 도전 · 문맥과 표기를 함께 판단':'🌱 기본 · 받침을 차근차근'}</p>{storageError&&<p className="notice" role="status">이번 기록을 브라우저에 저장하지 못했어요. 지금 학습은 계속할 수 있어요.</p>}{game.result?<><StageResult world={world} stage={stage} result={game.result} newPiece={newPiece&&!practice} practice={practice} onRetry={retry}/>{rewardTitles.length>0&&!modalClosed&&<RewardModal titles={rewardTitles} onClose={()=>setModalClosed(true)}/>}</>:<><ScoreBoard score={game.state.score} combo={game.state.combo} lives={game.state.lives}/>{game.state.round>0&&<p className="review-banner">🛟 재구조 임무 · 틀렸던 문제를 다시 구해요! ({game.state.round} / 2)</p>}{game.state.lives===0&&<p className="support-banner">🤝 구조 지원 모드 · 천천히 풀어도 괜찮아요. 기본 점수를 받을 수 있어요.</p>}<ProgressBar current={game.state.index+1} total={game.state.queue.length}/><GameCard question={game.state.queue[game.state.index]} state={game.state} onAnswer={game.answer} onHint={game.hint} onNext={game.next}/><CharacterMessage message={game.state.feedback?.correct?game.state.combo>=3?`🔥 ${game.state.combo}연속 구조 성공! 정말 잘하고 있어!`:'정확해! 받침을 구했어!':game.state.feedback?'괜찮아! 설명을 읽고 다시 도전하자.':'서두르지 않아도 돼. 단서를 읽고 골라 보자!'}/><button className="sound-setting" onClick={()=>updateSettings(!progress.settings.soundEnabled)} aria-pressed={progress.settings.soundEnabled}>{progress.settings.soundEnabled?'🔊 소리 켜짐':'🔇 소리 꺼짐'}</button></>}</div>;
}


