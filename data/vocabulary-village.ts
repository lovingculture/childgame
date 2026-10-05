import type { Difficulty,Question } from '../types/game';
import { villageBasicGroups } from './village-vocabulary-basic';
import { villageChallengeGroups } from './village-vocabulary-challenge';
import { villageExpertGroups } from './village-vocabulary-expert';

export function vocabularyVillageQuestions(difficulty:Difficulty):Question[] {
  const groups=difficulty==='basic'?villageBasicGroups:difficulty==='challenge'?villageChallengeGroups:villageExpertGroups;
  return groups.flatMap((group,index)=>group.map((line,i)=>{
    const [question,answer,wrong,explanation,hint]=line.split('|');
    const choices=[answer,...wrong.split(',')],offset=(index+i)%4;
    return {id:`${difficulty}-6-${index+1}-${i+1}`,world:6,stage:index+1,type:'word-choice',
      question,word:answer,answer,choices:[...choices.slice(offset),...choices.slice(0,offset)],
      hint,explanation:`정답은 ‘${answer}’이에요. ${explanation}`,difficulty:difficulty==='basic'?1:difficulty==='challenge'?2:3};
  }));
}
