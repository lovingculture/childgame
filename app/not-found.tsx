import Link from 'next/link';
export default function NotFound(){return <div className="shell empty-state"><span className="large-emoji">🧭</span><h1>이 작전은 지도에 없어요.</h1><p>작전 지도로 돌아가 다음 임무를 찾아볼까요?</p><Link href="/game" className="button">작전 지도로 →</Link></div>;}
