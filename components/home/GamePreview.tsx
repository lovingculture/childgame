'use client';
import { useState } from 'react';
export function GamePreview(){
  const [choice,setChoice]=useState<string|null>(null);
  return <div className="preview-card"><div className="preview-top"><span className="pill">MISSION 01</span><span className="mini-score">⭐ 120</span></div><div className="preview-progress"><span/></div><p className="preview-label">받침을 찾아 단어를 구조해요!</p><p className="preview-hint">높은 땅을 무엇이라고 할까요?</p><div className="preview-word">{choice==='ㄴ'?'산':<>사<span className="blank-box">?</span></>}</div><div className="preview-choices">{['ㄱ','ㄴ','ㄹ','ㅁ'].map(c=><button key={c} className={choice===c?(c==='ㄴ'?'correct':'incorrect'):''} onClick={()=>setChoice(c)} aria-label={`${c} 받침 선택`}>{c}</button>)}</div><p className={'preview-feedback '+(choice==='ㄴ'?'success':'')} aria-live="polite">{choice==='ㄴ'?'✓ 구조 성공! 사 + ㄴ = 산':choice?'다시 생각해 봐요. 산의 받침을 찾아요!':'보기에서 받침을 눌러 보세요.'}</p></div>;
}
