'use client';
import { createContext,useContext,useEffect,useRef,useState,useCallback,type ReactNode } from 'react';
import type { Progress,GameResult } from '../types/game';
import { emptyProgress,applyResult } from '../lib/progress';
import { readNumberProgress,writeNumberProgress,NUMBER_LEVEL_KEY } from '../lib/number-progress';
import type { NumberLevel } from '../data/numbers';
type NumberProgressValue={progress:Progress;difficulty:NumberLevel;selectDifficulty:(level:NumberLevel)=>void;ready:boolean;storageError:boolean;saveResult:(area:number,stage:number,result:GameResult)=>void};
const NumberProgressContext=createContext<NumberProgressValue|null>(null);
export function NumberProgressProvider({children}:{children:ReactNode}) {
  const [progress,setProgress]=useState(emptyProgress);
  const current=useRef<Record<NumberLevel,Progress>>({basic:emptyProgress(),challenge:emptyProgress(),expert:emptyProgress()});
  const [difficulty,setDifficulty]=useState<NumberLevel>('basic');
  const [ready,setReady]=useState(false),[storageError,setStorageError]=useState(false);
  useEffect(()=>{
    try {
      const stored=window.localStorage.getItem(NUMBER_LEVEL_KEY),level: NumberLevel=stored==='challenge'||stored==='expert'?stored:'basic';
      current.current={basic:readNumberProgress(window.localStorage),challenge:readNumberProgress(window.localStorage,'challenge'),expert:readNumberProgress(window.localStorage,'expert')};
      setDifficulty(level);setProgress(current.current[level]);
    }catch{setStorageError(true);}
    setReady(true);
  },[]);
  const selectDifficulty=useCallback((level:NumberLevel)=>{
    setDifficulty(level);setProgress(current.current[level]);
    try{window.localStorage.setItem(NUMBER_LEVEL_KEY,level);}catch{setStorageError(true);}
  },[]);
  const saveResult=useCallback((area:number,stage:number,result:GameResult)=>{
    const next=applyResult(current.current[difficulty],area,stage,result);
    current.current[difficulty]=next;setProgress(next);
    try{setStorageError(!writeNumberProgress(window.localStorage,next,difficulty));}catch{setStorageError(true);}
  },[difficulty]);
  return <NumberProgressContext.Provider value={{progress,difficulty,selectDifficulty,ready,storageError,saveResult}}>{children}</NumberProgressContext.Provider>;
}
export function useNumberProgress(){const value=useContext(NumberProgressContext);if(!value)throw new Error('NumberProgressProvider가 필요합니다.');return value;}
