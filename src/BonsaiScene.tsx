import {useEffect,useState} from 'react';
import {AnimatePresence,motion} from 'framer-motion';

type Props={growth:number;pulse:number};
const frames=Array.from({length:8},(_,i)=>`/bonsai-timelapse/frame-${i+1}.png`);

export function BonsaiScene({growth,pulse}:Props){
 const [tick,setTick]=useState(0),reduced=typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 useEffect(()=>{frames.forEach(src=>{const image=new Image();image.src=src});if(reduced){setTick(7);return}const timer=window.setInterval(()=>setTick(value=>(value+1)%14),720);return()=>window.clearInterval(timer)},[reduced]);
 const frame=reduced?7:Math.max(Math.min(tick,7),Math.min(7,Math.floor(growth*7)));
 return <div className={`bonsai-timelapse ${pulse?'energized':''}`} aria-hidden="true"><AnimatePresence mode="popLayout"><motion.img key={frame} src={frames[frame]} alt="" initial={{opacity:.15,scale:.975}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.015}} transition={{duration:.42,ease:'easeOut'}}/></AnimatePresence><span/></div>
}
