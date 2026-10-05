const features=[['🎮','재미와 학습 중심 교육','문제를 풀고 별과 보상을 모아요. 작은 성공이 쌓이면 공부도 즐거워져요.','01'],['🔎','나에게 맞는 반복 학습','헷갈렸던 문제를 다시 재구조 임무로 만나요.','02'],['🌱','초등학생 맞춤형 게임','큰 글씨, 쉬운 조작, 다정한 안내. 쉬운 받침부터 큰 수 연산까지 함께 성장해요.','03']];
export function FeatureSection(){return <section id="about" className="section shell"><div className="section-heading"><span className="eyebrow">LEARN THROUGH PLAY</span><h2>배움에 자신감을 더하는 세 구조대</h2><p>공부의 시작이 ‘해야 하는 일’보다 ‘하고 싶은 일’이 되도록.</p></div><div className="feature-grid">{features.map(([icon,title,text,n])=><article className="feature-card" key={title}><span className="feature-icon">{icon}</span><span className="feature-number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;}


