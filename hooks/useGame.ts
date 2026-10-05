'use client';
import { useRef,useState } from 'react';
import { createGame,answerQuestion,useHint,nextQuestion,getGameResult } from '../lib/game-engine';
import type { Question } from '../types/game';
export function useGame(items:Question[]) {
  const [state,setState]=useState(()=>createGame(items));
  const started=useRef(0);
  function answer(choice:string) {
    const elapsed=started.current?Date.now()-started.current:10001;
    setState(s=>answerQuestion(s,choice,elapsed));
  }
  function next(){started.current=Date.now();setState(nextQuestion);}
  function startTimer(){if(!started.current) started.current=Date.now();}
  return {state,answer,next,hint:()=>setState(useHint),startTimer,result:state.finished?getGameResult(state):null};
}
