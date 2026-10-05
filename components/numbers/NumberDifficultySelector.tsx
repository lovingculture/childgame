'use client';
import { useNumberProgress } from '../../hooks/useNumberProgress';
import { numberLevelLabels,type NumberLevel } from '../../data/numbers';
export function NumberDifficultySelector(){
  const {difficulty,selectDifficulty,ready}=useNumberProgress();
  return <section className="difficulty-selector" aria-label="연산 난이도"><div role="group" aria-label="연산 난이도 선택">{(['basic','challenge','expert'] as NumberLevel[]).map(level=><button key={level} disabled={!ready} aria-pressed={difficulty===level} onClick={()=>selectDifficulty(level)}>{numberLevelLabels[level]}</button>)}</div><p>{difficulty==='basic'?'연산 기초 · 구구단, 네 자리 덧셈·뺄셈, 나머지 · 45단계':difficulty==='challenge'?'큰 수, 분수·소수의 덧셈·뺄셈, 확장 곱셈·나눗셈 · 20단계':'분수·소수의 사칙연산과 혼합 계산 · 25단계'}</p><small>난이도마다 점수·별·완료 기록을 따로 저장해요. 매번 새로운 10문제로 도전해요.</small></section>;
}
