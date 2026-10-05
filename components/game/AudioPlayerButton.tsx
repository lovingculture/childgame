'use client';
import { useAudio } from '../../hooks/useAudio';
import { useProgress } from '../../hooks/useProgress';
export function AudioPlayerButton({src}:{src?:string}){
  const {progress,updateSettings}=useProgress();
  const {playing,error,play}=useAudio(src,progress.settings.soundEnabled);
  return <div className="audio-controls"><button className="button audio-button" onClick={()=>{if(!progress.settings.soundEnabled)updateSettings(true);else void play();}}>{!progress.settings.soundEnabled?'🔊 소리 켜기':playing?'🔊 처음부터 다시 듣기':'🔊 문장 듣기'}</button><small>몇 번이든 다시 들을 수 있어요.</small>{error&&<p role="alert" className="notice">{error}</p>}</div>;
}
