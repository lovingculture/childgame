'use client';
import Link from 'next/link';
import type { World } from '../../types/game';
import { useProgress } from '../../hooks/useProgress';
import { isStageUnlocked,worldPieces } from '../../lib/progress';
import { DifficultySelector } from './DifficultySelector';
import { getChallengeStage } from '../../data/challenge';
import { getExpertStage } from '../../data/expert';
import { StageCard } from './StageCard';
import { PuzzlePieceProgress } from './PuzzlePieceProgress';
export function StageMap({world,audioPending}:{world:World;audioPending:number[]}){
  const {progress,ready,difficulty}=useProgress();
  return <div className="game-shell shell"><Link href="/game" className="back-link">← 작전 지도</Link><div className="world-heading"><span className="large-emoji">{world.icon}</span><div><span className="eyebrow">WORLD 0{world.id}</span><h1>{world.title}</h1><p>{world.description}</p></div><PuzzlePieceProgress count={worldPieces(progress,world.id)}/></div><DifficultySelector/>{!ready?<p role="status" className="loading">학습 기록을 불러오는 중이에요…</p>:<><div className="stage-card-grid">{world.stages.map(s=><StageCard key={s.id} world={world} stage={difficulty==='expert'?getExpertStage(world.id,s):difficulty==='challenge'?getChallengeStage(world.id,s):s} record={progress.stages[`${world.id}-${s.id}`]} unlocked={isStageUnlocked(progress,world.id,s.id)} audioPending={difficulty==='basic'&&audioPending.includes(s.id)} challenge={difficulty!=='basic'}/>)}</div><div className="learning-tip">💡 <span>원하는 임무를 자유롭게 골라 보세요. 최초 정답률 70% 이상이면 구조 조각을 받아요!</span></div></>}</div>;
}


