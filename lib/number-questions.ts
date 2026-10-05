import { numberAreas, type NumberArea, type NumberOperation } from '../data/numbers';
import type { Question } from '../types/game';
export type NumberQuestion=Question & {a:number;b:number;operation:NumberOperation;value:number;remainder:number;target:'result'|'left'|'right';expression:string};
export function carryCount(a:number,b:number):number {
  let carry=0,count=0;
  while(a||b){carry=(a%10+b%10+carry)>=10?1:0;count+=carry;a=Math.floor(a/10);b=Math.floor(b/10);}
  return count;
}
export function borrowCount(a:number,b:number):number {
  let borrow=0,count=0;
  while(a||b){borrow=(a%10-borrow)<b%10?1:0;count+=borrow;a=Math.floor(a/10);b=Math.floor(b/10);}
  return count;
}
function fits(area:NumberArea,stage:number,a:number,b:number):boolean {
  if(area.operation==='×') {
    if(area.digits===1)return true;
    const unitCarry=(a%10)*b>=10;
    const tensCarry=Math.floor(a/10)*b+Math.floor((a%10)*b/10)>=10;
    return stage===1?!unitCarry&&!tensCarry:stage===2?unitCarry&&!tensCarry:stage===3?a*b>=100:stage===4?unitCarry&&tensCarry:true;
  }
  if(area.operation==='+') {
    const carries=carryCount(a,b);
    if(stage===1)return carries===0;
    if(area.digits===2)return stage===2?a%10+b%10>=10:stage===3?a+b>=100:true;
    if(area.digits===3)return stage===2?a%10+b%10>=10&&carries===1:stage===3?a%10+b%10<10&&Math.floor(a/10)%10+Math.floor(b/10)%10>=10&&carries===1:stage===4?carries>=2:true;
    return stage===2?carries===1:stage===3?carries>=2:stage===4?a+b>=10000:true;
  }
  if(area.operation==='−') {
    const borrows=borrowCount(a,b);
    if(stage===1)return borrows===0;
    if(stage===2)return borrows===1;
    if(area.digits===2)return stage===3?a%10===0&&borrows>0:true;
    return stage===3?borrows>=2:stage===4?String(a).includes(area.digits===4?'00':'0')&&borrows>=2:true;
  }
  return true;
}
export function generateNumberQuestions(areaId:number,stage:number,seed:number):NumberQuestion[] {
  const area=numberAreas.find(item=>item.id===areaId);
  if(!area||!Number.isInteger(stage)||stage<1||stage>5)throw new Error('유효한 숫자구조대 단계가 필요합니다.');
  let randomState=seed>>>0;
  const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
  const integer=(min:number,max:number)=>min+Math.floor(random()*(max-min+1));
  const items:NumberQuestion[]=[],seen=new Set<string>();
  const min=10**(area.digits-1),max=10**area.digits-1;
  for(let attempt=0;items.length<10&&attempt<20000;attempt++) {
    let a:number,b:number;
    if(area.operation==='÷') {
      b=stage===1?integer(2,3):stage===2?integer(4,5):integer(2,9);
      if(stage===3)b=integer(6,9);
      const quotient=stage===4?integer(10,Math.floor(99/b)):integer(2,9);
      a=b*quotient+(stage===5?integer(1,b-1):0);
    } else if(area.operation==='×'&&area.digits===1) {
      a=stage<5?integer(stage*2,Math.min(stage*2+1,9)):integer(2,9);b=integer(1,9);
    } else {
      a=integer(min,max);b=integer(area.operation==='×'?1:min,area.operation==='×'?9:max);
      if(area.operation==='−'&&a<b)[a,b]=[b,a];
      if(area.operation==='−'&&stage===4&&area.digits>=3){a=integer(2,9)*10**(area.digits-1)+integer(0,9);b=integer(min,a-1);}
    }
    const signature=`${a}/${b}`;
    if(seen.has(signature)||!fits(area,stage,a,b))continue;
    seen.add(signature);
    const value=area.operation==='+'?a+b:area.operation==='−'?a-b:area.operation==='×'?a*b:Math.floor(a/b);
    const remainder=area.operation==='÷'?a%b:0;
    const index=items.length;
    const blank=area.operation!=='÷'&&((stage===4&&(area.digits===2||area.id===5))||(stage===5&&index%3===1));
    const target: NumberQuestion['target']=blank?(index%2?'left':'right'):'result';
    const targetValue=target==='left'?a:target==='right'?b:value;
    const answer=remainder?`몫 ${value}, 나머지 ${remainder}`:String(targetValue);
    const wrong=new Set<string>();
    if(remainder) {
      wrong.add(`몫 ${value+1}, 나머지 ${remainder}`);
      wrong.add(`몫 ${Math.max(0,value-1)}, 나머지 ${remainder}`);
      wrong.add(`몫 ${value}, 나머지 ${(remainder+1)%b}`);
    } else {
      for(const delta of [b,-b,1,-1,10,-10,100,-100]) {
        const option=targetValue+delta;
        if(option>=0&&option!==targetValue)wrong.add(String(option));
        if(wrong.size===3)break;
      }
    }
    const choices=[answer,...wrong];
    const rotation=index%4;
    const rotated=choices.slice(rotation).concat(choices.slice(0,rotation));
    const expression=blank?`${target==='left'?'□':a} ${area.operation} ${target==='right'?'□':b} = ${value}`:`${a} ${area.operation} ${b} = ?`;
    const story=stage===5&&index%3===0;
    const question=story?(area.operation==='+'?`도서관에 책이 ${a}권 있어요. ${b}권을 더 받으면 모두 몇 권일까요?`:area.operation==='−'?`창고에 색연필이 ${a}개 있었어요. ${b}개를 나누어 주면 몇 개가 남을까요?`:area.operation==='×'?`한 상자에 블록이 ${a}개씩 있어요. ${b}상자에는 모두 몇 개일까요?`:`구슬 ${a}개를 ${b}명에게 똑같이 나눠 주세요. 한 명이 받는 개수와 남는 개수는?`):blank?'□ 안에 들어갈 숫자를 고르세요.':remainder?'몫과 나머지를 함께 고르세요.':'식을 계산하고 알맞은 답을 고르세요.';
    const hint=blank?(area.operation==='+'?'전체에서 알고 있는 수를 빼면 빈칸의 수를 찾을 수 있어요.':area.operation==='−'?(target==='left'?'남은 수와 뺀 수를 더해 처음 수를 찾아요.':'처음 수에서 남은 수를 빼면 빈칸의 수를 찾아요.'):'곱을 알고 있는 수로 나누면 빈칸의 수를 찾을 수 있어요.'):area.operation==='+'?'일의 자리부터 더해요. 10이 되면 다음 자리로 1을 올려요.':area.operation==='−'?'일의 자리부터 빼요. 부족하면 왼쪽 자리에서 1을 빌려 10으로 바꿔요.':area.operation==='×'?'일의 자리부터 곱해요. 두 자리 수는 십의 자리와 일의 자리로 나누어 계산해요.':`${b}의 곱셈표에서 ${a}를 넘지 않는 가장 큰 수를 찾아요.`;
    const calculation=area.operation==='÷'?`${a} = ${b} × ${value} + ${remainder}. 몫은 ${value}, 나머지는 ${remainder}이에요.`:`${a} ${area.operation} ${b} = ${value}.`;
    const explanation=blank?`${calculation} 빈칸에는 ${targetValue}이 들어가요.`:`${calculation} ${area.operation==='×'&&area.digits===2?`${a}을 ${Math.floor(a/10)*10}과 ${a%10}로 나누면 ${Math.floor(a/10)*10*b} + ${a%10*b} = ${value}이에요.`:area.operation==='÷'?`나머지 ${remainder}은 나누는 수 ${b}보다 작아요.`:area.operation==='+'?`받아올림은 ${carryCount(a,b)}번 필요해요.`:`받아내림은 ${borrowCount(a,b)}번 필요해요.`}`;
    items.push({id:`number-${areaId}-${stage}-${index+1}`,world:areaId,stage,type:'word-choice',word:answer,answer,choices:rotated,question,hint,explanation,difficulty:stage,a,b,operation:area.operation,value,remainder,target,expression:story?'':expression});
  }
  if(items.length!==10)throw new Error('열 문제를 만들지 못했습니다.');
  return items;
}
