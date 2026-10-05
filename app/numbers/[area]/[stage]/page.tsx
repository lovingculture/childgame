import { notFound } from 'next/navigation';
import { findNumberArea } from '../../../../data/numbers';
import { NumberGame } from '../../../../components/numbers/NumberGame';
export default async function NumberStagePage({params}:{params:Promise<{area:string;stage:string}>}){const {area:slug,stage}=await params;const area=findNumberArea(slug);if(!area||!/^([1-5])$/.test(stage))notFound();return <NumberGame key={`${area.id}-${stage}`} area={area} stage={Number(stage)}/>;}
