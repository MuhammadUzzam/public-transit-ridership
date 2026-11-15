import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Home, ChartNoAxesCombined, TrainFront, Bus, Info, ArrowUpRight, CalendarDays, Route, Sparkles, ChevronRight, Menu, X, ExternalLink } from 'lucide-react';
import monthly from './monthly.json';
import './style.css';

const API = '/api';
const views = [
  { id: 'home', title: 'Overview', icon: Home },
  { id: 'history', title: 'Historical ridership', icon: ChartNoAxesCombined },
  { id: 'prediction', title: 'Historical prediction', icon: TrainFront },
  { id: 'about', title: 'About the project', icon: Info },
];
function getView() {
  const name = location.hash.replace('#/', '') || 'home';
  return views.some(v => v.id === name) ? name : 'home';
}
function Lightning() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.getElementById('lightning');
    const ctx = canvas.getContext('2d');
    let points = [], frame;
    const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    const move = e => { points.push({ x:e.clientX, y:e.clientY, time:performance.now() }); if (points.length > 18) points.shift(); };
    const draw = now => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      points = points.filter(p => now-p.time < 330);
      if (points.length > 1) {
        ctx.lineCap='round'; ctx.lineJoin='round'; ctx.shadowBlur=13; ctx.shadowColor='#ffd967';
        for (let i=1;i<points.length;i++) {
          const a=points[i-1], b=points[i], alpha=(1-(now-b.time)/330)*0.8;
          ctx.strokeStyle=`rgba(255, 220, 114, ${Math.max(0,alpha)})`; ctx.lineWidth=1.3 + i/points.length;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo((a.x+b.x)/2+Math.sin(i*17+now/70)*3,(a.y+b.y)/2+Math.cos(i*9+now/70)*3); ctx.lineTo(b.x,b.y); ctx.stroke();
          if (i%4===0) { ctx.lineWidth=.8; ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(b.x+Math.sin(i*4)*9,b.y+Math.cos(i*4)*9); ctx.stroke(); }
        }
      }
      frame=requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize',resize); window.addEventListener('pointermove',move); frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize',resize); window.removeEventListener('pointermove',move); };
  },[]);
  return <canvas id="lightning" aria-hidden="true"/>;
}
function TransitScene() {
 const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 return <svg className="hero-scene" viewBox="0 220 1672 721" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
  <defs>
   <radialGradient id="headlightGlow"><stop offset="0" stopColor="#fffef2" stopOpacity="1"/><stop offset=".2" stopColor="#fff5c2" stopOpacity=".85"/><stop offset=".55" stopColor="#ffd477" stopOpacity=".35"/><stop offset="1" stopColor="#ffc35b" stopOpacity="0"/></radialGradient>
   <linearGradient id="headlightBeam" x1="45" y1="100" x2="-185" y2="185" gradientUnits="userSpaceOnUse"><stop stopColor="#fff4bd" stopOpacity=".52"/><stop offset=".45" stopColor="#ffdc8a" stopOpacity=".16"/><stop offset="1" stopColor="#ffe7a3" stopOpacity="0"/></linearGradient>
  </defs>
  <image href="/hero.png" width="1672" height="941"/>
  {/* Train wheels follow the slope of the bridge in the background image. */}
  <g>
   {animate&&<animateMotion path="M60 14.4 L-140 -33.6" dur="18s" repeatCount="indefinite"/>}
   {animate&&<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.92;1" dur="18s" repeatCount="indefinite"/>}
   <g transform="translate(720 289)"><g transform="matrix(1 .32 0 1 0 0)">
    <image href="/train.png" width="480" height="160"/>
    {[32,93].map(x=><g key={x}>
     <circle cx={x} cy="96" r="7" fill="#463c2a" opacity=".55">{animate&&<animate attributeName="opacity" values=".55;.55;0;0;.55" keyTimes="0;.24;.3;.76;1" dur="7s" repeatCount="indefinite"/>}</circle>
     <circle cx={x} cy="96" r="32" fill="url(#headlightGlow)" opacity=".35">{animate&&<animate attributeName="opacity" values=".25;.25;.9;.9;.25" keyTimes="0;.24;.3;.76;1" dur="7s" repeatCount="indefinite"/>}</circle>
    </g>)}
   </g></g>
  </g>
  {/* Bus wheels and their motion follow the receding road. */}
  <g>
   {animate&&<animateMotion path="M90 -23.7 L-110 28.9" dur="20s" repeatCount="indefinite"/>}
   {animate&&<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.92;1" dur="20s" repeatCount="indefinite"/>}
   <g transform="translate(1100 699)"><g transform="matrix(1 -.10 0 1 0 0)">
    <g opacity=".22">
     {animate&&<animate attributeName="opacity" values=".15;.15;1;1;.15;.15;1;1;.15" keyTimes="0;.14;.20;.40;.46;.65;.71;.90;1" dur="7s" repeatCount="indefinite"/>}
     <path d="M38 99 L-155 105 L-215 200 L37 107 Z" fill="url(#headlightBeam)"/>
     <path d="M106 99 L-90 126 L-135 217 L105 107 Z" fill="url(#headlightBeam)"/>
     <ellipse cx="-20" cy="170" rx="105" ry="19" fill="url(#headlightGlow)" opacity=".35"/>
    </g>
    <image href="/bus.png" width="290" height="145"/>
    {[37,106].map(x=><g key={x}>
     <ellipse cx={x} cy="102" rx="8" ry="5" fill="#443a28" opacity=".72">{animate&&<animate attributeName="opacity" values=".72;.72;0;0;.72;.72;0;0;.72" keyTimes="0;.14;.20;.40;.46;.65;.71;.90;1" dur="7s" repeatCount="indefinite"/>}</ellipse>
     <g opacity=".3">
      {animate&&<animate attributeName="opacity" values=".12;.12;1;1;.12;.12;1;1;.12" keyTimes="0;.14;.20;.40;.46;.65;.71;.90;1" dur="7s" repeatCount="indefinite"/>}
      <ellipse cx={x} cy="102" rx="52" ry="36" fill="url(#headlightGlow)"/>
      <ellipse cx={x} cy="102" rx="75" ry="3" fill="url(#headlightGlow)"/>
      <path d={`M${x-18} 102 H${x+18} M${x} 86 V118`} stroke="#fff8d6" strokeWidth="1.5" strokeOpacity=".7"/>
      <ellipse cx={x} cy="102" rx="7" ry="4" fill="#fffdf1"/>
     </g>
    </g>)}
   </g>
   </g>
  </g>
 </svg>;
}
function RouteLine() {
 const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 return <div className="route-line" aria-hidden="true"><svg viewBox="0 0 1200 60" preserveAspectRatio="none"><defs><linearGradient id="routeGradient"><stop stopColor="#e9d17a"/><stop offset=".45" stopColor="#ed9177"/><stop offset="1" stopColor="#bcd990"/></linearGradient></defs><path id="routePath" d="M0 32 L100 32 Q120 32 135 17 L300 17 Q315 17 330 32 L530 32 Q545 32 560 47 L700 47 Q715 47 730 32 L920 32 Q935 32 950 17 L1200 17" fill="none" stroke="url(#routeGradient)" strokeWidth="4"/>{[100,300,530,700,920,1100].map((x,i)=><circle key={x} cx={x} cy={i===1?17:i===3?47:i===5?17:32} r="6" fill="#082f22" stroke="#f6d994" strokeWidth="3"/>)}{animate&&<circle r="5" fill="#fff7b4" style={{filter:"drop-shadow(0 0 6px #ffd774)"}}><animateMotion dur="11s" repeatCount="indefinite" path="M0 32 L100 32 Q120 32 135 17 L300 17 Q315 17 330 32 L530 32 Q545 32 560 47 L700 47 Q715 47 730 32 L920 32 Q935 32 950 17 L1200 17"/></circle>}</svg></div>;
}
function Chart({full=false}) {
 const [year,setYear]=useState('all');
 const data=monthly.bus.filter(d=>year==='all'||d.month.startsWith(year));
 const rails=monthly.rail.filter(d=>year==='all'||d.month.startsWith(year));
 const values=[...data,...rails].map(x=>x.rides), max=Math.ceil(Math.max(...values)/5000000)*5000000;
 const x=i=>55+i*(690/Math.max(data.length-1,1)); const y=v=>190-(v/max)*150;
 const path=arr=>arr.map((d,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(d.rides).toFixed(1)}`).join(' ');
 const [hover,setHover]=useState(null);
 return <section className={'panel chart-panel '+(full?'chart-full':'')}><div className="panel-heading"><div><div className="eyebrow">THE BIGGER PICTURE <span>01</span></div><h2>Historical ridership</h2><p>Monthly recorded boardings and station entries.</p></div><select aria-label="Select year" value={year} onChange={e=>{setYear(e.target.value);setHover(null)}}><option value="all">2022 – 2025</option>{['2022','2023','2024','2025'].map(y=><option key={y}>{y}</option>)}</select></div>
 <div className="legend"><span><i className="bus-key"/> Bus boardings</span><span><i className="rail-key"/> Rail entries</span></div>
 <div className="chart-wrap"><svg viewBox="0 0 760 230" role="img" aria-label="Monthly bus boardings and rail station entries for the selected period">
 {[0,1,2,3].map(i=><g key={i}><line x1="55" x2="745" y1={40+i*50} y2={40+i*50} stroke="#365448" strokeDasharray="3 5"/><text x="45" y={44+i*50} textAnchor="end" className="axis">{Math.round((max*(1-i/3))/1000000)}M</text></g>)}
 <path d={path(data)} fill="none" stroke="#f3af85" strokeWidth="3"/><path d={path(rails)} fill="none" stroke="#b9df91" strokeWidth="3"/>
 {data.map((d,i)=><rect key={d.month} x={x(i)-6} y="35" width="12" height="155" fill="transparent" onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}><title>{d.month}: Bus {d.rides.toLocaleString()}, Rail {rails[i].rides.toLocaleString()}</title></rect>)}
 {data.filter((_,i)=>i%(year==='all'?12:2)===0).map(d=><text key={d.month} x={x(data.indexOf(d))} y="214" textAnchor="middle" className="axis">{year==='all'?d.month.slice(0,4):new Date(d.month+'-01T00:00:00').toLocaleString('en-US',{month:'short'})}</text>)}
 </svg></div><div className="chart-foot">{hover!==null?`${data[hover].month} · Bus ${data[hover].rides.toLocaleString()} · Rail ${rails[hover].rides.toLocaleString()}`:'Source: CTA daily totals · Move over the chart for values'}</div>
 </section>;
}
function Prediction() {
 const [mode,setMode]=useState('bus'),[entities,setEntities]=useState([]),[id,setId]=useState(''),[date,setDate]=useState('2026-06-15'),[result,setResult]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false);
 useEffect(()=>{const controller=new AbortController();setEntities([]);setId('');setResult(null);setError('');setLoading(true);
 fetch(`${API}/entities/${mode}`,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Could not load routes or stations. Check the backend and model files.');return r.json()}).then(d=>{setEntities(d.entity_ids);setId(d.entity_ids.includes(mode==='bus'?'1':'40010')?(mode==='bus'?'1':'40010'):(d.entity_ids[0]||''));}).catch(e=>{if(e.name!=='AbortError')setError('Cannot connect to the backend. Start FastAPI on port 8000 and refresh.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return ()=>controller.abort()},[mode]);
 async function submit(e){e.preventDefault();setError('');setResult(null);setBusy(true);try{const r=await fetch(`${API}/predict`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,entity_id:id,date})});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(typeof body.detail==='string'?body.detail:'Backend error. Check FastAPI and the required data files.');setResult(body);}catch(e){setError(e.message==='Failed to fetch'?'Cannot connect to the backend. Start FastAPI on port 8000.':e.message)}finally{setBusy(false)}}
 return <section className="panel prediction-panel" id="prediction"><div className="eyebrow">THE HISTORICAL MODEL <span>02</span></div><h2>Predict ridership</h2><p>Estimate relative ridership for a selected location and past date.</p><form onSubmit={submit}><label>Transit mode</label><div className="mode-switch"><button type="button" className={mode==='bus'?'selected':''} onClick={()=>setMode('bus')}><Bus size={17}/> Bus</button><button type="button" className={mode==='rail'?'selected':''} onClick={()=>setMode('rail')}><TrainFront size={17}/> Rail</button></div><label htmlFor="entity">{mode==='bus'?'Bus route':'Rail station'} ID</label><div className="input-icon"><Route size={16}/><select id="entity" value={id} onChange={e=>{setId(e.target.value);setResult(null)}} required disabled={loading||!entities.length}>{loading?<option>Loading...</option>:!entities.length?<option value="">No locations available</option>:entities.map(v=><option value={v} key={v}>{v}</option>)}</select></div><label htmlFor="date">Historical date</label><div className="input-icon"><CalendarDays size={16}/><input id="date" type="date" min="2026-01-01" max="2026-08-31" value={date} onChange={e=>{setDate(e.target.value);setResult(null)}} required/></div><button className="primary" disabled={busy||loading||!id}><Sparkles size={17}/>{busy?'Preparing prediction…':'Predict ridership'}<ArrowUpRight size={17}/></button></form>
 {error&&<div className="notice error" role="alert">{error}</div>}{result&&<div className="notice result" role="status"><span>Model prediction</span><strong>{result.prediction}</strong><small>Relative to this {mode==='bus'?'route':'station'}’s historical threshold. History through {result.history_cutoff}.</small></div>}<div className="prediction-foot">JAN – AUG 2026 <span>·</span> HISTORICAL SIMULATION</div></section>;
}
function App(){
 const [view,setView]=useState(getView),[menu,setMenu]=useState(false);
 useEffect(()=>{const change=()=>{setView(getView());setMenu(false);window.scrollTo(0,0)};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[]);
 return <><Lightning/><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu}>{menu?<X/>:<Menu/>}</button><aside className={'sidebar '+(menu?'open':'')}><a className="brand" href="#/home"><span className="brand-symbol"><Route size={25}/></span><span>TRANSIT<span>PULSE</span><small>CHICAGO · HISTORICAL</small></span></a><div className="side-label">EXPLORE</div><nav>{views.map(({id,title,icon:Icon})=><a key={id} className={view===id?'active':''} href={'#/'+id}><Icon size={18}/><span>{title}</span>{view===id&&<ChevronRight size={16}/>}</a>)}</nav><div className="side-bottom"><div className="side-rule"/><span>BUILT FOR EXPLORATION</span><strong>Every journey<br/>tells a story.</strong><p>Chicago, through the lens of data.</p><div className="side-rail"><i/><i/><i/><i/></div></div></aside>
 <main><div className="topbar"><div><span className="status-dot"/> AN INDEPENDENT UNIVERSITY PROJECT</div><span className="top-right">CTA HISTORICAL DATA <b>2022 — 2026</b></span></div>
 {view==='home'&&<><section className="hero" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--px", `${(e.clientX-r.left-r.width/2)/80}px`);e.currentTarget.style.setProperty("--py", `${(e.clientY-r.top-r.height/2)/80}px`)}}><TransitScene/><div className="hero-shade"/><div className="hero-copy"><div className="hero-kicker"><span/> CHICAGO IN MOTION</div><h1>Every ride<br/><em>has a story.</em></h1><p>Explore the rhythms of Chicago's buses and trains through historical ridership data.</p><a href="#/prediction" className="hero-button">Explore predictions <ArrowUpRight size={18}/></a><div className="hero-disclaimer"><span/> HISTORICAL SIMULATION · NOT LIVE DATA</div></div><div className="hero-number">01 / 04<br/><small>THE JOURNEY</small></div></section><RouteLine/><div className="intro"><div><div className="eyebrow">A CLOSER LOOK <span>●</span></div><h2>Discover the patterns.</h2><p>Data, context and a little perspective on the journeys that move a city.</p></div><a href="#/about">About the project <ArrowUpRight size={15}/></a></div><div className="dashboard"><Chart/><Prediction/></div></>}
 {view==='history'&&<div className="page"><div className="page-title"><div className="eyebrow">EXPLORE THE DATA <span>01</span></div><h1>A city, in numbers.</h1><p>Look back at recorded monthly ridership from Chicago's buses and trains.</p></div><Chart full/><div className="information"><strong>Reading the chart</strong><p>Bus boardings and rail station entries are different measures. The totals sum the records in the cleaned 2022–2025 datasets; coverage can vary by route, station and date.</p></div></div>}
 {view==='prediction'&&<div className="page prediction-page"><div className="page-title"><div className="eyebrow">AN EXPERIMENT IN PERSPECTIVE <span>02</span></div><h1>Look back.<br/><em>Predict with context.</em></h1><p>Select a route or station and a historical date to see the model's Normal or High classification.</p></div><div className="prediction-layout"><Prediction/><div className="information"><div className="eyebrow">HOW TO READ IT</div><h2>A signal, not a schedule.</h2><p>“High” means higher than the location's historical threshold. It does not measure crowdedness or vehicle capacity.</p><p>The 91-day availability delay is a simulation assumption; actual publication timing and data revisions have not been verified.</p></div></div></div>}
 {view==='about'&&<div className="page"><div className="page-title"><div className="eyebrow">THE STORY BEHIND THE DATA <span>03</span></div><h1>Made for<br/><em>curious minds.</em></h1><p>A university project exploring Chicago's historical public transit ridership with machine learning.</p></div><div className="about-grid"><div className="information"><h2>Two modes. One city.</h2><p>We study CTA bus route boardings and rail station entries separately, using public daily records.</p><a target="_blank" rel="noreferrer" href="https://data.cityofchicago.org/Transportation/CTA-Ridership-Bus-Routes-Daily-Totals-by-Route/jyb9-n7fm">Bus dataset <ExternalLink size={15}/></a><a target="_blank" rel="noreferrer" href="https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f">Rail dataset <ExternalLink size={15}/></a></div><div className="information"><h2>Historical, by design.</h2><p>This is a historical simulation, not a live CTA service. The model estimates Normal or High relative ridership, not crowding or automatic vehicle allocation.</p><p>2024–2026 were previously explored during modeling and are not untouched final test periods.</p></div></div></div>}
 <footer><span>TRANSITPULSE <b> / </b> HISTORICAL RIDERSHIP</span><span>INDEPENDENT UNIVERSITY PROJECT · NOT AFFILIATED WITH CTA</span></footer></main></>;
}

createRoot(document.getElementById('root')).render(<App/>);
