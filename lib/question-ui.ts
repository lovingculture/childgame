export function getAnswerInstruction(answer:string):string {
  if(answer.includes(' · '))return '빈칸 순서에 맞는 조합을 선택해 주세요.';
  if(answer.includes(' '))return '문맥에 맞고 표기가 바른 표현을 선택해 주세요.';
  return /^[ㄱ-ㅎ]+$/.test(answer)?'빈자리에 들어갈 받침을 골라 주세요.':'알맞은 단어를 선택해 주세요.';
}
