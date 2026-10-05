import { BatchimRobot } from '../characters/BatchimRobot';
export function CharacterMessage({message}:{message:string}){return <div className="character-message"><BatchimRobot/><p>{message}</p></div>;}
