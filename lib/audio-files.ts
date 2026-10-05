import { existsSync,statSync } from 'node:fs';
import { join } from 'node:path';
import type { Question } from '../types/game';
export function resolveAudioFiles(items:Question[],directory=join(process.cwd(),'public','audio')):{questions:Question[];missing:string[]} {
  const missing:string[]=[];
  const questions=items.map(q=>{
    if(q.type!=='audio') return q;
    const ext=['mp3','m4a','wav'].find(ext=>{
      const path=join(directory,`${q.id}.${ext}`);
      return existsSync(path)&&statSync(path).isFile()&&statSync(path).size>0;
    });
    if(!ext){missing.push(q.id);return q;}
    return {...q,audioSrc:`/audio/${q.id}.${ext}`};
  });
  return {questions,missing};
}
