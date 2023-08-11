CONSOLE.Object('monstera',{
	health:100,maxhealth:100,
	height:8,speed:2,accspeed:0.5,dir:1,
	face:{x:0,y:-1},powerUps:[],attacking:false,specialMovementSpeed:10,normalSpeed:2,
	specialCooldownDefault:10,specialCooldown:10,rotation:0,dieParticles:[],
	animations:CONSOLE.animation({parent:'monstera'}),splashParticlesBucket:[],
	stackOnSpeed:1.3,
	gotohell(damage=10){
		this.health -= damage;
		if(this.health<0){
			this.health = 0;
			this.die = true;
			this.engine.gameEnd = true;
			if(!this.engine.winner){
				this.engine.winner = 'xmonster';
				setTimeout(()=>{forceWinner(this.engine.winner)},1000);
			}
			this.pushDieParticles(10);
		}
		const percentage = this.health/this.maxhealth*100;
		document.querySelector('#lefthealthbar').style.width = percentage+'%';
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
	xpower:{
		powers:[],
		jutsu:0,
		maxjutsu:15,
		push(x,y,target,callback){
			if(this.jutsu>2){
				this.powers.push({jutsu:this.jutsu,x,y,
					dir:{
						x:target.x*0.05-x*0.05,y:target.y*0.05-y*0.05
					}
				});
				this.powers.push({jutsu:this.jutsu*3/4,x,y,
					dir:{
						x:target.x*0.045-x*0.045,y:target.y*0.045-y*0.045
					}
				});
				this.powers.push({jutsu:this.jutsu*0.5,x,y,
					dir:{
						x:target.x*0.04-x*0.04,y:target.y*0.04-y*0.04
					}
				});
			}
			this.jutsu = 0;
			if(callback)callback();
		},
		cash(x,y,target,callback){
			this.jutsu += 0.2;
			if(this.jutsu>=this.maxjutsu)this.push(x,y,target,callback);
		}
	},
	init(){
		//save the rivals data at first.
		this.g = this.engine.g;
		this.x = this.engine.canvasSetting.width/2;
		this.y = this.engine.canvasSetting.height/2+200;
		this.animations.newAnimation({
			id:'idle',
			spritesheets:{
				src:CONSOLE.assets.img.idlebluemonster,
				len:21,
				width:CONSOLE.assets.img.idlebluemonster.width,
				height:CONSOLE.assets.img.idlebluemonster.height,
				loop:true
			}
		});
		this.animations.newAnimation({
			id:'walking',
			spritesheets:{
				src:CONSOLE.assets.img.walkingbluemonster,
				len:21,
				width:CONSOLE.assets.img.walkingbluemonster.width,
				height:CONSOLE.assets.img.walkingbluemonster.height,
				loop:true
			}
		});
		this.animations.newAnimation({
			id:'attacking',
			frames:[
				CONSOLE.assets.img.attacking_bm
			]
		});
		this.animations.play('walking');
	},
	update(){
		//this.lookAt(this.engine.object.xmonster,90);
		this.controll();
		this.powerUps.forEach(power=>{
			if(power.destroyed)this.powerUps.shift();
			power.update();
		})
		this.splashParticlesBucket.forEach(particle=>{
			if(particle.destroyed)this.splashParticlesBucket.shift();
			particle.update();
		})
		this.xpower.powers.forEach(power=>{
			power.x += power.dir.x;
			power.y += power.dir.y;
			power.jutsu -= 0.1;
			if(power.jutsu<0)this.xpower.powers.shift();
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
				this.g.circle(this.x,this.y,this.radius+2,'#0044aa');
				this.g.circle(this.x,this.y,this.radius,'white');
			}
		});
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
		this.xpower.powers.forEach(power=>{
			this.g.circle(power.x,power.y,power.jutsu+2,'white');
			this.g.circle(power.x,power.y,power.jutsu,'#3385ff');
		})
		//xpower position.
		const powerpos = {
			x:Math.cos((this.rotation-90)*Math.PI/180)*20,
			y:Math.sin((this.rotation-90)*Math.PI/180)*20
		}
		if(this.xpower.jutsu>0.5){
			this.g.circle(this.x+powerpos.x,this.y+powerpos.y,this.xpower.jutsu+2,'white');
			this.g.circle(this.x+powerpos.x,this.y+powerpos.y,this.xpower.jutsu,'#3385ff');
		}
	},
	drawStyle(){
		this.g.circle(this.x,this.y,18,'RGB(0,0,0,.5)');
		this.g.circle(this.x,this.y,15,'#0044aa');
		this.animations.tick();
	},
	escaping(){
		this.engine.object.redmonster.powerUps.forEach(b=>{
			const d = Math.sqrt((b.x-this.x)**2+(b.y-this.y)**2);
			if(d<15){
				this.x += b.dir.x;
				this.y += b.dir.y;
				this.splashParticles();
				this.gotohell(2.5);
			}
		})
	},
	controll(){
		//special movement.
		
		if(this.engine.gameEnd){
			this.animations.play('idle');
			if(this.xpower.jutsu>0)this.xpower.jutsu = 0;
			return;
		}
		
		if(this.engine.keys.Enter){
			this.specialCooldown--;
			if(this.specialCooldown>0){
				this.speed = this.specialMovementSpeed;
				this.splashParticles();
				if(this.xpower.charging){
					this.xpower.push(this.x,this.y,this.engine.object.redmonster,()=>{
						this.animations.play('walking');
					});
					this.xpower.chargingSlash = true;
					this.xpower.charging = false;
				}
			}else this.speed = this.normalSpeed;
		}else {
			if(!this.xpower.charging)this.speed = this.normalSpeed;
			else this.speed = this.stackOnSpeed;
			if(this.specialCooldown<this.specialCooldownDefault){
				this.specialCooldown = this.specialCooldownDefault;
			}
		}
		if(this.engine.keys.a){
			this.x -= this.speed;
			this.face.x = -1;
			this.rotation = -90;
		}else if(this.engine.keys.d){
			this.x += this.speed;
			this.face.x = 1;
			this.rotation = 90;
		}else this.face.x = 0;
		if(this.engine.keys.w){
			this.y -= this.speed;
			this.face.y = -1;
			this.rotation = 0;
		}else if(this.engine.keys.s){
			this.y += this.speed;
			this.face.y = 1;
			this.rotation = 180;
		}else this.face.y = 0;
		
		//addition dir.
		if(this.engine.keys.a && this.engine.keys.w){
			this.rotation = -45;
		}else if(this.engine.keys.a && this.engine.keys.s){
			this.rotation = -125;
		}else if(this.engine.keys.d && this.engine.keys.w){
			this.rotation = 45;
		}else if(this.engine.keys.d && this.engine.keys.s){
			this.rotation = 125;
		}
		
		if(
		!this.engine.keys.a &&
		!this.engine.keys.d &&
		!this.engine.keys.s &&
		!this.engine.keys.w
		){
			this.animations.play('idle');
		}else {
			this.animations.play('walking');
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
		if(this.engine.keys[' ']){
			if(this.xpower.chargingSlash)return;
			this.lookAt(this.engine.object.redmonster,90);
			this.animations.play('attacking');
			this.xpower.charging = true;
			this.xpower.cash(this.x,this.y,this.engine.object.redmonster);
		}else{
			if(this.xpower.jutsu>0)this.xpower.push(this.x,this.y,this.engine.object.redmonster);
			if(this.xpower.chargingSlash)this.xpower.chargingSlash = false;
			this.xpower.charging = false;
		}
	},
	attack(){
		this.rivals = this.engine.object.xmonster;
		if(this.powerUps.length>2)return;
		this.powerUps.push({
			timeleft:60,dir:{x:(this.rivals.x-this.x)*0.05,y:(this.rivals.y-this.y)*0.05},
			x:this.x,y:this.y,g:this.g,speed:3,radius:5,radiusGrowingValue:[2,3,5].getRandom(),
			draw(){
				if(!this.destroyed){
					this.g.circle(this.x,this.y,this.radius+2,'white');
					this.g.circle(this.x,this.y,this.radius,'#3385ff');
				}
			},
			update(){
				
				this.x += this.dir.x;
				this.y += this.dir.y;
				this.radius += this.radiusGrowingValue;
				
				this.timeleft-=1;
				if(this.timeleft<=0){
					this.destroyed = true;
				}
			}
		});
	}
})