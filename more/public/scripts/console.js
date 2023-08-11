
const lerp = function(a,b,t){
	return a+(b-a)*t;
}

const vectorR = function(vector,origin,angle){
	const nvector = {x:vector.x-origin.x,y:vector.y-origin.y};
	const nnvector = {
		x:nvector.x*Math.cos(angle)-nvector.y*Math.sin(angle),
		y:nvector.x*Math.sin(angle)+nvector.y*Math.cos(angle)
	}
	return nnvector;
}

const getIntersection = function(a,b,c,d){
	/*
		x = lerp(a.x,b.x,t) = lerp(c.x,d.x,u).
		x = a.x+(b.x-a.x)t = c.x+(d.x-c.x)u.
		x = (a.x-c.x)+(b.x-a.x)t = (d.x-c.x)u.
		y = lerp(a.y,b.y,t) = lerp(c.y,d.y,u).
		y = a.y+(b.y-a.y)t = c.y+(d.y-c.y)u.
		y = (a.y-c.y)+(b.y-a.y)t = (d.y-c.y)u.
		y = (d.x-c.x)(a.y-c.y)+(d.x-c.x)(b.y-a.y)t = (d.y-c.y)(d.x-c.x)u.
		y = (d.x-c.x)(a.y-c.y)+(d.x-c.x)(b.y-a.y)t = (d.y-c.y)(a.x-c.x)+(d.y-c.y)(b.x-a.x)t.
		y = (d.x-c.x)(a.y-c.y)+((d.x-c.x)(b.y-a.y)t)-(d.y-c.y)(a.x-c.x) = (d.y-c.y)(b.x-a.x)t.
		y = (d.x-c.x)(a.y-c.y)-(d.y-c.y)(a.x-c.x) = (d.y-c.y)(b.x-a.x)t-(d.x-c.x)(b.y-a.y)t.
		y = (d.x-c.x)(a.y-c.y)-(d.y-c.y)(a.x-c.x) = ((d.y-c.y)(b.x-a.x)-(d.x-c.x)(b.y-a.y))t.
		t = (d.x-c.x)(a.y-c.y)-(d.y-c.y)(a.x-c.x)/((d.y-c.y)(b.x-a.x)-(d.x-c.x)(b.y-a.y)).
	*/
	const top = (d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x); 
	const bottom = ((d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y));
	const t = top/bottom;
	if(t<=1 && t>=0)
		return {x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),t}
	return false;
}

class consolE{
	wannaStop = false;
	dt = null;prevtime = Date.now();
	canvasSetting = {
		width:100,height:100,
		backgroundColor:'white'
	}
	maxDelta = 0.06; 
	object = {};
	assets = {
		img:{},//filled with {object}.
		audio:{}
	};
	viewport = {x:0,y:0};
	touches = {};
	constructor(config){
		Object.assign(this,config);
	}
	//core
	preload(afterLoad){
		this.load(this.toLoad||[],afterLoad);
	}
	start(){
		this.preload(
			()=>{
				console.log(this);
				this.setupKeys();
				this.setCanvas();
				this.init();
				this.process();
			}
		);
	}
	init(){
		//give core css style to the game.
		document.head.appendChild(this.makeElement({el:'link',props:{href:'/styles?fn=console.style',rel:'stylesheet'}}));
		//
		this.object.forEach((obj)=>{
			if(obj.init){
				if(!obj.engine)obj.engine = this;
				obj.init();
			}
		})
		find('content').show('block');
		setTimeout(()=>{find('#loading').remove()},1000);
	}
	update(){
		this.object.forEach((obj)=>{
			if(obj.update && !obj.delete){
				if(!obj.engine)obj.engine = this;
				obj.update();
			}
		})
	}
	draw(){
		this.cls(this.canvasSetting.backgroundColor);
		this.object.forEach((obj)=>{
			if(obj.draw && !obj.delete){
				if(!obj.engine)obj.engine = this;
				obj.draw();
			}
		})
	}
	cls(color){
		if(this.g.reset)this.g.reset();
		else{
			this.g.resetTransform();
			this.g.clearRect(0,0,this.canvas.width,this.canvas.height);
		}
		//translate methode use normal coordinat.
		this.g.translate(this.viewport.x,-this.viewport.y);
	}
	process = () =>{
		this.getDelta();
		this.update();
		if(this.dt<this.maxDelta)this.draw();
		if(this.keys.Escape){this.stop()}
		if(!this.wannaStop)requestAnimationFrame(this.process);	
	}
	stop(){
		this.wannaStop = true;
		this.stopAudios();
	}
	stopAudios(){
		for(let i of this.audios){
			i.stop();
		}
	}
	run(){
		this.init();
	}
	//end
	//additional
	setupKeys(){
		this.keys = {};
		//creating the events.
		document.onkeydown = (e)=>{
			this.keys[e.key] = true;
		}
		document.onkeyup = (e)=>{
			delete this.keys[e.key];
		}
		document.onmousedown = (e)=>{
			this.mouseDown = true;
			this.mouse = e;
		}
		document.onmouseup = (e)=>{
			this.mouseDown = false;
			this.mouse = null;
		}
		document.ontouchstart = (e)=>{
			this.touches = e.touches;
			this.touchDown = true;
		}
		document.ontouchend = (e)=>{
			this.touches = e.touches;
			this.touchDown = false;
		}
		document.ontouchmove = (e)=>{
			this.touches = e.touches;
			this.isMouse = false;
		}
		document.onmousemove = (e)=>{
			this.mouse = e;
			this.isMouse = true;
		}
		screen.orientation.onchange = (e)=>{
			this.deviceAngle = e.target.angle;
		}
	}
	click;
	getDelta(){
		const time = Date.now();
		this.dt = (time-this.prevtime)/1000;
		this.prevtime = time;
	}
	Object(id,config){
		this.object[id] = Object.assign({
			x:0,y:0,width:10,height:10,delete:false,
			init(){},update(){},draw(){},id,pendingitems:{},
			clicked(otObject){
				if(this.engine.mouseDown || this.engine.touches.length>0){
					const mouse = this.engine.mouse||{x:this.engine.touches[0].pageX,y:this.engine.touches[this.engine.touches.length-1].pageY};
					let npos;
					if(otObject){
						if(!otObject.width && otObject.w)otObject.width = otObject.w;
						if(!otObject.height && otObject.h)otObject.height = otObject.h;
						npos = this.normalizePos2Canvas(otObject);
						if(
							(npos.x-otObject.width/2)<mouse.x&&
							(npos.x+otObject.width/2)>mouse.x&&
							(npos.y-otObject.height/2)<mouse.y&&
							(npos.y+otObject.height/2)>mouse.y)return true;
					}else{
						npos = this.normalizePos2Canvas({x:this.x,y:this.y});
						if(
							(npos.x-this.width/2)<mouse.x&&
							(npos.x+this.width/2)>mouse.x&&
							(npos.y-this.height/2)<mouse.y&&
							(npos.y+this.height/2)>mouse.y)return true;	
					}
					
				}
				return false;
			},
			rotate(){
				this.engine.g.translate(this.x,this.y);
				this.engine.g.rotate(this.rotation*Math.PI/180);
			},rotation:0,
			normalizePos2Canvas(pos){
				return {x:pos.x+this.engine.canvas.offsetLeft,y:pos.y+this.engine.canvas.offsetTop}
			},
			getPos(){
				return {x:this.x,y:this.y};
			},
			drawPolly(){
				let pointA,pointB;
				for(let i=0;i<this.polly.length;i++){
					pointA = this.polly[i];
					if(i<this.polly.length-1){
						pointB = this.polly[i+1];
					}else pointB = this.polly[0];
					this.engine.g.line(pointA.x,pointA.y,pointB.x,pointB.y,'red',2);
				}
			},
			pending(id,Uptime,callback){
				if(this.pendingitems[id]){
					this.pendingitems[id].time++;
					if(this.pendingitems[id].time>=this.pendingitems[id].Uptime){
						this.pendingitems[id].callback();
						this.pendingitems[id].time = 0;
					}
				}else{
					this.pendingitems[id] = {
						time:0,
						Uptime,
						callback
					}
					this.pendingitems[id].time++;
				}
			},
			lookAt(obj,additionalAngle=0){
				this.rotation = Math.atan2(obj.y-this.y,obj.x-this.x)*180/Math.PI+additionalAngle;
			},
			setRotation(vector1,vector2){
				const newVector = {
					x:vector2.x-vector1.x,
					y:-(vector2.y-vector1.y)
				};
				const theta = Math.atan(newVector.y/newVector.x)*360/Math.PI;
				if(!isNaN(theta))this.rotation = theta;
			}
		},config);
	}
	load(config,afterLoad){
		//config [{}].
		let i = 0;
		const loader = (i)=>{
			const el = this.makeElement({el:config[i].type});
			Object.assign(el,config[i]);
			el[(config[i].type==='img')?'onload':'onloadeddata'] = ()=>{
				this.assets[config[i].type][config[i].id] = el;
				i++;
				if(i<config.length)loader(i);
				else if(afterLoad)afterLoad();
			}
		}
		if(i<config.length)loader(i);
		else if(afterLoad)afterLoad();
	}
	makeElement(config){
		return Object.assign(document.createElement(config.el),config.props);
	}
	setCanvas(){
		this.canvas = this.makeElement({
			el:'canvas',props:this.canvasSetting     
		});
		this.g = this.canvas.getContext('2d');
		Object.assign(this.g,this.console.g);
		document.querySelector('content').appendChild(this.canvas);
		//define this.center.
		this.center = {x:this.canvas.width/2,y:this.canvas.height/2};
	}
	console = {
		g:{
			rect(x,y,w,h,color='white'){
				this.fillStyle = color;
				this.fillRect(x-w/2,y-h/2,w,h);
			},
			circle(x,y,r,color){
				if(r<0)return;
				this.beginPath();
				this.fillStyle = color;
				this.arc(x,y,r,0,Math.PI*2);
				this.fill();
			},
			line(x,y,x1,y2,color='black',width='5',lineCap='round'){
				this.beginPath();
				this.strokeStyle = color;
				this.lineWidth = width;
				this.lineCap = lineCap;
				this.moveTo(x,y);
				this.lineTo(x1,y2);
				this.stroke();
			},
			putImage(src,x,y,width,height){
				this.drawImage(src,x-width/2,y-height/2,width,height);
			},
			rotateObject(obj,rotation){
				this.translate(obj.x,obj.y);
				this.rotate(rotation);
			},
			text(text,x,y,optional){
				Object.assign(this,optional);
				this.fillText(text,x,y);
				//else this.strokeText(text,x,y);
			},
			box(x,y,w,h){
				
			},
			imageSmoothingEnabled:true
		}
	}
	animation(config={}){
		//try to make this to become more usefull.
		return Object.assign({
			state:null,
			parent:'',
			x:0,y:0,rotation:0,
			playing:false,
			play(string){
				if(this.animations[string]){
					this.state = string;
					this.playing = true;
				}else this.playing = false;
			},
			stop(){
				this.playing = false;
			},
			reset(animationName=undefined){
				this.animations[animationName||this.state].frameIndex = 0;
			},
			animations:{},
			newAnimation(config={}){
				this.animations[config.id] = Object.assign({
					parent:this,
					g:CONSOLE.g,
					loop:false,
					frames:[],
					spritesheets:{
						src:null,
						len:null,
						width:null,
						height:null,
					},
					scaleX:1,
					scaleY:1,
					frameIndex:0,
					show(){
						//apply rotation.
						this.g.save();
						this.g.translate(this.parent.x,this.parent.y);
						this.g.rotate(this.parent.rotation*Math.PI/180);
						
						//handling spritesheets first.
						if(this.frames.length===0){
							if(this.frameIndex>=this.spritesheets.len){
								if(this.spritesheets.loop)this.frameIndex = 0;
								else this.frameIndex = this.spritesheets.len-1;
							}
							const cropY = 0;
							const cropW = this.spritesheets.width/this.spritesheets.len;
							const cropX = this.frameIndex*cropW;
							const cropH = this.spritesheets.height;
							const wSize = cropW*this.scaleX;
							const hSize = cropH*this.scaleY;
							this.g.drawImage(
								this.spritesheets.src,//src
								cropX,//crop x pos.
								cropY,//crop y pos.
								cropW,//crop w size.
								cropH,//crop h size.
								0-wSize/2,//x position.
								0-hSize/2,//y position.
								wSize,//w size.
								hSize//h size
								);
						}else{
							if(!this.frames[this.frameIndex]){
								if(!this.loop){
									this.parent.playing = false;
									this.frameIndex = this.frames.length-1;
								}else this.frameIndex = 0;
							};
							this.g.putImage(this.frames[this.frameIndex],0,0,this.frames[this.frameIndex].width*this.scaleX,this.frames[this.frameIndex].height*this.scaleY);
						}
						this.g.restore();
					}
				},config);
				if(!this.state)this.state = config.id;
			},
			tick(){
				this.x = CONSOLE.object[this.parent].x;
				this.y = CONSOLE.object[this.parent].y;
				this.rotation = CONSOLE.object[this.parent].rotation;
				if(this.playing){
					this.animations[this.state].frameIndex++;
				}
				this.animations[this.state].show();
			}
		},config);
	}
	audio(config){
		const audio = {
			config,stoped:true,useIntrval:false,engine:this,
			ready:false,
			loadedLen:0,
			loadedListener(){
				this.loadedLen += 1;
				if(this.loadedLen === 2){
					this.ready = true;
				}
			},
			init(){
				this.one = new Audio();
				this.one.src = this.config.src;
				this.one.onloadeddata = ()=>{
					this.loadedListener();
				}
				Object.assign(this.one,this.config);
				if(config.autoplay)this.one.autoplay = true;
				this.two = new Audio();
				this.two.onloadeddata = ()=>{
					this.loadedListener();
				}
				Object.assign(this.two,this.config);
				this.playAble = 'one';
				return this;
			},
			play(){
				if(!this.ready){
					console.log('Sound not ready yet!');
					return;
				}
				if(!this.stoped)this.stop();
				const cAudio = this[this.playAble];
				cAudio.play();
				this.stoped = false;
				cAudio.onfinish = ()=>{
					if(!this.config.loop)this.stopped = true;
					else cAudio.play();
				}
				if(this.useInterval)this.intervalUpdate();
			},
			update(){
				if(this.stoped)return
				if(!this.useInterval)this.checkAudio();
			},
			checkAudio(){
				if(this.cTime!=this[this.playAble].currentTime){
					this.cTime = this[this.playAble].currentTime;
					if(this.cTime >= (this.config.limit||this[this.playAble].duration)){
						this[this.playAble].volume = 0.5;
						this.playAble = this.playAble==='one'?'two':'one';
						this[this.playAble].play();
						this[this.playAble].volume = this.volume||1;
						console.log('checkaudioiscalled');
					}
				}
			},
			pause(){
				this[this.playAble].pause();
				this.stoped = true;
			},
			stop(){
				this[this.playAble].pause();
				this[this.playAble].currentTime = 0;
				this.stoped = true;
			},
			intervalUpdate(){
				this.interval = setInterval(()=>{
					if(this.stoped)clearInterval(this.interval);
					else this.checkAudio();
				},this.config.limit||this.one.duration-1);
			}
		}.init();
		this.audios.push(audio);
		return audio;
	}
	audios = [];
	getMouseCanvasOrigin(){
		return {
			x:this.mouse.x-this.canvas.offsetLeft,
			y:this.mouse.y-this.canvas.offsetTop
		}
	}
	getTouchCanvasOrigin(){
		if(this.touches.length<0)return vector2(this.canvas.width/2,this.canvas.height/2);
		return vector2(this.touches[0].pageX-this.canvas.offsetLeft,this.touches[0].pageY-this.canvas.offsetTop);
	}
	rectanglePolly(xpos,ypos,w,h,rotation){
		rotation *= -1;
		const points = [];
		const radius = Math.hypot(w,h)/2;
		const alpha = Math.atan2(w,h);
		points.push({
			x:xpos-Math.sin(rotation-alpha)*radius,
			y:ypos-Math.cos(rotation-alpha)*radius
		});
		points.push({
			x:xpos-Math.sin(rotation+alpha)*radius,
			y:ypos-Math.cos(rotation+alpha)*radius
		});
		points.push({
			x:xpos-Math.sin(Math.PI+rotation-alpha)*radius,
			y:ypos-Math.cos(Math.PI+rotation-alpha)*radius
		});
		points.push({
			x:xpos-Math.sin(Math.PI+rotation+alpha)*radius,
			y:ypos-Math.cos(Math.PI+rotation+alpha)*radius
		});
		return points;
	}
	particles(optional={}){
		return Object.assign({
			x:0,y:0,engine:null,parent:null,
			shapes:[],len:1,lifeTime:15,speed:12,initLifeTime:15,
			width:5,height:5,color:'gray',acceL:1,
			beforeShape(){},afterShape(){},shapeOption:{},
			init(){
				this.beforeShape();
				forIn(this.len,()=>{
					this.shapes.push(this.makeShape());
				});
				this.afterShape();
				this.shapes.forEach(shape=>{
					if(shape.init)shape.init();
				})
			},
			update(){
				this.shapes.forEach(shape=>{
					shape.update();
				})
			},
			draw(){
				this.shapes.forEach(shape=>{
					shape.draw();
				})
			},
			makeShape(){
				return Object.assign({
					parent:this.parent,
					x:this.x,initX:this.x,initY:this.y,y:this.y,engine:this.engine,speed:this.speed,
					w:this.width,h:this.height,color:this.color,dW:this.width,dH:this.height,
					velocity:{x:0,y:0},acceL:this.acceL,lifeTime:this.lifeTime,initLifeTime:this.initLifeTime,
					update(){
						this.move();
						if(this.lifeTime<=0){
							this.y = this.engine.object[this.parent].y;
							this.x = this.engine.object[this.parent].x;
							this.velocity = vector2();
							this.lifeTime = this.initLifeTime;
							this.w = this.dW;
							this.h = this.dH;
						}
						this.w += .4;
						this.h += .4;
						this.lifeTime--;
					},
					draw(){
						this.engine.g.rect(this.x,this.y,this.w,this.h,this.color);
					},
					move(){
						this.velocity.x += this.acceL;
						this.velocity.y += this.acceL;
						this.x -= Math.sin(getRad(this.engine.object[this.parent].rotation))*this.velocity.x*this.engine.dt*this.speed;
						this.y += Math.cos(getRad(this.engine.object[this.parent].rotation))*this.velocity.y*this.engine.dt*this.speed;
					}
				},this.shapeOption);
			}
		},optional);
	}
	isInView(vectorPosition){
		if(
			vectorPosition.x>=this.viewport.x && vectorPosition.x<=-(this.viewport.x)+this.canvas.width&&
			vectorPosition.y>=this.viewport.y && vectorPosition.y<=-(this.viewport.y)+this.canvas.height
		)return true;
		return false;
	}
}


