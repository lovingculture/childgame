'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
export function Header(){
  const [open,setOpen]=useState(false);
  const path=usePathname();
  return <header className="site-header"><div className="shell header-inner">
    <div className="brand app-brand"><Link href="/" onClick={()=>setOpen(false)}>우리는 구조대</Link></div>
    <button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)} aria-label={open?'메뉴 닫기':'메뉴 열기'}>{open?'✕':'☰'}</button>
    <nav id="main-nav" className={open?'nav open':'nav'} aria-label="주 메뉴">
      <Link href="/game" aria-current={path.startsWith('/game')?'page':undefined} onClick={()=>setOpen(false)}>받침 구조</Link>
      <Link href="/numbers" aria-current={path.startsWith('/numbers')?'page':undefined} onClick={()=>setOpen(false)}>숫자 구조</Link>
      <Link href="/science" aria-current={path.startsWith('/science')?'page':undefined} onClick={()=>setOpen(false)}>생명 구조</Link>
      <Link href="/#contact" onClick={()=>setOpen(false)}>기록 안내</Link>
      <Link href="/#games" className="button small" onClick={()=>setOpen(false)}>게임 선택하기 <span aria-hidden="true">↗</span></Link>
    </nav>
  </div></header>;
}

