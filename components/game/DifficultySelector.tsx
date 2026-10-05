'use client';
import { useProgress } from '../../hooks/useProgress';
export function DifficultySelector(){
  const {difficulty,selectDifficulty,ready}=useProgress();
  return <section className="difficulty-selector" aria-label="학습 난이도"><div role="group" aria-label="난이도 선택"><button disabled={!ready} aria-pressed={difficulty==='basic'} onClick={()=>selectDifficulty('basic')}>🌱 기본</button><button disabled={!ready} aria-pressed={difficulty==='challenge'} onClick={()=>selectDifficulty('challenge')}>🔥 도전</button><button disabled={!ready} aria-pressed={difficulty==='expert'} onClick={()=>selectDifficulty('expert')}>🏆 최고 수준</button></div><p>{difficulty==='basic'?'기초부터 차근차근 · 316문제':difficulty==='challenge'?'문맥·띄어쓰기·문장 교정 · 175문제':'독해·문장 구조·어문 규칙 종합 · 175문제'}</p><small>세 난이도의 별·진행 기록은 각각 저장돼요.</small></section>;
}

