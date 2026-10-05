import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,writeFileSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveAudioFiles } from '../lib/audio-files';
import type { Question } from '../types/game';
const q:Question={id:'5-3-01',world:5,stage:3,type:'audio',question:'듣기',word:'닭',answer:'닭',choices:['닭','달'],hint:'새',explanation:'닭이에요.',difficulty:1,audioSrc:'/audio/5-3-01.mp3',audioText:'닭이 걸어요.'};
test('녹음 미등록은 준비 중, 실제 파일 등록은 자동 연결한다',()=>{
  const dir=mkdtempSync(join(tmpdir(),'batchim-audio-'));
  try {
    assert.deepEqual(resolveAudioFiles([q],dir).missing,['5-3-01']);
    writeFileSync(join(dir,'5-3-01.m4a'),Buffer.from([0,0,0,20,102,116,121,112,77,52,65,32]));
    const result=resolveAudioFiles([q],dir);
    assert.equal(result.questions[0].audioSrc,'/audio/5-3-01.m4a');
    assert.equal(result.missing.length,0);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
