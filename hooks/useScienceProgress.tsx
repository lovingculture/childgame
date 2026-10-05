'use client';
import { createContext,useContext,useEffect,useRef,useState,useCallback,type ReactNode } from 'react';
import type { Progress,GameResult } from '../types/game';
import { emptyProgress,applyResult } from '../lib/progress';
import { readScienceProgress,writeScienceProgress,SCIENCE_LEVEL_KEY } from '../lib/science-progress';
import type { Difficulty } from '../types/game';
type ScienceProgressValue={progress:Progress;difficulty:Difficulty;selectDifficulty:(level:Difficulty)=>void;ready:boolean;storageError:boolean;saveResult:(area:number,stage:number,result:GameResult)=>void};
const ScienceProgressContext=createContext<ScienceProgressValue|null>(null);
export function ScienceProgressProvider({children}:{children:ReactNode}) {
  const [progress,setProgress]=useState(emptyProgress);
  const current=useRef<Record<Difficulty,Progress>>({basic:emptyProgress(),challenge:emptyProgress(),expert:emptyProgress()});
  const [difficulty,setDifficulty]=useState<Difficulty>('basic');
  const [ready,setReady]=useState(false),[storageError,setStorageError]=useState(false);
  useEffect(()=>{
    try {
      const stored=window.localStorage.getItem(SCIENCE_LEVEL_KEY),level: Difficulty=stored==='challenge'||stored==='expert'?stored:'basic';
      current.current={basic:readScienceProgress(window.localStorage),challenge:readScienceProgress(window.localStorage,'challenge'),expert:readScienceProgress(window.localStorage,'expert')};
      setDifficulty(level);setProgress(current.current[level]);
    }catch{setStorageError(true);}
    setReady(true);
  },[]);
  const selectDifficulty=useCallback((level:Difficulty)=>{
    setDifficulty(level);setProgress(current.current[level]);
    try{window.localStorage.setItem(SCIENCE_LEVEL_KEY,level);}catch{setStorageError(true);}
  },[]);
  const saveResult=useCallback((area:number,stage:number,result:GameResult)=>{
    const next=applyResult(current.current[difficulty],area,stage,result);
    current.current[difficulty]=next;setProgress(next);
    try{setStorageError(!writeScienceProgress(window.localStorage,next,difficulty));}catch{setStorageError(true);}
  },[difficulty]);
  return <ScienceProgressContext.Provider value={{progress,difficulty,selectDifficulty,ready,storageError,saveResult}}>{children}</ScienceProgressContext.Provider>;
}
export function useScienceProgress(){const value=useContext(ScienceProgressContext);if(!value)throw new Error('ScienceProgressProvider가 필요합니다.');return value;}
