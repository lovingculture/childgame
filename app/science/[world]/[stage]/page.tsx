import { notFound } from 'next/navigation';
import { scienceWorlds } from '../../../../data/science';
import { ScienceGame } from '../../../../components/science/ScienceGame';
export default async function ScienceStagePage({params}:{params:Promise<{world:string;stage:string}>}){const {world:slug,stage}=await params;const world=scienceWorlds.find(w=>w.slug===slug);if(!world||!/^([1-5])$/.test(stage))notFound();return <ScienceGame world={world} stage={Number(stage)}/>;}
