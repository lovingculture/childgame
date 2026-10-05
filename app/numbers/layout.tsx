import type { Metadata } from 'next';
import { NumberProgressProvider } from '../../hooks/useNumberProgress';
export const metadata:Metadata={title:'숫자구조대 | 덧셈·뺄셈·곱셈·나눗셈 연산 게임',description:'원하는 단계를 골라 푸는 초등 연산 게임. 기본 45단계, 도전 20단계, 최고 수준 25단계로 자연수·분수·소수의 사칙연산과 혼합 계산을 연습해요.'};
export default function NumberLayout({children}:{children:React.ReactNode}){return <NumberProgressProvider>{children}</NumberProgressProvider>;}
