export type NumberOperation = '+' | '−' | '×' | '÷';
export type NumberArea = {
  id:number; slug:string; title:string; description:string; operation:NumberOperation; digits:number;
  stages:{id:number;title:string}[];
};
const definitions:[string,string,string,NumberOperation,number,string[]][]=[
  ['multiply-one','곱셈 훈련소','구구단부터 빈칸과 생활 속 곱셈까지','×',1,['2~3단','4~5단','6~7단','8~9단','곱셈 종합 구조']],
  ['multiply-two','곱셈 훈련소 심화','두 자리 × 한 자리, 올림도 차근차근','×',2,['올림 없는 곱셈','일의 자리 올림','곱이 세 자리인 곱셈','여러 자리 올림과 빈칸','곱셈 문장제']],
  ['add-two','덧셈 마을','두 자리 수를 더하고, 받아올림과 빈칸 찾기를 연습해요','+',2,['받아올림 없이','일의 자리 받아올림','합이 100 이상','빈칸 속 숫자 찾기','덧셈 문장제']],
  ['add-three','덧셈 숲','세 자리 수의 각 자리를 맞춰 더해요','+',3,['받아올림 없이','일의 자리 받아올림','십의 자리 받아올림','여러 자리 받아올림','덧셈 종합 구조']],
  ['add-four','덧셈 성','네 자리 수를 천의 자리까지 더해요','+',4,['받아올림 없이','한 자리 받아올림','여러 자리 받아올림','합이 10000 이상과 빈칸','큰 수 문장제']],
  ['subtract-two','뺄셈 마을','두 자리 수를 빼고, 받아내림도 자신 있게 해결해요','−',2,['받아내림 없이','일의 자리 받아내림','0이 있는 수 빼기','빈칸 속 숫자 찾기','뺄셈 문장제']],
  ['subtract-three','뺄셈 숲','세 자리 수를 빼며 여러 자리의 받아내림을 알아요','−',3,['받아내림 없이','한 자리 받아내림','여러 자리 받아내림','0을 거치는 받아내림','뺄셈 종합 구조']],
  ['subtract-four','뺄셈 성','네 자리 수에서 여러 개의 0을 건너 빼요','−',4,['받아내림 없이','한 자리 받아내림','여러 자리 받아내림','여러 개의 0을 거치는 빼기','큰 수 문장제']],
  ['divide','나눗셈 탐험대','똑같이 나누고 몫과 나머지를 찾아요','÷',2,['2~3으로 나누기','4~5로 나누기','6~9로 나누기','몫이 두 자리인 나눗셈','나머지와 문장제']],
];
export const numberAreas:NumberArea[]=definitions.map(([slug,title,description,operation,digits,titles],index)=>({
  id:index+1,slug,title,description,operation,digits,stages:titles.map((title,i)=>({id:i+1,title})),
}));
export type NumberLevel='basic'|'challenge'|'expert';
export const numberLevelLabels:Record<NumberLevel,string>={basic:'기본',challenge:'도전',expert:'최고 수준'};
const gradeDefinitions:Record<'challenge'|'expert',[string,string,string,NumberOperation,string[]][]>={
  challenge:[
    ['addition','덧셈 마을','큰 수, 같은 분모의 분수, 소수의 덧셈','+',['세 자리 수 더하기','네 자리 수 더하기','분모가 같은 분수 더하기','소수 한 자리 더하기','소수 두 자리와 문장제']],
    ['subtraction','뺄셈 마을','받아내림, 같은 분모의 분수, 소수의 뺄셈','−',['세 자리 수 빼기','네 자리 수 빼기','분모가 같은 분수 빼기','소수 한 자리 빼기','소수 두 자리와 문장제']],
    ['multiplication','곱셈 훈련소','두 자리·세 자리 수의 곱셈과 빈칸 찾기','×',['두 자리 × 두 자리','세 자리 × 한 자리','세 자리 × 두 자리','곱셈의 빈칸 찾기','곱셈 생활 문장제']],
    ['division','나눗셈 탐험대','한 자리·두 자리로 나누고 나머지도 확인해요','÷',['두 자리 ÷ 한 자리','세 자리 ÷ 한 자리','두 자리 ÷ 두 자리','세 자리 ÷ 두 자리와 나머지','나머지 있는 생활 문장제']],
  ],
  expert:[
    ['addition','덧셈 마을','통분하는 분수, 대분수, 소수의 덧셈','+',['분모가 다른 분수 더하기','대분수 더하기','소수 두 자리 더하기','소수 세 자리 더하기','분수·소수 생활 문장제']],
    ['subtraction','뺄셈 마을','통분과 받아내림, 분수·소수의 뺄셈','−',['분모가 다른 분수 빼기','대분수 빼기','소수 두 자리 빼기','소수 세 자리 빼기','분수·소수 생활 문장제']],
    ['multiplication','곱셈 훈련소','분수와 자연수, 분수끼리, 소수끼리 곱해요','×',['분수 × 자연수','분수 × 분수','대분수 × 분수','소수 × 자연수','소수 × 소수']],
    ['division','나눗셈 탐험대','분수의 역수와 소수점 이동을 연습해요','÷',['분수 ÷ 자연수','자연수 ÷ 분수','분수 ÷ 분수','소수 ÷ 자연수','소수 ÷ 소수']],
    ['mixed','혼합 계산','계산 순서와 괄호를 확인하는 종합 임무','+',['덧셈과 곱셈의 순서','괄호가 있는 자연수 계산','나눗셈과 덧셈의 순서','괄호가 있는 소수 계산','분수의 혼합 계산']],
  ],
};
function gradeAreas(level:'challenge'|'expert'):NumberArea[]{return gradeDefinitions[level].map(([slug,title,description,operation,titles],index)=>({id:index+1,slug,title,description,operation,digits:0,stages:titles.map((title,i)=>({id:i+1,title}))}));}
export const numberAreasByLevel:Record<NumberLevel,NumberArea[]>={basic:numberAreas,challenge:gradeAreas('challenge'),expert:gradeAreas('expert')};
export function getNumberAreas(level:NumberLevel){return numberAreasByLevel[level];}
export function findNumberArea(slug:string){return [...numberAreas,...numberAreasByLevel.challenge,...numberAreasByLevel.expert].find(area=>area.slug===slug);}
