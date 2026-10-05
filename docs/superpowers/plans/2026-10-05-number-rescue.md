# 숫자구조대 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 현재 웹앱에서 한글과 수학 게임을 고르고, 숫자구조대 9개 영역·45단계를 자유롭게 학습한다.

**Architecture:** `/numbers` 전용 영역 데이터, 연산 생성기, 기록 저장과 화면을 추가한다. 기존 게임 엔진·점수 규칙을 사용하되 숫자 기록은 별도 키로 저장한다. 홈과 메뉴를 두 게임에 맞게 갱신한다.

**Tech Stack:** 설치된 Next.js 16, React 19, TypeScript, CSS, 브라우저 localStorage. 외부 의존성 추가 없음.

**Spec:** `docs/superpowers/specs/2026-10-05-number-rescue-design.md`

## Global Constraints

- 아홉 영역, 영역별 다섯 단계, 단계별 열 문제. 모두 자유 선택.
- 숫자 기록은 별도 저장. 받침구조대 데이터·녹음·난이도 기능을 변경하지 않는다.
- 나머지는 몫과 함께 선택하고 제수보다 작아야 한다.
- 신규 로그인·외부 서비스 없음. 기존 a2z 글꼴과 모바일 구성을 활용한다.

## Review Focus

- 나머지 문제의 몫·나머지와 숫자 범위가 모두 정확한가.
- 제한된 구구단 문제에서도 단계 내 중복 없이 열 문제를 만드는가.
- 0을 거치는 받아내림과 여러 자리 올림이 해당 단계에 실제로 나오는가.
- 저장 데이터 손상·저장 차단에도 플레이가 가능하고 다른 게임 기록이 보존되는가.
- 긴 나머지 보기와 네 자리 수가 좁은 화면에서 잘리지 않는가.

## Task 1: 문제와 기록

**Files:** `data/numbers.ts`, `lib/number-questions.ts`, `lib/number-progress.ts`, `tests/numbers.test.ts`

- [x] 모든 45단계에서 정답·보기·범위·중복·나머지를 검증하는 실패 테스트 작성.
- [x] 영역별 단계 데이터를 정의하고 seed를 받는 문제 생성기를 구현.
- [x] 숫자 저장 키와 1~9 영역·1~5 단계의 기록 검증 구현. 최고 점수와 별 보존.
- [x] 숫자 테스트와 기존 테스트 실행.

## Task 2: 플레이와 지도

**Files:** `hooks/useNumberProgress.tsx`, `components/numbers/NumberMap.tsx`, `components/numbers/NumberGame.tsx`, `app/numbers/layout.tsx`, `app/numbers/page.tsx`, `app/numbers/[area]/page.tsx`, `app/numbers/[area]/[stage]/page.tsx`

- [x] Provider에 별도 저장·복원·저장 오류 안내를 구현.
- [x] 영역·단계 지도에 135별·45조각, 최고 점수, 자유 선택 링크 표시.
- [x] 엔진을 사용해 열 문제·힌트·두 차례 오답 재도전·결과·재시작·다음 단계 제공.
- [x] 새 문제 생성은 시작·재시작 시 수행해 서버와 클라이언트 렌더 차이를 피함.
- [x] 모든 경로에서 숫자 기록만 갱신되는지 테스트.

## Task 3: 두 게임 디자인과 확인

**Files:** `components/home/Hero.tsx`, `components/home/FeatureSection.tsx`, `components/home/LearningSteps.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`

- [x] 홈을 한글·연산 학습 소개와 두 게임 선택 카드로 변경. 메뉴에 실제 두 경로 연결.
- [x] 숫자 색상·카드·숫자 보기·모바일 CSS 추가. 기존 녹음과 기록 안내 유지.
- [x] 전체 테스트·타입 검사·빌드 실행.
- [x] 별도 미리보기에서 홈→숫자 지도→단계→풀이→기록을 확인.
- [x] 나머지·네 자리·모바일 보기 확인 후 스크린샷 제공.
