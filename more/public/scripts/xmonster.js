CONSOLE.Object('xmonster',{
	height:8,speed:2,accspeed:0.5,dir:{x:0,y:0},health:100,maxhealth:100,
	face:{x:0,y:-1},powerUps:[],attacking:false,attackingRadius:150,dieParticles:[],
	animations:CONSOLE.animation({parent:'xmonster'}),splashParticlesBucket:[],
	gotohell(damage=10){
		this.health -= damage;
		if(this.health<0){
			this.health = 0;
			this.die = true;
			this.engine.gameEnd = true;
			if(!this.engine.winner){
				this.engine.winner = 'monstera';
				setTimeout(()=>{forceWinner(this.engine.winner)},1000);
			}
			this.pushDieParticles(10);
		}
		const percentage = this.health/this.maxhealth*100;
		document.querySelector('#righthealthbar').style.width = percentage+'%';
	},
	pushDieParticles(len){
		for(let i=0;i<len;i++){
			this.dieParticles.push({
				r:Math.floor(Math.random()*10),
				x:this.x,
				y:this.y,
				dir:{
					x:Math.cos(Math.floor(Math.random()*180))*[1,-1].getRandom(),
					y:Math.sin(Math.floor(Math.random()*180))*[1,-1].getRandom()
				},
				lifeTime:Math.floor(Math.random()*10),
				growValue:Math.random()
			})
		}
	},
	init(){
		this.g = this.engine.g;
		this.x = this.engine.canvasSetting.width/2;
		this.y = this.engine.canvasSetting.height/2-200;
		this.animations.newAnimation({
			id:'idle',
			spritesheets:{
				src:CONSOLE.assets.img.idlebluemonster,
				len:21,
				width:CONSOLE.assets.img.idlebluemonster.width,
				height:CONSOLE.assets.img.idlebluemonster.height
			},
			loop:true
		});
		this.animations.newAnimation({
			id:'walking',
			spritesheets:{
				src:CONSOLE.assets.img.walkingbluemonster,
				len:21,
				width:CONSOLE.assets.img.walkingbluemonster.width,
				height:CONSOLE.assets.img.walkingbluemonster.height
			},
			loop:true
		});
		this.animations.newAnimation({
			id:'attacking',
			frames:[
				CONSOLE.assets.img.attacking_bm
			],
			loop:false
		});
		this.animations.play('walking');
	},
	update(){
		if(!this.engine.gameEnd)this.move();
		else this.animations.play('idle');
		this.pending('xmonsterpending',20,()=>{this.lookAt(this.player,90)});
		this.powerUps.forEach(power=>{
			if(power.destroyed)this.powerUps.shift();
			power.update();
		})
		this.splashParticlesBucket.forEach(particle=>{
			if(particle.destroyed)this.splashParticlesBucket.shift();
			particle.update();
		})
		this.escaping();
		//handle die particles.
		this.dieParticles.forEach(particle=>{
			particle.x += particle.dir.x;
			particle.y += particle.dir.y;
			particle.r += particle.growValue;
			particle.lifeTime-=.1;
			if(particle.lifeTime<=0)this.dieParticles.shift();
		})
	},
	onescapingWay:false,
	escaping(){
		this.engine.object.monstera.xpower.powers.forEach(b=>{
			const d = Math.sqrt((b.x-this.x)**2+(b.y-this.y)**2);
			if(d<10){
				const dir = {x:b.x-this.x,y:b.y-this.y};
				this.escapingGoal = {x:this.x + dir.y*20,y:this.y + dir.x*20}
				//esacaping point check for the box, island.
				const island = this.engine.object.island;
				if(this.escapingGoal.x > this.engine.center.x + island.size.x/2 || this.escapingGoal.x < this.engine.center.x - island.x/2){
					this.escapingGoal.x = this.engine.center.x;
				}
				if(this.escapingGoal.y > this.engine.center.y + island.size.y/2 || this.escapingGoal.y < this.engine.center.y - island.y/2){
					this.escapingGoal.y = this.engine.center.y;
				}
				this.onescapingWay = true;
				this.gotohell(b.jutsu*.5);
			}
		})
	},
	splashParticles(){
		if(this.splashParticlesBucket.length>10)return;
		this.splashParticlesBucket.push({
			face:{x:this.face.x,y:this.face.y},x:this.x,y:this.y,lifeTime:20,
			g:this.g,radius:[.05,.08,.1,.2].getRandom()*20,radiusGrowingValue:[.05,.08,.1,.2].getRandom(),
			update(){
				this.x += -this.face.x;
				this.y += -this.face.y;
				this.radius += this.radiusGrowingValue*2;
				
				this.lifeTime--;
				if(this.lifeTime<=0){
					this.destroyed = true;
				}
			},
			draw(){
				this.g.circle(this.x,this.y,this.radius+2,'#ff8000');
				this.g.circle(this.x,this.y,this.radius,'white');
			}
		});
	},
	move(){
		//move script.
		if(this.engine.object.monstera){
			if(this.onescapingWay){
				this.player = this.escapingGoal;
				this.dir = {x:(this.player.x-this.x),y:(this.player.y-this.y)}
				this.splashParticles();
			}else{
				this.player = this.engine.object.monstera;
				this.dir = {x:(this.player.x*.1-this.x*.1),y:(this.player.y*.1-this.y*.1)}
			}
		}
		if(!this.attacking){
			this.x += this.dir.x*.1;
			this.y += this.dir.y*.1;
		}
		if(this.escapingGoal)if(Math.sqrt((this.escapingGoal.x-this.x)**2+(this.escapingGoal.y-this.y)**2)<10){
			this.onescapingWay = false;
		}
		
		
		//island handling.
		const island = this.engine.object.island;
		if(this.x > this.engine.center.x + island.size.x/2){
			this.x = this.engine.center.x + island.size.x/2;
		}else if(this.x < this.engine.center.x - island.size.x/2){
			this.x = this.engine.center.x - island.size.x/2;
		}
		if(this.y < this.engine.center.y - island.size.y/2){
			this.y = this.engine.center.y - island.size.y/2;
		}else if(this.y > this.engine.center.y + island.size.y/2){
			this.y = this.engine.center.y + island.size.y/2;
		}
		
		if(Math.sqrt((this.player.x-this.x)**2+(this.player.y-this.y)**2)<10)this.needescaping = false;
		
		const distance = Math.sqrt((this.player.x-this.x)**2+(this.player.y-this.y)**2);
		if(distance<this.attackingRadius){
			this.attack();
		}else{
			this.animations.play('walking');
			this.attacking = false;
		}
	},
	draw(){
		if(!this.die)this.drawStyle();
		else{
			this.dieParticles.forEach(particle=>{
				this.g.circle(particle.x,particle.y,particle.r+2,'red');
				this.g.circle(particle.x,particle.y,particle.r,'white');
			})
		}
		this.powerUps.forEach(power=>{
			power.draw();
		})
		this.splashParticlesBucket.forEach(particle=>{
			particle.draw();
		})
	},
	drawStyle(){
		this.g.circle(this.x,this.y,18,'RGB(0,0,0,.5)');
		this.g.circle(this.x,this.y,15,'#0044aa');
		this.animations.tick();
	},
	attack(){
		this.player = this.engine.object.monstera;
		this.attacking = true;
		if(this.powerUps.length>2){
			this.animations.play('walking');
			this.attacking = false;
			return;
		};
		this.animations.play('attacking');
		this.powerUps.push({
			enginedt:this.engine.dt,
			timeleft:50,dir:{x:(this.player.x-this.x)*0.05,y:(this.player.y-this.y)*0.05},
			x:this.x,y:this.y,g:this.g,face:{x:this.face.x,y:this.face.y},speed:50,radius:5,radiusGrowingValue:[.05,.08,.1].getRandom(),
			draw(){
				if(!this.destroyed){
					this.g.circle(this.x,this.y,this.radius+2,'white');
					this.g.circle(this.x,this.y,this.radius,'#ff8000');
				}
			},
			update(){
				//movement script.
				
				this.x += this.dir.x*this.enginedt*this.speed;
				this.y += this.dir.y*this.enginedt*this.speed;
				this.radius += this.radiusGrowingValue;
				
				this.timeleft-=1;
				if(this.timeleft<=0){
					this.destroyed = true;
				}
			}
		});
	}
})