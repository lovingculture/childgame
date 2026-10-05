import type { Metadata } from 'next';
import { ScienceProgressProvider } from '../../hooks/useScienceProgress';
export const metadata:Metadata={title:'생명구조대 | 관찰·실험·자료 탐구',description:'기본, 도전, 최고 수준으로 배우는 6개 테마 과학 게임. 난이도마다 30단계·90문항.'};
export default function ScienceLayout({children}:{children:React.ReactNode}){return <ScienceProgressProvider>{children}</ScienceProgressProvider>;}
