import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ebbc9);
scene.fog = new THREE.FogExp2(0x9ebbc9, 0.0085);

const camera = new THREE.PerspectiveCamera(61, innerWidth / innerHeight, 0.1, 450);
camera.position.set(0, 5.2, 10.5);
camera.lookAt(0, 1, -8);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

scene.add(new THREE.HemisphereLight(0xe3f3ff, 0x4a513f, 2.1));
const sun = new THREE.DirectionalLight(0xffedcf, 3.3);
sun.position.set(-18, 30, 14); sun.castShadow = true;
sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-28; sun.shadow.camera.right=28; sun.shadow.camera.top=35; sun.shadow.camera.bottom=-35;
scene.add(sun);

const mat = (color, roughness=.65, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
const asphalt=mat(0x30373c,.92), shoulder=mat(0x777c7b), grass=mat(0x4d6a4d), laneMat=mat(0xe5e2d7), dark=mat(0x10171b,.35), rubber=mat(0x111316,.95), glass= new THREE.MeshPhysicalMaterial({color:0x132b3b,roughness:.17,metalness:.35,transparent:true,opacity:.9}), chrome=mat(0x9da8ae,.25,.8);
// Ultra scenic divided highway: long multi-lane asphalt, shoulders, rumble strips,
// lane markings, distant terrain and roadside infrastructure. Endless road tiles recycle.
const highwayLength = 620;
const highwayWidth = 28;
const roadTiles = [];
const roadMarkings = [];
const roadEdges = [];
const highwayRoadMat = mat(0x30383c,.96);
const highwayShoulderMat = mat(0x777b78,.92);
const highwayPaintMat = mat(0xe9e6dd,.6);
const rumbleRed = mat(0xc94335,.85);
const rumbleWhite = mat(0xf0eee6,.85);
const medianMat = mat(0x69716a,.95);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200,1200), grass);
ground.rotation.x=-Math.PI/2; ground.position.set(0,-.15,-260); ground.receiveShadow=true; scene.add(ground);

function addRoadTile(z) {
  const tile = new THREE.Group();
  const road = new THREE.Mesh(new THREE.BoxGeometry(highwayWidth,.12,40), highwayRoadMat);
  road.position.y=.0; road.receiveShadow=true; road.castShadow=false; tile.add(road);
  const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(2.1,.14,40),highwayShoulderMat);
  shoulderL.position.set(-highwayWidth/2-1.05,.015,0);tile.add(shoulderL);
  const shoulderR = shoulderL.clone();shoulderR.position.x=highwayWidth/2+1.05;tile.add(shoulderR);
  // Three lanes in each direction, with a broad painted median.
  for(const x of [-9.3,-4.65,4.65,9.3]){
    const line=new THREE.Mesh(new THREE.BoxGeometry(.12,.025,5.2),highwayPaintMat);
    line.position.set(x,.075,-12);tile.add(line);roadMarkings.push(line);
    const line2=line.clone();line2.position.z=0;tile.add(line2);roadMarkings.push(line2);
    const line3=line.clone();line3.position.z=12;tile.add(line3);roadMarkings.push(line3);
  }
  const median = new THREE.Mesh(new THREE.BoxGeometry(1.25,.03,40),medianMat);median.position.set(0,.08,0);tile.add(median);
  for(const side of [-1,1]){
    for(let j=0;j<8;j++){
      const strip=new THREE.Mesh(new THREE.BoxGeometry(.55,.04,2.5),j%2?rumbleWhite:rumbleRed);
      strip.position.set(side*(highwayWidth/2+.22),.09,-17.5+j*5);tile.add(strip);
    }
  }
  for(const x of [-highwayWidth/2,highwayWidth/2]){
    const edge=new THREE.Mesh(new THREE.BoxGeometry(.14,.05,40),highwayPaintMat);edge.position.set(x,.09,0);tile.add(edge);
  }
  tile.position.z=z;scene.add(tile);roadTiles.push(tile);
}
for(let z=-600;z<=40;z+=40)addRoadTile(z);

const guardrails=[];
function addGuardrailSide(x,z){
 const g=new THREE.Group();
 const beam=new THREE.Mesh(new THREE.BoxGeometry(.18,.28,39),mat(0x9da5a8,.35,.75));beam.position.y=.72;g.add(beam);
 for(let k=0;k<8;k++){const post=new THREE.Mesh(new THREE.BoxGeometry(.13,.8,.16),mat(0x737d83,.5,.55));post.position.set(0,.4,-17+k*4.8);g.add(post);}
 g.position.set(x,0,z);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(g);guardrails.push(g);
}
for(let z=-600;z<=40;z+=40){addGuardrailSide(-16.6,z);addGuardrailSide(16.6,z);}

const scenery=[];
function makeTree(x,z,scale=1){
 const tree=new THREE.Group();
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.19,1.6,8),mat(0x654c35));trunk.position.y=.8;tree.add(trunk);
 const crownMat=mat([0x31513b,0x426749,0x58724c][Math.floor(Math.random()*3)],.92);
 for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.ConeGeometry(1.0-i*.12,1.9,8),crownMat);crown.position.y=1.8+i*.62;tree.add(crown);}
 tree.position.set(x,0,z);tree.scale.setScalar(scale);tree.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(tree);scenery.push(tree);
}
function makeHighwaySign(x,z,side){
 const g=new THREE.Group();
 const post=new THREE.Mesh(new THREE.BoxGeometry(.18,3.7,.18),chrome);post.position.y=1.85;g.add(post);
 const board=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.25,.16),mat(0x14513d,.7));board.position.set(side*1.25,3.3,0);g.add(board);
 const stripe=new THREE.Mesh(new THREE.BoxGeometry(2.1,.07,.03),mat(0xf3f2e9));stripe.position.set(side*1.25,3.5,-.1);g.add(stripe);
 const stripe2=new THREE.Mesh(new THREE.BoxGeometry(1.35,.06,.03),mat(0xf3f2e9));stripe2.position.set(side*1.25,3.22,-.1);g.add(stripe2);
 g.position.set(x,0,z);scene.add(g);scenery.push(g);
}
function makeLamp(x,z){
 const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,5,8),chrome);pole.position.y=2.5;g.add(pole);
 const arm=new THREE.Mesh(new THREE.BoxGeometry(1.25,.08,.08),chrome);arm.position.set(x<0?.55:-.55,4.8,0);g.add(arm);
 const light=new THREE.Mesh(new THREE.BoxGeometry(.45,.13,.25),mat(0xfff1d0,.3));light.position.set(x<0?1.05:-1.05,4.75,0);g.add(light);
 g.position.set(x,0,z);scene.add(g);scenery.push(g);
}
for(let z=-590;z<35;z+=16){
 makeTree(-23-Math.random()*10,z,.75+Math.random()*.8);
 makeTree(23+Math.random()*10,z-7,.75+Math.random()*.8);
 if(z%80===0){makeHighwaySign(-17,z-12,-1);makeHighwaySign(17,z-32,1);}
 if(z%32===0){makeLamp(-14,z-5);makeLamp(14,z-21);}
}
for(let i=0;i<38;i++){
 const hill=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),mat(i%2?0x718b7c:0x849b8d,.98));
 hill.scale.set(10+Math.random()*20,4+Math.random()*9,14+Math.random()*20);
 hill.position.set((i%2?1:-1)*(35+Math.random()*85),-1,-80-i*15);
 scene.add(hill);
}

function makeCar(color=0xe42d2d, player=false){
  const g=new THREE.Group();
  const bodyMat=mat(color,.25,.58), trim=mat(0x0d141b,.3,.2), windowMat=new THREE.MeshPhysicalMaterial({color:0x172d3b,metalness:.25,roughness:.13,clearcoat:1});
  function box(w,h,d,m,x,y,z){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
  box(1.85,.48,3.9,bodyMat,0,.72,0);
  box(1.76,.27,1.18,bodyMat,0,.94,-1.25);
  box(1.7,.25,1.0,bodyMat,0,.88,1.38);
  const cabin=box(1.34,.62,1.75,windowMat,0,1.16,-.15);cabin.scale.set(1,.94,1);
  box(1.23,.13,1.2,bodyMat,0,1.51,-.17);
  for(const s of [-1,1]){
    box(.07,.46,1.6,bodyMat,s*.68,1.2,-.12);
    box(.13,.18,2.7,trim,s*.89,.49,0);
    box(.09,.13,.8,chrome,s*.91,.74,-1.15);
    box(.2,.12,.22,bodyMat,s*1.0,1.05,-.85);
  }
  box(.82,.18,.08,trim,0,.62,-1.98);
  box(.46,.12,.07,mat(0xe9f4ff,.2),-.55,.86,-1.96);
  box(.46,.12,.07,mat(0xe9f4ff,.2),.55,.86,-1.96);
  box(.52,.11,.07,mat(0xff3026,.2),-.57,.86,1.96);
  box(.52,.11,.07,mat(0xff3026,.2),.57,.86,1.96);
  box(1.45,.13,.22,trim,0,.52,-1.98);
  const wheels=[];
  for(const x of [-.97,.97])for(const z of [-1.25,1.28]){
    const wheel=new THREE.Group();wheel.position.set(x,.49,z);g.add(wheel);
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.24,24),rubber);tire.rotation.z=Math.PI/2;tire.castShadow=true;wheel.add(tire);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.235,.235,.255,16),chrome);rim.rotation.z=Math.PI/2;wheel.add(rim);
    const center=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.27,12),dark);center.rotation.z=Math.PI/2;wheel.add(center);
    for(let k=0;k<5;k++){const spoke=new THREE.Mesh(new THREE.BoxGeometry(.035,.34,.045),chrome);spoke.rotation.z=k*Math.PI*2/5;wheel.add(spoke);}
    wheels.push(wheel);
  }
  if(player){box(1.5,.09,.24,trim,0,1.45,1.55);for(const s of [-.5,.5])box(.07,.3,.08,chrome,s,1.29,1.5);}
  g.userData.wheels=wheels; g.userData.player=player;
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  return g;
}

const player=makeCar(0xe33b2f,true);player.position.set(0,0,3.5);scene.add(player);
const REAL_CAR_MODEL_URL = 'https://raw.githubusercontent.com/JaronKBragg7337/spectral-gt-rs/main/spectral_gt_rs_game_ready.glb';
const gltfLoader = new GLTFLoader();
gltfLoader.load(REAL_CAR_MODEL_URL, (gltf) => {
  const model = gltf.scene;
  model.rotation.y = Math.PI / 2;
  model.updateMatrixWorld(true);
  let bounds = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3(); bounds.getSize(size);
  const targetLength = 4.35;
  const scale = targetLength / Math.max(size.z, size.x, 0.001);
  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);
  bounds = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3(); bounds.getCenter(center);
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= bounds.min.y;
  model.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true; obj.receiveShadow = true;
      if (obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const material of materials) {
          if ('envMapIntensity' in material) material.envMapIntensity = 1.35;
          if ('roughness' in material && material.roughness > 0.6) material.roughness = 0.42;
        }
      }
    }
  });
  player.clear(); player.add(model); player.userData.wheels=[]; player.userData.realModel=true;
  const loading = document.querySelector('#loading'); if (loading) loading.style.display = 'none';
}, undefined, (error) => {
  console.warn('Detailed car model could not be loaded; using built-in fallback car.', error);
  const loading = document.querySelector('#loading'); if (loading) loading.style.display = 'none';
});

const traffic=[];
const trafficColors=[0xe6e4df,0x1c2837,0x1c5a91,0xc6a75d,0x3e6252,0x8b2b2d];
function spawnTraffic(z){
  const car=makeCar(trafficColors[Math.floor(Math.random()*trafficColors.length)]);
  const lane=[-6,-2,2,6][Math.floor(Math.random()*4)];
  car.position.set(lane,0,z);car.scale.setScalar(.91);scene.add(car);
  traffic.push({mesh:car,z,lane,speed:8+Math.random()*15,passed:false});
}
for(let i=0;i<8;i++)spawnTraffic(-38-i*39);

let running=false,paused=false,gameOver=false;
let speed=0,maxSpeed=0,distance=0,steer=0,elapsed=0,shake=0;
const keys={};const speedEl=document.querySelector('#speed'),distEl=document.querySelector('#distance'),bestEl=document.querySelector('#best');
let best=Number(localStorage.getItem('apex-best')||0);bestEl.textContent=String(best).padStart(3,'0');
const startScreen=document.querySelector('#start-screen'),overScreen=document.querySelector('#game-over'),pauseScreen=document.querySelector('#paused');
const statusEl=document.querySelector('#status');
function begin(){speed=0;maxSpeed=0;distance=0;steer=0;elapsed=0;gameOver=false;paused=false;running=true;player.position.set(0,0,3.5);player.rotation.set(0,0,0);traffic.forEach((t,i)=>{t.z=-38-i*39;t.lane=[-9,-4.5,4.5,9][Math.floor(Math.random()*4)];t.mesh.position.set(t.lane,0,t.z);t.passed=false;});startScreen.classList.add('hidden');overScreen.classList.add('hidden');pauseScreen.classList.add('hidden');statusEl.textContent='ROAD OPEN';}
document.querySelector('#start').addEventListener('click',begin);
document.querySelector('#restart').addEventListener('click',begin);
document.querySelector('#pause').addEventListener('click',togglePause);
document.querySelector('#resume').addEventListener('click',togglePause);
function togglePause(){if(!running||gameOver)return;paused=!paused;pauseScreen.classList.toggle('hidden',!paused);}
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key.toLowerCase()==='p')togglePause();if(e.key==='Enter'&&(!running||gameOver))begin();});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function bindHold(id,key){const el=document.getElementById(id);const on=e=>{e.preventDefault();keys[key]=true;};const off=e=>{e.preventDefault();keys[key]=false;};el.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(n=>el.addEventListener(n,off));}
bindHold('left','arrowleft');bindHold('right','arrowright');bindHold('gas','arrowup');bindHold('brake','arrowdown');
function endGame(){gameOver=true;running=false;overScreen.classList.remove('hidden');document.querySelector('#final-distance').textContent=distance.toFixed(2)+' KM';document.querySelector('#final-speed').textContent=Math.round(maxSpeed)+' KM/H';statusEl.textContent='RUN ENDED';}
function update(dt){
 if(!running||paused)return;
 elapsed+=dt;
 const accel=keys['arrowup']||keys['w'], brake=keys['arrowdown']||keys['s'];
 if(accel)speed+=32*dt;else speed-=6*dt;
 if(brake)speed-=55*dt;
 speed=THREE.MathUtils.clamp(speed,0,245);
 maxSpeed=Math.max(maxSpeed,speed);distance+=speed/3600*dt;
 const left=keys['arrowleft']||keys['a'],right=keys['arrowright']||keys['d'];
 const target=(left?-1:0)+(right?1:0);
 steer=THREE.MathUtils.damp(steer,target,5,dt);
 player.position.x=THREE.MathUtils.clamp(player.position.x+steer*(2.7+speed/50)*dt,-12.2,12.2);
 player.rotation.z=THREE.MathUtils.damp(player.rotation.z,-steer*.07,7,dt);
 player.rotation.y=THREE.MathUtils.damp(player.rotation.y,-steer*.06,6,dt);
 for(const w of player.userData.wheels)w.rotation.x-=speed*dt*.04;
 const roadShift=speed*dt*.34;
 roadTiles.forEach(tile=>{tile.position.z+=roadShift;if(tile.position.z>40)tile.position.z-=640;});
 guardrails.forEach(g=>{g.position.z+=roadShift;if(g.position.z>40)g.position.z-=640;});
 scenery.forEach(s=>{s.position.z+=roadShift*.9;if(s.position.z>35)s.position.z-=650;});
 for(const t of traffic){
   t.z += roadShift - (speed-t.speed)*dt*.13;
   if(t.z>12){t.z=-360-Math.random()*180;t.lane=[-9,-4.5,4.5,9][Math.floor(Math.random()*4)];t.mesh.position.x=t.lane;t.passed=false;}
   t.mesh.position.z=t.z;
   for(const w of t.mesh.userData.wheels)w.rotation.x-=t.speed*dt*.025;
   const dx=Math.abs(t.mesh.position.x-player.position.x),dz=Math.abs(t.z-player.position.z);
   if(dx<1.75&&dz<2.8){endGame();break;}
   if(!t.passed&&t.z>player.position.z+2){t.passed=true;statusEl.textContent='CLEAN PASS';}
 }
 camera.position.x=THREE.MathUtils.damp(camera.position.x,player.position.x*.28,2.2,dt);
 camera.position.y=5.1+Math.sin(elapsed*14)*Math.min(speed/500,.035);
 camera.position.z=10.6;
 camera.lookAt(player.position.x*.2,1,-12);
 camera.fov=61+speed/245*5;camera.updateProjectionMatrix();
 speedEl.textContent=String(Math.round(speed)).padStart(3,'0');distEl.textContent=distance.toFixed(2);
 document.querySelector('#gear').textContent='GEAR '+Math.max(1,Math.min(6,Math.floor(speed/42)+1));
 if(maxSpeed>best){best=Math.round(maxSpeed);bestEl.textContent=String(best).padStart(3,'0');localStorage.setItem('apex-best',String(best));}
}
let last=performance.now();
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;update(dt);renderer.render(scene,camera);}
requestAnimationFrame(animate);
window.dispatchEvent(new Event('apex-game-ready'));
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));});
setTimeout(()=>{const loading=document.querySelector('#loading');if(loading)loading.style.display='none';},2500);