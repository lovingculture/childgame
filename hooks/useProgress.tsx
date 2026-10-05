'use client';
import { createContext,useContext,useEffect,useRef,useState,type ReactNode } from 'react';
import type { Progress,GameResult,Difficulty } from '../types/game';
import { emptyProgress,applyResult } from '../lib/progress';
import { readProgress,writeProgress,STORAGE_KEY } from '../lib/storage';
type ProgressContextValue={progress:Progress;difficulty:Difficulty;selectDifficulty:(difficulty:Difficulty)=>void;ready:boolean;storageError:boolean;saveResult:(world:number,stage:number,result:GameResult)=>void;updateSettings:(soundEnabled:boolean)=>void};
const ProgressContext=createContext<ProgressContextValue|null>(null);
export function ProgressProvider({children}:{children:ReactNode}) {
  const [progress,setProgress]=useState(emptyProgress);
  const [difficulty,setDifficulty]=useState<Difficulty>('basic');
  const mode=useRef<Difficulty>('basic');
  const records=useRef({basic:emptyProgress(),challenge:emptyProgress(),expert:emptyProgress()});
  const current=useRef(progress);
  const [ready,setReady]=useState(false);
  const [storageError,setStorageError]=useState(false);
  useEffect(()=>{
    try {
      window.localStorage.getItem(STORAGE_KEY);
      records.current={basic:readProgress(window.localStorage),challenge:readProgress(window.localStorage,'challenge'),expert:readProgress(window.localStorage,'expert')};
      const stored=window.localStorage.getItem('batchim-rescue-difficulty');
      const selected:Difficulty=stored==='challenge'||stored==='expert'?stored:'basic';
      mode.current=selected;setDifficulty(selected);
      const loaded=records.current[selected];
      current.current=loaded;setProgress(loaded);
    } catch {setStorageError(true);}
    setReady(true);
  },[]);
  function persist(next:Progress) {
    records.current[mode.current]=next;
    current.current=next;setProgress(next);
    try {setStorageError(!writeProgress(window.localStorage,next,mode.current));}catch{setStorageError(true);}
  }
  function selectDifficulty(selected:Difficulty) {
    mode.current=selected;setDifficulty(selected);
    current.current=records.current[selected];setProgress(current.current);
    try {window.localStorage.setItem('batchim-rescue-difficulty',selected);}catch{setStorageError(true);}
  }
  function saveResult(world:number,stage:number,result:GameResult) {persist(applyResult(current.current,world,stage,result));}
  function updateSettings(soundEnabled:boolean) {persist({...current.current,settings:{soundEnabled}});}
  return <ProgressContext.Provider value={{progress,difficulty,selectDifficulty,ready,storageError,saveResult,updateSettings}}>{children}</ProgressContext.Provider>;
}
export function useProgress() {
  const value=useContext(ProgressContext);
  if(!value) throw new Error('ProgressProvider가 필요합니다.');
  return value;
}
