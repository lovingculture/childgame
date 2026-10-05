import { questions } from '../data/questions';
import { resolveAudioFiles } from '../lib/audio-files';
const result=resolveAudioFiles(questions);
console.log(`음성 문제 ${questions.filter(q=>q.type==='audio').length}개 / 미등록 ${result.missing.length}개`);
for(const id of result.missing) console.log(`준비 중: public/audio/${id}.mp3 (m4a 또는 wav도 가능)`);
if(result.missing.length) process.exitCode=1;
