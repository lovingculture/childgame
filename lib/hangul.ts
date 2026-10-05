export const batchims = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
export function removeBatchim(word: string, index: number): string {
  const chars=[...word];
  const code=chars[index].charCodeAt(0);
  chars[index]=String.fromCharCode(code-((code-0xAC00)%28));
  return chars.join('');
}
export function getBatchim(word: string, index: number): string {
  return batchims[(word.charCodeAt(index)-0xAC00)%28];
}
export function blankWord(word: string, index: number): string {
  const stem=removeBatchim(word,index);
  return stem.slice(0,index+1)+'＿'+stem.slice(index+1);
}
