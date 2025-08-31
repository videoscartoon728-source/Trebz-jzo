const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');

const gravity=0.5;
let keys={};
let gameOver=false;
let combo=0;

const player={x:100,y:300,width:50,height:50,color:'#0ff',speed:5,dy:0,jumping:false,health:100,attacking:false};
const enemy={x:600,y:300,width:50,height:50,color:'#f0f',speed:3,dy:0,jumping:false,health:100,attacking:false};

document.addEventListener('keydown',e=>{keys[e.key]=true;});
document.addEventListener('keyup',e=>{keys[e.key]=false;});

// Restart
document.getElementById('restart').addEventListener('click',()=>{
  player.health=100; enemy.health=100;
  player.x=100; player.y=300;
  enemy.x=600; enemy.y=300;
  combo=0;
  gameOver=false;
  document.getElementById('status').style.display='none';
  requestAnimationFrame(gameLoop);
});

function updateUI(){
  document.getElementById('playerFill').style.width=player.health+'%';
  document.getElementById('enemyFill').style.width=enemy.health+'%';
  document.getElementById('comboCounter').innerText='Combo: '+combo;
}

function drawRect(obj){
  ctx.fillStyle=obj.color;
  ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
}

function spawnParticle(x,y){
  const p=document.createElement('div');
  p.classList.add('particle');
  p.style.left=x+'px';
  p.style.top=y+'px';
  document.body.appendChild(p);
  setTimeout(()=>p.remove(),300);
}

function attack(attacker,defender){
  if(attacker.attacking &&
     attacker.x + attacker.width > defender.x &&
     attacker.x < defender.x + defender.width &&
     attacker.y + attacker.height > defender.y &&
     attacker.y < defender.y + defender.height){
       defender.health-=0.7;
       combo++;
       spawnParticle(defender.x+defender.width/2,defender.y+defender.height/2);
       ctx.fillStyle='rgba(255,255,255,0.3)';
       ctx.fillRect(defender.x,defender.y,defender.width,defender.height);
  }
}

function gameLoop(){
  if(gameOver) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Player movement
  if(keys['a'] && player.x>0) player.x-=player.speed;
  if(keys['d'] && player.x+player.width<canvas.width) player.x+=player.speed;
  if(keys['w'] && !player.jumping){player.dy=-10;player.jumping=true;}
  if(keys['j'] || keys['k'] || keys['l']) player.attacking=true;
  else player.attacking=false;

  player.dy+=gravity;
  player.y+=player.dy;
  if(player.y>300){player.y=300;player.dy=0;player.jumping=false;}

  // Enemy AI
  if(enemy.x>player.x) enemy.x-=enemy.speed;
  else enemy.x+=enemy.speed;
  enemy.attacking=Math.random()<0.03;

  enemy.dy+=gravity;
  enemy.y+=enemy.dy;
  if(enemy.y>300){enemy.y=300;enemy.dy=0;enemy.jumping=false;}

  attack(player,enemy);
  attack(enemy,player);

  drawRect(player);
  drawRect(enemy);

  updateUI();

  if(player.health<=0 || enemy.health<=0){
    gameOver=true;
    document.getElementById('status').style.display='block';
    document.getElementById('status').innerHTML=(player.health<=0 ? "Enemy Wins!" : "Player Wins!")+' <button id="restart">Restart</button>';
    document.getElementById('restart').addEventListener('click',()=>{
      player.health=100; enemy.health=100;
      player.x=100; player.y=300;
      enemy.x=600; enemy.y=300;
      combo=0;
      gameOver=false;
      document.getElementById('status').style.display='none';
      requestAnimationFrame(gameLoop);
    });
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
