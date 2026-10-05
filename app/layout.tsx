import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProgressProvider } from '../hooks/useProgress';
const a2z=localFont({
  src:[
    {path:'../public/fonts/a2z/a2z-4Regular.woff2',weight:'400',style:'normal'},
    {path:'../public/fonts/a2z/a2z-5Medium.woff2',weight:'500',style:'normal'},
    {path:'../public/fonts/a2z/a2z-6SemiBold.woff2',weight:'600',style:'normal'},
    {path:'../public/fonts/a2z/a2z-7Bold.woff2',weight:'700',style:'normal'},
    {path:'../public/fonts/a2z/a2z-8ExtraBold.woff2',weight:'800',style:'normal'},
    {path:'../public/fonts/a2z/a2z-9Black.woff2',weight:'900',style:'normal'},
  ],
  variable:'--font-a2z',display:'swap',preload:false,
});
export const metadata:Metadata={title:'우리는 구조대 | 즐거운 배움',description:'받침과 맞춤법부터 네 자리 덧셈·뺄셈, 곱셈과 나머지 있는 나눗셈까지. 원하는 단계를 골라 배우는 초등 학습 게임.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko" data-scroll-behavior="smooth"><body className={a2z.variable}><a href="#main" className="skip-link">본문으로 이동</a><ProgressProvider><Header/><main id="main">{children}</main><Footer/></ProgressProvider></body></html>;}

