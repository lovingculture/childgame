# 생명구조대

6개 테마에 난이도마다 5단계씩, 단계마다 3문항을 제공합니다. 기본 90·도전 90·최고 수준 90문항으로 총 270문항입니다.

- 기본: 초1–2 통합교과의 생활·자연 관찰과 분류
- 도전: 초3–4 과학의 현상 비교와 원인·결과 탐구
- 최고 수준: 초5–6 과학의 개념 적용, 실험 조건, 수치 자료 해석

교과 개념을 게임용 테마로 재구성한 자체 문항이며 출판사별 교과서 단원 전체를 그대로 재현하지 않습니다. 문항 원문은 basic.ts, challenge.ts, expert.ts에 `질문|정답|오답 세 개(~ 구분)|풀이`로 저장합니다. 공통 연결·단계 제목은 data/science.ts에 있습니다.

기록은 science-rescue-progress-v1, science-rescue-challenge-progress-v1, science-rescue-expert-progress-v1에 각각 저장합니다. 기존 한글·연산 기록과 분리하며 최초 조각·최고 점수·별을 보존합니다. tests/science.test.ts에서 전체 문항 완료·정답 보기·질문 고유성·저장 분리를 검사합니다.

교육과정 참고: [2022 개정 교육과정 안내](https://ncic.re.kr/bbs/eduNotice2022/view/543.do?page=1&searchkey=&searchword=2027), [초등 학년군별 성취수준 자료](https://ncic.re.kr/board/B0024.cs?act=read&bwrId=2021&m=10&pageIndex=8&pageUnit=15&searchCondition=&searchEndDt=&searchKeyword=&searchStartDt=).
