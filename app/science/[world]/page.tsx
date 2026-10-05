import { notFound } from 'next/navigation';
import { scienceWorlds } from '../../../data/science';
import { ScienceMap } from '../../../components/science/ScienceMap';
export default async function ScienceWorldPage({params}:{params:Promise<{world:string}>}){const {world:slug}=await params;const world=scienceWorlds.find(w=>w.slug===slug);if(!world)notFound();return <ScienceMap world={world}/>;}
