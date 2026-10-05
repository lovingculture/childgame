# Implementation ledger — 2026-10-05-batchim-rescue.md

Ruling: 기존 폴더는 Git 저장소가 아니므로 이 폴더에서 직접 구현하며 원본 파일을 보존한다.
Ruling: 사용자가 음성을 중간에 녹음해 넣기로 했다. 합성 음성을 생성하지 않는다. 음성 문제 파일 목록과 대본을 제공하며 파일 미등록 스테이지는 준비 중으로 표시한다.
Pre-flight: Task 1의 Question/World → Task 2 엔진 → Task 3 진행 → Task 5 UI 인터페이스 일치.
Pre-flight: Task 1의 audioSrc/audioText → Task 4 오디오 → Task 5 재생 버튼 인터페이스 일치.

User update: 사용자가 batchim_questions_266.csv를 문제 원본으로 지정했다. data/questions.ts의 자체 생성 문항을 CSV JSON 어댑터로 교체했다. CSV의 266문항·25스테이지 및 문구·보기·정답·대본을 보존한다. 최종 스테이지는 CSV 기준 그림2·문장4·음성4·맞춤법3·단어선택2이며 음성은 전체14문항이다. 녹음 대본도 갱신했다. types/game.ts에 correctSentence/imageHint를 추가했다. 문제 tests 전체12개 통과. 이후 UI에서 sentence 정답이 단어 또는 받침인 두 경우를 지원해야 한다.

User update: 사용자 녹음 m4a 14개를 원본 보존 후 public/audio/로 복사했다. 5-3-01~10 및 5-5-03/07/13/15 파일의 비어 있지 않은 m4a ftyp 헤더를 확인했고 resolveAudioFiles(questions)에서 모든 14문항의 m4a 경로 연결·누락0을 검증했다. 아직 실제 재생이나 대본과 녹음 내용의 일치는 확인하지 않았다.

Tasks 1–3: 문제266개·점수·복습·진행저장 구현, 최초 실패 확인 후 통과. Task4: 사용자 녹음14개 자동연결, 누락0. Task5: 랜딩·지도·게임·결과·반응형 구현. 프로덕션 브라우저에서 첫 문제 오답→나머지9개 정답→재구조100점→최초90%·별3개·조각1 확인. Final review: 읽기전용 reviewer가 CSV 빈 word의 피드백53개 문제 발견. 재현 테스트 실패 확인 후 word 표시를 answer로 보충해 수정.

Browser verification: 프로덕션에서25개정규스테이지 전부 완료→75별·25조각·5개월드배지·최종트로피 확인. 음성14문항 모두 play() 성공 및 재생버튼상태 확인, 반복듣기 확인, 콘솔error/warn없음. 별45 보너스임무 완료후75별·25조각 유지. 별도오리진의 잠긴5-5URL차단 확인. 모바일360px 랜딩/게임에서가로넘침없음, 보기버튼74px·모바일메뉴동작 확인. CSV 빈word 표시수정은회귀테스트통과.

Tasks 1–6: complete. 최종 검증 npm test 14/14, typecheck exit0, audio:check 누락0/14, build exit0. 리뷰 수정된 값 정답피드백을 최종 빌드 UI에서 확인. 잘못된경로404 확인. 모바일CTA 한줄과56px 높이 확인. 최종화면 artifacts/preview.png 저장. 로컬3000 프로덕션서버 실행중. 외부배포는 수행하지 않음.
