# 문제 데이터

현재 기본 문제 편집본은 `data/basic-questions-266.csv`입니다. 기본은 266문항·25단계 구성을 유지하면서 반복 문제와 보스 문항을 보완했습니다. 처음 제공된 루트의 `batchim_questions_266.csv`는 참고용으로 보존했습니다. 도전은 `data/challenge.ts`의 125문항이며 단계마다 5문항입니다.

CSV를 수정한 뒤 PowerShell에서 다음 명령을 실행하면 앱 데이터와 녹음 대본이 갱신됩니다.

```powershell
pwsh -File scripts/import-questions.ps1
```

PowerShell 7에서 실행하세요. 실행 결과는 `data/questions-source.json`과 `public/audio/녹음대본.md`에 저장됩니다. 앱의 `data/questions.ts`는 JSON 데이터를 게임 타입에 연결합니다. `prompt`는 `question`, `imageHint`는 그림 설명으로 연결하며 받침 선택 문제의 `stem` 끝에는 빈칸 표시를 붙입니다. CSV의 문장 문제는 정답이 단어인 경우와 받침인 경우를 모두 그대로 유지합니다.

기본 최종 스테이지의 구성은 그림 2, 문장 4, 음성 4, 맞춤법 3, 단어 선택 2문항입니다. 기존 음성 14문항의 파일·대본은 유지합니다. 도전은 새 녹음 없이 풀 수 있는 문장 문제로 구성합니다.

기본 기록 저장 키는 `batchim-rescue-progress-v1`, 도전은 `batchim-rescue-challenge-progress-v1`입니다. 선택한 난이도는 새로고침 뒤에도 유지됩니다. 기본 문제에서 같은 질문·단어·정답의 반복(기존 녹음 제외), 도전의 중복·보기 누락, 난이도별 저장 분리는 `tests/difficulty.test.ts`에서 검사합니다.

도전은 6학년 수준의 문맥·어휘(`challenge-vocabulary.ts`), 활용·띄어쓰기(`challenge-grammar.ts`), 종합 문장 교정(`challenge-editing.ts`)으로 구성합니다. 각 문항은 `질문|정답|오답 3개(쉼표 구분)|풀이|힌트` 형식입니다. 힌트는 생각할 단서를 제공하고 풀이와 분리합니다. 여러 빈칸의 정답은 ` · `로 구분하며 긴 문장 보기는 세로로 배치합니다.

최고 수준은 중학교 1학년을 목표로 문맥·독해(expert-vocabulary.ts), 문장 구조·어문 규칙(expert-grammar.ts), 여러 조건의 문장 교정(expert-editing.ts) 125문항을 추가합니다. 문항 형식은 도전과 같고 data/expert.ts에서 25단계에 연결합니다. 기록 키는 batchim-rescue-expert-progress-v1이며 tests/expert.test.ts에서 문항·보기·난이도별 저장을 검사합니다.

6번 어휘 마을은 village-vocabulary-basic.ts / village-vocabulary-challenge.ts / village-vocabulary-expert.ts에 난이도별 25문항을 두고 vocabulary-village.ts에서 연결합니다. 전체 기본 291·도전 150·최고 수준 150문항이며 30단계입니다. 기존 CSV의 266문항은 유지합니다. tests/vocabulary-village.test.ts에서 세 난이도 완료와 6번 기록 복원·기존 기록 보존을 검사합니다.

7번 한자 마을은 hanja-basic.ts / hanja-challenge.ts / hanja-expert.ts에 난이도별 25문항을 두고 hanja-village.ts에서 연결합니다. 쉬운 한자의 음훈에서 시작해 두 글자 한자어와 문맥 속 한자어로 확장합니다. 전체 기본 316·도전 175·최고 수준 175문항이며 35단계입니다. tests/hanja-village.test.ts에서 세 난이도 완료와 7번 기록 복원을 검사합니다.
