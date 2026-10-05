import { notFound } from 'next/navigation';
import { findNumberArea } from '../../../data/numbers';
import { NumberMap } from '../../../components/numbers/NumberMap';
export default async function NumberAreaPage({params}:{params:Promise<{area:string}>}){const {area:slug}=await params;const area=findNumberArea(slug);if(!area)notFound();return <NumberMap area={area}/>;}
