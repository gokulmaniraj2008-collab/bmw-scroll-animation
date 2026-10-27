/* Optional scroll-driven frame sequence. Add numbered WebP files to frames/ to activate.
   Without assets the original car animation remains fully functional. */
const progress=document.querySelector('#progress');
const drive=document.querySelector('.drive');
const car=document.querySelector('#car');
const trail=document.querySelector('#trail');
const counters=document.querySelectorAll('[data-count]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const FRAME_COUNT=16;
const framePath=n=>'./frames/frame-'+String(n).padStart(3,'0')+'.svg';
const canvas=document.createElement('canvas');
canvas.className='sequence-canvas';
canvas.setAttribute('role','img');
canvas.setAttribute('aria-label','Scroll-controlled automotive animation');
const ctx=canvas.getContext('2d');
const frames=new Map();
let sequenceEnabled=false, lastFrame=-1, raf=false;
if(ctx){document.querySelector('.sticky').append(canvas);canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;display:none';}
function resizeCanvas(){if(!ctx)return;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(canvas.clientWidth*d);canvas.height=Math.round(canvas.clientHeight*d);drawFrame(lastFrame);}
function drawFrame(n){if(!ctx||!sequenceEnabled)return;const img=frames.get(n);if(!img)return;ctx.clearRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.width/img.naturalWidth,canvas.height/img.naturalHeight);const w=img.naturalWidth*scale,h=img.naturalHeight*scale;ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);lastFrame=n;}
function loadFrame(n){if(frames.has(n))return Promise.resolve(frames.get(n));return new Promise(resolve=>{const img=new Image();img.decoding='async';img.onload=()=>{frames.set(n,img);resolve(img)};img.onerror=()=>resolve(null);img.src=framePath(n);});}
async function initSequence(){if(!ctx||reduced.matches)return;const first=await loadFrame(1);if(!first)return;sequenceEnabled=true;canvas.style.display='block';car.style.visibility='hidden';resizeCanvas();drawFrame(1);update();let next=2;async function batch(){const stop=Math.min(FRAME_COUNT,next+5);await Promise.all(Array.from({length:stop-next},(_,i)=>loadFrame(next+i)));next=stop;if(next<=FRAME_COUNT)setTimeout(batch,40);}batch();}
function nearestFrame(target){if(frames.has(target))return target;for(let d=1;d<FRAME_COUNT;d++){if(frames.has(target-d))return target-d;if(frames.has(target+d))return target+d;}return 1;}
function update(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';const rect=drive.getBoundingClientRect();const range=drive.offsetHeight-innerHeight;const t=Math.min(1,Math.max(0,-rect.top/Math.max(1,range)));const y=65-t*115;if(sequenceEnabled){drawFrame(nearestFrame(1+Math.round(t*(FRAME_COUNT-1))));}else{car.style.top=y+'%';car.style.transform='translate(-50%,-50%) rotate('+(reduced.matches?0:Math.sin(t*15)*3)+'deg)';}trail.style.height=Math.max(0,Math.min(100,y))+'%';document.querySelector('.road-line').style.backgroundPositionY=(t*1100)+'px';raf=false;}
addEventListener('scroll',()=>{if(!raf){requestAnimationFrame(update);raf=true}},{passive:true});addEventListener('resize',()=>{resizeCanvas();update()});update();initSequence();
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const el=entry.target;const target=Number(el.dataset.count);if(reduced.matches){el.textContent=target;observer.unobserve(el);continue}const start=performance.now();function frame(now){let t=Math.min(1,(now-start)/1300);t=1-Math.pow(1-t,3);el.textContent=Math.round(target*t);if(t<1)requestAnimationFrame(frame)}requestAnimationFrame(frame);observer.unobserve(el)}},{threshold:.3});counters.forEach(el=>observer.observe(el));
