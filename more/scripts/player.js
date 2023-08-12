CONSOLE.Object('playermechanism',{
	state:0,startOk:false,wannaStop:true,computerPowValue:.00005,
	audios:{
		badtime:CONSOLE.audio({src:'./more/media/badtime.wav'}),
		goodtime:CONSOLE.audio({src:'./more/media/goodtime.wav'})
	},
	start(){
		this.engine.assets.audio.countdown.play();
		this.engine.assets.audio.countdown.onended = ()=>{
			this.wannaStop = false;
			//and play the crowd and bgmusic.
			this.engine.assets.audio.bgmusic.play();
			this.engine.assets.audio.crowd.play();
		}
		if(!this.engine.assets.audio.proclamationSound.paused){
			this.engine.assets.audio.proclamationSound.pause();
		}
	},
	playProclamationSound(icon){
		if(this.engine.assets.audio.proclamationSound.paused){
			this.engine.assets.audio.proclamationSound.play();
			icon.src = './more/media/nomusic.png';
		}else{
			this.engine.assets.audio.proclamationSound.pause();
			icon.src = './more/media/musicnote.png';
		}
		this.engine.assets.audio.proclamationSound.onended = ()=>{
			icon.src = './more/media/musicnote.png';
		}
	},
	init(){
		this.centerPointY = this.engine.canvasSetting.height/2+this.state;
		this.timA = {
			peoplesLen:8,
			engine:this.engine,
			gap:10,
			x:this.engine.canvasSetting.width/2,
			y:this.engine.canvasSetting.height*2/10,
			height:200,
			parent:this,
			computerPullPower:.0037,//initial power.
			init(){
				
			},
			drawPeoples(){
				forIn(this.peoplesLen,(i)=>{
					let end = this.y+this.height/2;
					let x = this.x+9*(i%2==0?-1:1);
					let y = end-this.height*i/this.peoplesLen;
					this.engine.g.rect(x,y,20,20,'#000000c2');
					this.engine.g.rect(x,y,15,15,'#ffe582');
					//x = this.x+15/2*(i%2==0?-1:1);
					this.engine.g.circle(x,y-2,7,'#dfa943');
					this.engine.g.circle(x,y-5,7,'black');
				})
			},
			pullComputer(){
				this.parent.state += this.computerPullPower;
			},
			update(state){
				this.pullComputer();
				if(state!==0){
					this.y -= state*.5;
				}
			},
			draw(){
				this.drawPeoples();
			}
		}
		
		this.timB = {
			peoplesLen:8,
			engine:this.engine,
			gap:10,
			parent:this,
			x:this.engine.canvasSetting.width/2,
			y:this.engine.canvasSetting.height*8/10,
			height:200,
			init(){
				
			},
			drawPeoples(){
				forIn(this.peoplesLen,(i)=>{
					let end = this.y-this.height/2;
					let x = this.x+9*(i%2==0?1:-1);
					let y = end+this.height*i/this.peoplesLen;
					this.engine.g.rect(x,y,20,20,'#000000c2');
					this.engine.g.rect(x,y,15,15,'#ffe582');
					this.engine.g.circle(x,y+2,7,'#dfa943');
					this.engine.g.circle(x,y+5,7,'black');
				})
			},
			winTracker:{
				engine:this.engine,
				g:this.engine.g,
				x:this.engine.canvasSetting.width*5/7,
				y:this.engine.canvasSetting.height/2+15,
				width:10,
				height:this.engine.canvasSetting.height*3/9,
				medaly:this.engine.canvasSetting.height/2+15,
				update(){
					this.medaly -= (this.engine.canvasSetting.height*3/9/((this.engine.canvasSetting.height*3/7)/this.engine.object.playermechanism.state))*.5;
				},
				draw(){
					//theline.
					this.engine.g.rect(this.x,this.y,this.width,this.height,'white');
					//thecircle.
					this.engine.g.circle(this.x,this.y-this.height/2,12,'white');
					this.engine.g.circle(this.x,this.y+this.height/2,12,'white');
					//thewinner.
					this.engine.g.circle(this.x,this.y,10,'white');
					this.engine.g.circle(this.x,this.medaly,16,'white');
					this.engine.g.putImage(this.engine.assets.img.medal,this.x,this.medaly,32,32);
				}
			},
			momentum:{
				parent:this,
				engine:this.engine,
				x:this.engine.canvasSetting.width*2/7,
				y:this.engine.canvasSetting.height/2+15,
				height:this.engine.canvasSetting.height*3/9,
				width:40,
				hLiney:this.engine.canvasSetting.height*4/6,
				hLineMoveDir:7.5,
				targetY:this.engine.canvasSetting.height*1/2+15+(this.engine.canvasSetting.height*3/9/2)*[2/6,3/6,4/6,5/6].getRandom()*[-1,1].getRandom()+10,
				getNewTarget(){this.targetY = this.engine.canvasSetting.height*1/2+15+(this.engine.canvasSetting.height*3/9/2)*[2/6,3/6,4/6,5/6].getRandom()*[-1,1].getRandom()+10},
				update(){
					this.hLiney += this.hLineMoveDir;
					if(this.hLiney >= this.y+this.height/2 || this.hLiney <= this.y-this.height/2+30){
						this.hLineMoveDir *= -1;
					}
				},
				draw(){
					this.engine.g.rect(this.x,this.y,this.width,this.height,'black');
					this.engine.g.rect(this.x,this.y,this.width-2,this.height-2,'white');
					this.engine.g.rect(this.x,this.targetY,this.width-5,5,'#1aeb2c');
					this.engine.g.rect(this.x,this.hLiney,this.width-5,5,'red');
					
					//drawing pullicon.
					this.engine.g.circle(this.engine.canvasSetting.width*2/7.,this.y-this.height/2,26,'black');
					this.engine.g.circle(this.engine.canvasSetting.width*2/7.,this.y-this.height/2,25,'white');
					this.engine.g.putImage(this.engine.assets.img.pullicon,this.engine.canvasSetting.width*2/7.,this.y-this.height/2,40,40);
				}
			},
			spaceDown:false,
			strike(){
				let iris = this.momentum.targetY-this.momentum.hLiney;
				if(iris<0)iris*=-1;
				if(iris > 25){
					this.parent.audios.badtime.play();
					this.engine.object.playermechanism.state += iris*0.005;
				}else {
					this.parent.audios.goodtime.play();
					iris = this.engine.canvasSetting.height*3/9-iris;
					this.engine.object.playermechanism.state -= iris*0.001;
					//emplem the linear difficulty.
					this.parent.timA.computerPullPower += this.parent.computerPowValue;
				}
				this.momentum.getNewTarget();
			},
			inputHandler(){
				if(this.engine.keys[' '] && !this.spaceDown){
					this.strike();
					this.spaceDown = true;
				}
				if(!this.engine.keys[' '])this.spaceDown = false;
			},
			update(state){
				this.momentum.update();
				this.inputHandler();
				this.y -= state*.5;
				this.winTracker.update();
				//checking losing state.
			},
			draw(){
				this.drawPeoples();
				this.momentum.draw();
				this.winTracker.draw();
			}
		}
	},
	handleGameEnd(winner){
		this.wannaStop = true;
		//stoping all of the audios.
		this.engine.assets.audio.crowd.pause();
		this.engine.assets.audio.bgmusic.pause();
		//winninglose sound.
		this.engine.assets.audio[(winner==1?'lose':'win')].play();
		this.engine.assets.audio.proclamationSound.play();
		
		//set the state.
		find('#gameendstate').innerHTML = winner===1?'"Maju Terus Jendral!"':'"Luar Biasa Jendral!"';
		//show the end ui.
		find('#gameend').show('flex');
		//hide the x.
		find('#gameplayui').hide();
	},
	handlingCenterPoint(){
		this.centerPointY -= this.state*.5;
		let winner = null;
		if(this.centerPointY < this.engine.canvasSetting.height*2/7){
			winner = 1;
		}else if(this.centerPointY > this.engine.canvasSetting.height*5/7){
			winner = 2;
		}
		if(winner){
			this.handleGameEnd(winner);
		}
	},
	mobileControll(){
		if((this.engine.mouseDown || this.engine.touchDown) && !this.mobileWait){
			this.timB.strike();
			this.mobileWait = true;
		}
		if(!this.engine.mouseDown && !this.engine.touchDown){
			this.mobileWait = false;
		}
	},
	update(){
		if(this.engine.mouseDown || this.engine.touchDown){
			this.engine.assets.audio.merdeka.play();
		}
		if(this.wannaStop)return;
		this.timA.update(this.state);
		this.timB.update(this.state);
		this.handlingCenterPoint();
		this.mobileControll();
	},
	draw(){
		//drawing the line.
		this.engine.g.line(this.timA.x,this.timA.y-this.timA.height/2,this.timB.x,this.timB.y+this.timB.height/2,'#774800',5);
		//center point.
		this.engine.g.circle(this.engine.canvasSetting.width/2,this.centerPointY,5,'red');
		
		this.timA.draw();
		this.timB.draw();
	}
})