# 받침구조대 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution or superpowers:subagent-driven-development if the user selects delegation. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 초등학생이 5개 월드·25개 스테이지에서 받침을 연습하고 복습·보상을 이어가는 완성된 MVP를 구현한다.

**Architecture:** Next.js App Router가 페이지와 유효한 경로를 제공한다. 순수 함수 게임 엔진이 점수와 복습을 계산하고 React 훅이 UI, 브라우저 저장, 오디오를 연결한다. 문제 데이터는 UI와 독립적으로 검증한다.

**Tech Stack:** 최신 안정 Next.js, React, TypeScript, Tailwind CSS; Node 내장 테스트와 tsx; 필요할 때만 브라우저 검증 도구.

**Spec:** ../specs/2026-10-05-batchim-rescue-design.md

## Global Constraints
- 기존 hwpx·zip·agents.md를 보존하고 현재 폴더에 프로젝트를 만든다.
- 5개 월드, 25개 스테이지, 총 266문제. 일반 10문제, 월드 1~3 보스 12문제, 월드 4~5 보스 15문제.
- 최종 스테이지: 그림 3, 문장 받침 4, 음성 3, 맞춤법 3, 종합 2문제.
- 정답률은 최초 풀이 기준. 복습은 최대 2회. 기회 0회에도 학습 지속.
- 정답 100점, 최초 정답 20점, 10초 이내 20점. 콤보 보너스는 3~4회 10점, 5~9회 20점, 10회 이상 50점.
- 지원 모드와 복습 정답은 기본 점수만 지급. 힌트 문제당 1회·20점 감점, 총점 하한 0점.
- 70% 클리어·별 1개, 80% 별 2개, 90% 및 힌트 2회 이하 별 3개.
- 조각은 최초 클리어만 지급. 재도전으로 기존 최고 기록을 낮추지 않는다.
- 파일 음성 반복 재생. 합성 음성 사용 사실을 README에 명시한다.
- 로그인·서버 DB·AI 추천은 추가하지 않는다. 버튼 최소 48px, 키보드 조작·반응형 지원.
- npm install, npm run dev로 실행 가능해야 한다. 작업 환경에서는 확인된 pnpm 실행 경로를 사용할 수 있다.

## Review Focus
- 잠긴 게임 URL 직접 접근: 저장 로드 뒤 잠금 안내를 표시하며 플레이를 차단한다. Task 3·5에서 검증.
- 브라우저 저장 차단·손상: 유효한 기본값으로 시작하고 저장 실패를 안내하며 플레이를 유지한다. Task 3에서 검증.
- 마지막 문제의 오답과 연속 복습 오답: 정확히 두 차례 재출제 뒤 미해결 목록으로 끝난다. Task 2에서 검증.
- 반복 클릭·결과 재렌더: 답변과 결과 저장이 중복 처리되지 않는다. Task 2·5에서 검증.
- 재생 중 페이지 이동·오디오 오류: 재생을 중단하고 다시 듣기와 오류 안내를 제공한다. Task 4·6에서 검증.

---

### Task 1: 실행 가능한 앱과 학습 데이터

**Files:** package.json, package-lock.json 또는 pnpm-lock.yaml, tsconfig.json, next.config.ts, postcss.config.mjs, .gitignore, app/layout.tsx, app/globals.css, app/page.tsx, types/game.ts, data/worlds.ts, data/questions.ts, data/rewards.ts, lib/hangul.ts, tests/data.test.ts.

**Interfaces:**
- Question: id, world, stage, type, question, word, stem?, answer, choices, hint, explanation, difficulty, image?, audioSrc?, audioText?. type은 batchim | word-choice | sentence | fix-spelling | image | audio.
- World: id, slug, title, description, icon, reward, stages: Stage[]. Stage: id, title, focus, questionCount, boss.
- exports: worlds: World[], questions: Question[], rewards: {stars: number; title: string}[], getStageQuestions(worldId: number, stageId: number): Question[], removeBatchim(word: string, index: number): string.

- [ ] 공식 npm 레지스트리 또는 공식 문서에서 안정 버전과 Node 요구사항을 확인한다. Next.js·React·Tailwind·TypeScript와 테스트 실행기만 설치하고 버전을 lockfile에 기록한다. 설치 실패 시 실제 오류와 대체 경로를 확인한다.
- [ ] 테스트를 먼저 작성한다: worlds.length === 5, 각 stages.length === 5, questions.length === 266, 모든 ID 고유, 스테이지별 questionCount 일치, choices 중복 없음, answer 정확히 1개. 최종 유형별 개수도 검증한다. removeBatchim('닭', 0) === '다', removeBatchim('읽다', 0) === '이다'.
- [ ] npm test로 미구현 실패를 확인한다.
- [ ] 설정·레이아웃과 데이터·한글 처리 함수를 구현한다. 월드별 받침 범위를 지키고 기본 1~3번은 보기 3개, 4번 이후는 4개를 기본으로 사용한다. 음성 문제는 audioText와 파일 경로를 함께 둔다.
- [ ] npm test와 npm run typecheck를 통과시킨다.

### Task 2: 점수와 게임 엔진

**Files:** lib/scoring.ts, lib/game-engine.ts, tests/scoring.test.ts, tests/game-engine.test.ts, types/game.ts.

**Interfaces:**
- calculateScore(input: {firstTry: boolean; fastAnswer: boolean; combo: number; supportMode: boolean}): number.
- calculateStars(correct: number, total: number, hints: number): number.
- createGame(items: Question[]): GameState.
- answerQuestion(state: GameState, choice: string, elapsedMs: number): GameState.
- useHint(state: GameState): GameState; nextQuestion(state: GameState): GameState; getGameResult(state: GameState): GameResult.
- GameState에는 현재 문제, 원본 문제 수, 복습 회차, 대기열, 최초 정답 수, 점수, 콤보·최고 콤보, 남은 기회, 힌트 수, 피드백, 종료 여부를 둔다. GameResult에는 accuracy, stars, cleared, score, bestCombo, hints, unresolved: Question[]를 둔다.

- [ ] 점수 테스트를 작성한다: 최초·빠른 정답 combo 1은 140, combo 3은 150, combo 5는 160, combo 10은 190; 지원·복습은 100. 별 테스트는 7/10→1, 8/10→2, 9/10 힌트2→3, 힌트3→2, 6/10→0.
- [ ] 엔진 테스트를 작성한다: 원본 오답 1개만 복습, 복습 정답은 최초 정답률 불변·기본100점; 복습까지 총 3번 오답이면 미해결로 종료. 기회는 0 미만 불가·계속 진행. 답변 후 중복 클릭 무시, 힌트 중복 감점 방지, 피드백 전에 다음 문제 이동 불가.
- [ ] npm test로 실패를 확인한다.
- [ ] 순수 함수로 점수와 게임 상태 전이를 구현한다. 엔진에서 브라우저 API를 사용하지 않는다. 해결된 문제는 대기열에서 제거한다.
- [ ] npm test를 통과시킨다.

### Task 3: 진행 저장과 해금

**Files:** lib/storage.ts, lib/progress.ts, hooks/useProgress.ts, tests/progress.test.ts, tests/storage.test.ts, types/game.ts.

**Interfaces:**
- StageProgress: worldId, stageId, cleared, stars, bestScore, bestCombo, attempts, puzzlePiece.
- Progress: version: 1, stages: Record<string, StageProgress>, settings: {soundEnabled: boolean}.
- readProgress(storage: Pick<Storage, 'getItem'>): Progress; writeProgress(storage: Pick<Storage, 'setItem'>, progress: Progress): boolean.
- isStageUnlocked(progress: Progress, worldId: number, stageId: number): boolean.
- applyResult(progress: Progress, worldId: number, stageId: number, result: GameResult): Progress.
- useProgress(): {progress, ready, saveResult, storageError, settings, updateSettings}.

- [ ] 테스트를 작성한다: 최초 1-1만 열림, 이전 스테이지 클리어 해금, 월드 보스 클리어 다음 월드 해금; 첫 클리어 조각1·재클리어 동일; 점수·별·콤보 최고값 유지와 attempts 증가. 손상 JSON·지원하지 않는 버전·저장 예외 처리도 검증한다.
- [ ] npm test로 실패를 확인한다.
- [ ] 저장 키 batchim-rescue-progress-v1을 사용해 읽기·쓰기·검증을 구현한다. storage 접근 예외도 처리한다. 훅은 최초 렌더 뒤 로드하고 ready를 제공한다. 쓰기 실패 시 메모리 기록은 유지한다.
- [ ] npm test를 통과시킨다.

### Task 4: 실제 파일 음성과 오디오 훅

**Files:** scripts/generate-audio.ps1, public/audio/*, hooks/useAudio.ts, components/game/AudioPlayerButton.tsx, tests/audio-files.test.ts, README.md.

**Interfaces:** useAudio(src: string | undefined, enabled: boolean): {playing: boolean; error: string | null; play: () => Promise<void>; stop: () => void}.

- [ ] 음성 문제의 모든 audioSrc가 public 아래에 존재하고 빈 파일이 아니며 실제 오디오 헤더를 갖는 테스트를 작성한다.
- [ ] npm test로 파일 누락 실패를 확인한다.
- [ ] data/questions의 audioText로 음성 목록을 내보내고 Windows Microsoft Heami로 WAV를 생성한다. mp3 변환 도구가 사용 가능하면 변환하고, 없으면 audioSrc를 실제 WAV 경로로 통일한다. 합성 파일 사용을 README에 밝힌다.
- [ ] useAudio에서 파일 재생, 반복 재생, 상태·오류를 구현한다. 소스 변경·비활성화·unmount 시 pause와 currentTime 초기화를 수행한다. 버튼은 재생 상태와 다시 듣기를 텍스트로 표시한다.
- [ ] npm test와 실제 브라우저 오디오 재생을 확인한다.

### Task 5: 랜딩·지도·게임·결과 UI

**Files:** components/layout/Header.tsx, Footer.tsx; components/home/Hero.tsx, FeatureSection.tsx, GamePreview.tsx, LearningSteps.tsx, ContactSection.tsx; components/game/WorldCard.tsx, StageCard.tsx, GameHeader.tsx, GameCard.tsx, AnswerButton.tsx, ScoreBoard.tsx, ProgressBar.tsx, CharacterMessage.tsx, StageResult.tsx, StarRating.tsx, PuzzlePieceProgress.tsx, RewardModal.tsx; components/characters/RescueCaptain.tsx, BatchimRobot.tsx; hooks/useGame.ts; app/game/page.tsx, app/game/[world]/page.tsx, app/game/[world]/[stage]/page.tsx, app/not-found.tsx, app/globals.css.

**Interfaces:** useGame(items: Question[])가 Task 2 엔진의 state, answer(choice), hint(), next(), result를 제공한다. 페이지는 slug로 World를 찾고 정수 1~5 스테이지를 검증한다. GameCard는 Question과 엔진 피드백을 표시한다. StageResult는 GameResult와 다음 경로·재도전 동작을 받는다.

- [ ] 랜딩에 지정 문구, 시작 링크 /game, 서비스 소개, 동작하는 산 받침 미리보기, 학습 흐름, mailto:ekego@naver.com을 구현한다. 헤더 모바일 메뉴와 SVG 오리지널 캐릭터를 추가한다.
- [ ] 작전 지도·스테이지 카드에 진행률, 별, 조각, 잠금, 배지를 표시한다. ready 이전에는 로딩 안내를 제공한다. 잠긴 경로 접근 시 지도 이동 안내를 제공한다.
- [ ] 플레이 화면에 문제 유형별 표현, 보기, 힌트, 점수, 콤보, 기회, 지원 모드, 복습 회차, 다음 버튼을 연결한다. 정답·오답과 설명은 aria-live로 알린다. UI의 중복 클릭도 차단한다.
- [ ] 결과 저장은 완료된 한 플레이당 한 번만 수행한다. 결과에 최초 정답률, 별, 점수, 최고 콤보, 최초 조각, 배지·새 보상, 미해결 설명, 재도전과 다음 단계를 제공한다. 45별 보너스는 기존 문제 복습 모드로 제공하고 정규 보상 저장과 분리한다.
- [ ] 360px·768px·1280px 반응형, 48px 버튼, focus-visible, prefers-reduced-motion을 적용한다. 별·정답·오답 애니메이션은 짧게 사용한다.
- [ ] 브라우저에서 랜딩→지도→첫 스테이지→정답·오답→복습→결과를 확인한다. 새로고침 기록 유지, 결과 중복 저장 없음, 잠긴 URL 차단, 모바일 메뉴·가로 넘침 없음도 확인한다.

### Task 6: 최종 검증과 실행 안내

**Files:** README.md, package.json; 필요하면 앞 작업에서 발견된 결함 파일만 수정한다.

- [ ] npm test, npm run typecheck, npm run build를 실행해 데이터·엔진·저장 검사와 프로덕션 빌드를 통과시킨다. 사용한 명령과 결과를 기록한다.
- [ ] 개발 서버에서 정상 경로·잘못된 경로와 모바일 화면을 확인한다. 음성 재생 중 화면 이동 시 중단, 재생 오류 안내와 다시 듣기를 확인한다.
- [ ] README에 npm install / npm run dev / npm run build / npm start, 문제 추가 위치, 음성 교체 방법, 합성 음성 출처, 저장 범위와 Vercel 배포 방법을 적는다.
- [ ] 완료 보고에는 구현 기능, 검증 결과, 실제 확인되지 않은 사항만 명확하게 전달한다. 배포는 요청이 있을 때 진행한다.

## Execution choice
권장: 이 채팅에서 직접 구현. 게임 엔진·저장·UI 인터페이스가 서로 연결되어 있고 하나의 MVP이므로 문맥을 유지하며 순차 구현하는 방식이 적합하다. 사용자가 별도 위임 방식을 선택하면 서브에이전트 방식으로 전환한다.

## Self-review
설계서의 데이터·게임·점수·복습·보상·음성·저장·접근성·검증을 Tasks 1~6에 연결했다. 공개 함수명과 타입은 각 작업의 소비 인터페이스와 일치한다. 보너스 스테이지는 기존 문항 복습으로 구현해 정규 25개와 75별 한도를 유지한다. 이 작업 폴더는 아직 Git 저장소가 아니므로 자동 커밋을 계획에 포함하지 않는다.
