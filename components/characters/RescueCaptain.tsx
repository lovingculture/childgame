export function RescueCaptain({className='',gold=false,hat=false,smile=false}:{className?:string;gold?:boolean;hat?:boolean;smile?:boolean}) {
  return <svg className={className} viewBox="0 0 240 280" role="img" aria-label="오리지널 캐릭터 구조대장">
    <ellipse cx="123" cy="259" rx="66" ry="11" fill="#DDE5FF"/>
    <path d="M77 206l-12 45h30l9-37m57-8 12 45h-30l-9-37" fill="#293560"/>
    <path d="M58 164C18 171 22 206 52 198l25-14m104-20c41 7 39 42 8 34l-26-14" fill="#5B6CFF"/>
    <rect x="66" y="145" width="110" height="77" rx="32" fill="#5B6CFF"/>
    <rect x="93" y="166" width="55" height="49" rx="17" fill="#EEF3FF"/>
    <path d="M120 174l4 10 11 1-9 7 3 11-9-6-9 6 3-11-9-7 11-1z" fill="#F5BA46"/>
    <rect x="50" y="58" width="140" height="108" rx="48" fill="#FFE2BE"/>
    <path d="M40 84C40 17 202 15 202 84v10H40z" fill={gold?'#F6BE49':'#5B6CFF'}/>
    <rect x="30" y="80" width="182" height="21" rx="10" fill={gold?'#DDA228':'#4353D9'}/>
    <rect x="100" y="33" width="43" height="54" rx="14" fill="#EEF3FF"/>
    <path d="M120 45v26m-12-13h25" stroke="#5B6CFF" strokeWidth="8" strokeLinecap="round"/>
    {hat&&<path d="M173 38l27-6-7 22z" fill="#F6BE49"/>}
    <ellipse cx="88" cy="120" rx="5" ry="7" fill="#293560"/><ellipse cx="153" cy="120" rx="5" ry="7" fill="#293560"/>
    <ellipse cx="73" cy="135" rx="12" ry="7" fill="#F3AD9F"/><ellipse cx="169" cy="135" rx="12" ry="7" fill="#F3AD9F"/>
    <path d={smile?'M105 136q16 27 32 0z':'M108 137q13 15 26 0'} fill={smile?'#D96E72':'none'} stroke="#293560" strokeWidth="4" strokeLinecap="round"/>
  </svg>;
}
