import { getNumberAreas,type NumberLevel,type NumberOperation } from '../data/numbers';
import type { NumberQuestion } from './number-questions';
export type Fraction={n:number;d:number};
type NumberFormat='integer'|'fraction'|'decimal';
export type GradeNumberQuestion=NumberQuestion & {operands:[Fraction,Fraction];result:Fraction;format:NumberFormat;answerDenominator?:number;extra?:{operation:NumberOperation;operand:Fraction}};
function gcd(a:number,b:number):number{while(b){[a,b]=[b,a%b];}return Math.abs(a)||1;}
function fraction(n:number,d=1):Fraction{const divisor=gcd(n,d);return {n:n/divisor,d:d/divisor};}
export function calculateFraction(a:Fraction,operation:NumberOperation,b:Fraction):Fraction{
  return operation==='+'?fraction(a.n*b.d+b.n*a.d,a.d*b.d):operation==='−'?fraction(a.n*b.d-b.n*a.d,a.d*b.d):operation==='×'?fraction(a.n*b.n,a.d*b.d):fraction(a.n*b.d,a.d*b.n);
}
export function formatFraction(value:Fraction,format:NumberFormat,denominator?:number):string{
  const reduced=fraction(value.n,value.d);
  if(format==='decimal')return (reduced.n/reduced.d).toFixed(4).replace(/\.?0+$/,'')||'0';
  if(denominator&&reduced.d!==1)return `${reduced.n*(denominator/reduced.d)}/${denominator}`;
  return reduced.d===1?String(reduced.n):`${reduced.n}/${reduced.d}`;
}
function displayFraction(value:Fraction,format:NumberFormat,mixed=false):string{
  if(mixed&&value.n>value.d&&value.n%value.d)return `${Math.floor(value.n/value.d)}과 ${value.n%value.d}/${value.d}`;
  return format==='fraction'?`${value.n}/${value.d}`:formatFraction(value,format);
}
export function generateGradeQuestions(level:Exclude<NumberLevel,'basic'>,areaId:number,stage:number,seed:number):GradeNumberQuestion[]{
  const area=getNumberAreas(level).find(item=>item.id===areaId);
  if(!area||!Number.isInteger(stage)||stage<1||stage>5)throw new Error('유효한 숫자 난이도와 단계가 필요합니다.');
  let state=seed>>>0;
  const integer=(min:number,max:number)=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return min+Math.floor(state/4294967296*(max-min+1));};
  const whole=(min:number,max:number):Fraction=>({n:integer(min,max),d:1});
  const decimal=(digits:number):Fraction=>({n:integer(1,10**(digits+1)-1),d:10**digits});
  const proper=():Fraction=>{const d=integer(2,12);return {n:integer(1,d-1),d};};
  const mixed=():Fraction=>{const d=integer(2,9);return {n:integer(1,4)*d+integer(1,d-1),d};};
  const items:GradeNumberQuestion[]=[],seen=new Set<string>();
  for(let attempt=0;items.length<10&&attempt<10000;attempt++){
    let a:Fraction,b:Fraction,format:NumberFormat='integer',operation=area.operation;
    let remainder=0,extra:GradeNumberQuestion['extra'];
    let expression='',target: NumberQuestion['target']='result';
    const addSubtract=areaId===1||areaId===2;
    if(level==='challenge'){
      if(addSubtract){
        if(stage<=2){a=whole(stage===1?100:1000,stage===1?999:4999);b=whole(stage===1?100:1000,stage===1?999:4999);}
        else if(stage===3){format='fraction';const d=integer(2,12);a={n:integer(1,d*3-1),d};b={n:integer(1,d*3-1),d};}
        else{format='decimal';a=decimal(stage===4?1:2);b=decimal(stage===4?1:2);}
      }else if(areaId===3){a=whole(stage===1||stage===4?10:100,stage===1||stage===4?99:999);b=whole(stage===2?2:10,stage===2?9:99);if(stage===4)target='right';}
      else{
        const divisor=integer(stage<=2?2:11,stage<=2?9:49);
        const quotient=integer(stage===1||stage===3?2:10,stage===1||stage===3?Math.floor(99/divisor):Math.floor((999-(stage>=4?divisor-1:0))/divisor));
        remainder=stage>=4?integer(1,divisor-1):0;
        a={n:divisor*quotient+remainder,d:1};b={n:divisor,d:1};
      }
    }else if(addSubtract){
      if(stage<=2||(stage===5&&items.length%2===0)){
        format='fraction';a=stage===2?mixed():proper();b=stage===2?mixed():proper();if(a.d===b.d)continue;
      }else{format='decimal';a=decimal(stage===4?3:2);b=decimal(stage===4?3:2);}
    }else if(areaId===3){
      if(stage<=3){format='fraction';a=stage===3?mixed():proper();b=stage===1?whole(2,12):proper();}
      else{format='decimal';a=decimal(2);b=stage===4?whole(2,9):decimal(2);}
    }else if(areaId===4){
      if(stage<=3){format='fraction';a=stage===2?whole(2,12):stage===3&&items.length%2?mixed():proper();b=stage===1?whole(2,9):stage===3&&items.length%3===0?mixed():proper();}
      else{format='decimal';b=stage===4?whole(2,9):decimal(1);a=calculateFraction(decimal(2),'×',b);}
    }else{
      format=stage===4?'decimal':stage===5?'fraction':'integer';
      a=stage===4?decimal(1):stage===5?proper():whole(2,20);
      b=stage===4?whole(2,9):stage===5?proper():whole(2,9);
      const c=stage===4?decimal(1):stage===5?proper():whole(2,20);
      if(stage===2||stage===4){operation='+';extra={operation:'×',operand:c};expression=`(${displayFraction(a,format)} + ${displayFraction(b,format)}) × ${displayFraction(c,format)} = ?`;}
      else{operation=stage===1?'×':'÷';if(stage===3)a=calculateFraction(a,'×',b);extra={operation:'+',operand:c};expression=`${displayFraction(c,format)} + ${displayFraction(a,format)} ${operation} ${displayFraction(b,format)} = ?`;}
    }
    if(operation==='−'&&a.n*b.d<b.n*a.d)[a,b]=[b,a];
    let result=calculateFraction(a,operation,b);
    if(extra)result=calculateFraction(result,extra.operation,extra.operand);
    const value=remainder?Math.floor(a.n/b.n):result.n/result.d;
    const answerDenominator=level==='challenge'&&format==='fraction'?a.d:undefined;
    const answer=remainder?`몫 ${value}, 나머지 ${remainder}`:formatFraction(target==='right'?b:result,format,answerDenominator);
    const left=displayFraction(a,format,level==='expert'&&stage===2&&addSubtract),right=displayFraction(b,format,level==='expert'&&stage===2&&addSubtract);
    if(!expression)expression=`${left} ${operation} ${target==='right'?'□':right} = ${target==='right'?formatFraction(result,format):'?'}`;
    if(seen.has(expression))continue;seen.add(expression);
    const wrong=new Set<string>();
    if(remainder){wrong.add(`몫 ${value+1}, 나머지 ${remainder}`);wrong.add(`몫 ${Math.max(0,value-1)}, 나머지 ${remainder}`);wrong.add(`몫 ${value}, 나머지 ${(remainder+1)%b.n}`);}
    else{
      const correct=target==='right'?b:answerDenominator?{n:result.n*answerDenominator/result.d,d:answerDenominator}:result;
      for(const delta of [1,-1,2,-2,3,10]){
        const option=fraction(correct.n+delta,correct.d);
        const label=formatFraction(option,format,answerDenominator);
        if(option.n>=0&&label!==answer)wrong.add(label);
        if(wrong.size===3)break;
      }
    }
    const choices=[answer,...wrong],rotation=items.length%4;
    const story=stage===5&&areaId<=2;
    const question=story?`물통에 물이 ${left} L 있어요. ${right} L를 ${operation==='+'?'더 부으면 모두':'사용하면 남은 물은'} 몇 L일까요?`:level==='challenge'&&areaId===3&&stage===5?`상자 하나에 연필이 ${left}개씩 있어요. ${right}상자에 있는 연필은 모두 몇 개일까요?`:level==='challenge'&&areaId===4&&stage===5?`구슬 ${a.n}개를 한 봉지에 ${b.n}개씩 담아요. 가득 채운 봉지 수와 남는 구슬 수는?`:target==='right'?'□ 안에 들어갈 수를 고르세요.':'계산하고 알맞은 답을 고르세요.';
    const hint=extra?'괄호를 먼저 계산하고, 곱셈·나눗셈을 덧셈·뺄셈보다 먼저 계산해요.':target==='right'?'곱을 알려진 수로 나누어 빈칸을 찾아요.':format==='fraction'?(addSubtract?(level==='challenge'?'분모는 그대로 두고 분자끼리 더하거나 빼요.':'분모를 같게 만든 뒤 분자끼리 계산해요. 답은 기약분수로 나타내요.'):operation==='×'?'분자끼리, 분모끼리 곱하고 약분해요. 자연수의 분모는 1이에요.':'나누는 분수의 분자와 분모를 뒤집어 곱한 뒤 약분해요.'):format==='decimal'?(addSubtract?'소수점을 맞춘 뒤 계산해요.':operation==='×'?'자연수처럼 곱한 뒤 두 수의 소수 자릿수만큼 소수점을 찍어요.':'나누는 수가 자연수가 되도록 두 수의 소수점을 똑같이 옮겨요.'):operation==='÷'?'나누는 수 × 몫 + 나머지가 처음 수와 같아야 해요. 나머지는 나누는 수보다 작아요.':'자릿값을 맞추고 받아올림·받아내림을 확인해요.';
    const explanation=remainder?`${a.n} = ${b.n} × ${value} + ${remainder}. 정답은 ${answer}이에요. 나머지는 ${b.n}보다 작아요.`:extra?`${expression.replace(' = ?','')} = ${answer}. 먼저 ${left} ${operation} ${right} = ${formatFraction(calculateFraction(a,operation,b),format)}을 계산한 뒤 ${extra.operation} ${displayFraction(extra.operand,format)}를 계산해요.`:`${left} ${operation} ${right} = ${formatFraction(result,format,answerDenominator)}. ${target==='right'?`빈칸의 수는 ${answer}이에요.`:`정답은 ${answer}이에요.`} ${hint}`;
    items.push({id:`number-${level}-${areaId}-${stage}-${items.length+1}`,world:areaId,stage,type:'word-choice',word:answer,answer,choices:choices.slice(rotation).concat(choices.slice(0,rotation)),question,hint,explanation,difficulty:stage,a:a.n/a.d,b:b.n/b.d,operation,value,remainder,target,expression:story?'':expression,operands:[a,b],result,format,answerDenominator,extra});
  }
  if(items.length!==10)throw new Error('학년별 열 문제를 만들지 못했습니다.');
  return items;
}
