const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  menu.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  links.classList.toggle('open', !expanded);
});
links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  links.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Abrir menu');
}));
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .09 });
  items.forEach(item => observer.observe(item));
} else { items.forEach(item => item.classList.add('visible')); }
document.getElementById('year').textContent = new Date().getFullYear();

// Progressive 3D enhancements: disabled automatically for reduced motion.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.querySelector('.motion-toggle');
let motionOn = !reduceMotion.matches;
function updateMotion() {
  document.body.classList.toggle('motion-off', !motionOn);
  motionButton?.setAttribute('aria-pressed', String(!motionOn));
  motionButton?.setAttribute('aria-label', motionOn ? 'Pausar animações' : 'Ativar animações');
  if (motionButton) motionButton.innerHTML = motionOn ? '◉ <span>Motion on</span>' : '○ <span>Motion off</span>';
  if (!motionOn) document.querySelectorAll('.project-visual').forEach(el => {
    el.style.setProperty('--tilt-x','0deg'); el.style.setProperty('--tilt-y','0deg');
  });
}
motionButton?.addEventListener('click', () => {motionOn = !motionOn; updateMotion();});
updateMotion();
const scene = document.getElementById('heroScene');
if (scene && isFinePointer.matches) {
  scene.addEventListener('pointermove', e => {
    if (!motionOn) return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    scene.style.setProperty('--scene-x', `${(-y*9).toFixed(2)}deg`);
    scene.style.setProperty('--scene-y', `${(x*12).toFixed(2)}deg`);
    scene.classList.add('is-interactive');
  });
  scene.addEventListener('pointerleave', () => {scene.classList.remove('is-interactive');scene.style.setProperty('--scene-x','0deg');scene.style.setProperty('--scene-y','0deg');});
}
if (isFinePointer.matches) document.querySelectorAll('.project-visual').forEach(el => {
  el.addEventListener('pointermove',e => {
    if (!motionOn) return;
    const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;
    el.style.setProperty('--tilt-x',`${((.5-y)*12).toFixed(1)}deg`);
    el.style.setProperty('--tilt-y',`${((x-.5)*12).toFixed(1)}deg`);
    el.style.setProperty('--mx',`${(x*100).toFixed(1)}%`);el.style.setProperty('--my',`${(y*100).toFixed(1)}%`);
  });
  el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
});
let scheduled=false;
function updateScroll(){
  document.documentElement.style.setProperty('--scroll',`${(100*window.scrollY/Math.max(1,document.documentElement.scrollHeight-window.innerHeight)).toFixed(2)}%`);
  scheduled=false;
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
updateScroll();
if (isFinePointer.matches) window.addEventListener('pointermove',e=>{
  if (!motionOn) return;
  document.querySelector('.ambient-glow')?.style.setProperty('--cursor-x',`${e.clientX-260}px`);
  document.querySelector('.ambient-glow')?.style.setProperty('--cursor-y',`${e.clientY-260}px`);
},{passive:true});
const sphereStage=document.getElementById('sphereStage');
const sphereAssembly=document.getElementById('sphereAssembly');
let sphereX=-22,sphereY=25,dragging=false,lastX=0,lastY=0;
function renderSphere(){sphereAssembly?.style.setProperty('--sphere-x',`${sphereX}deg`);sphereAssembly?.style.setProperty('--sphere-y',`${sphereY}deg`);}
sphereStage?.addEventListener('pointerdown',e=>{
  if (!motionOn) return;
  dragging=true;lastX=e.clientX;lastY=e.clientY;sphereStage.setPointerCapture(e.pointerId);
});
sphereStage?.addEventListener('pointermove',e=>{
  if (!dragging || !motionOn) return;
  sphereY+=(e.clientX-lastX)*.65;sphereX-=(e.clientY-lastY)*.65;lastX=e.clientX;lastY=e.clientY;renderSphere();
});
for (const evt of ['pointerup','pointercancel','lostpointercapture']) sphereStage?.addEventListener(evt,()=>dragging=false);
sphereStage?.addEventListener('keydown',e=>{
  const keys={ArrowUp:[-10,0],ArrowDown:[10,0],ArrowLeft:[0,-10],ArrowRight:[0,10]};
  if (!keys[e.key]) return; e.preventDefault();sphereX+=keys[e.key][0];sphereY+=keys[e.key][1];renderSphere();
});
document.getElementById('resetSphere')?.addEventListener('click',()=>{sphereX=-22;sphereY=25;renderSphere();});
