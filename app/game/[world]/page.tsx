import { notFound } from 'next/navigation';
import { findWorld } from '../../../data/worlds';
import { getStageQuestions } from '../../../data/questions';
import { resolveAudioFiles } from '../../../lib/audio-files';
import { StageMap } from '../../../components/game/StageMap';
export const dynamic='force-dynamic';
export default async function WorldPage({params}:{params:Promise<{world:string}>}){
  const {world:slug}=await params;
  const world=findWorld(slug);
  if(!world)notFound();
  const audioPending=world.stages.filter(s=>resolveAudioFiles(getStageQuestions(world.id,s.id)).missing.length>0).map(s=>s.id);
  return <StageMap world={world} audioPending={audioPending}/>;
}
