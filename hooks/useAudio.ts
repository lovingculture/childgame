'use client';
import { useEffect,useRef,useState } from 'react';
export function useAudio(src:string|undefined,enabled:boolean) {
  const audio=useRef<HTMLAudioElement|null>(null);
  const [playing,setPlaying]=useState(false);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{
    if(!src) return;
    const player=new Audio(src);audio.current=player;
    const end=()=>setPlaying(false);
    const fail=()=>{setPlaying(false);setError('음성을 불러오지 못했어요. 다시 듣기를 눌러 주세요.');};
    player.addEventListener('ended',end);player.addEventListener('error',fail);
    return ()=>{player.pause();player.currentTime=0;player.removeEventListener('ended',end);player.removeEventListener('error',fail);audio.current=null;};
  },[src]);
  useEffect(()=>{if(!enabled){audio.current?.pause();setPlaying(false);}},[enabled]);
  async function play(){
    if(!audio.current||!enabled) return;
    setError(null);
    audio.current.currentTime=0;
    try{await audio.current.play();setPlaying(true);}catch{setPlaying(false);setError('재생할 수 없어요. 소리 설정을 확인하고 다시 눌러 주세요.');}
  }
  function stop(){audio.current?.pause();if(audio.current)audio.current.currentTime=0;setPlaying(false);}
  return {playing,error,play,stop};
}
