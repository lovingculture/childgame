import { notFound } from 'next/navigation';
import { findWorld } from '../../../../data/worlds';
import { getStageQuestions } from '../../../../data/questions';
import { resolveAudioFiles } from '../../../../lib/audio-files';
import { GameSession } from '../../../../components/game/GameSession';
export const dynamic='force-dynamic';
export default async function StagePage({params,searchParams}:{params:Promise<{world:string;stage:string}>;searchParams:Promise<{practice?:string}>}){
  const {world:slug,stage:id}=await params;
  const world=findWorld(slug);
  if(!world||!/^([1-5])$/.test(id))notFound();
  const stage=world.stages[Number(id)-1];
  const {practice}=await searchParams;
  const audio=resolveAudioFiles(getStageQuestions(world.id,stage.id));
  return <GameSession world={world} stage={stage} items={audio.questions} missing={audio.missing} practice={practice==='1'}/>;
}
