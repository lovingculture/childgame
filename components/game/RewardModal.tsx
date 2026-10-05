'use client';
import { useEffect,useRef } from 'react';
export function RewardModal({titles,onClose}:{titles:string[];onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(titles.length)dialog.current?.showModal();},[titles]);
  return <dialog ref={dialog} className="reward-dialog" onCancel={onClose}><div className="reward-content"><span className="large-emoji">🎉</span><h2>새로운 보상을 받았어요!</h2>{titles.map(t=><p key={t} className="reward-title">{t}</p>)}<button className="button" onClick={()=>{dialog.current?.close();onClose();}}>좋아요! →</button></div></dialog>;
}
