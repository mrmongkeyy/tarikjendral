CONSOLE.Object('obstacle',{
	obs:[],
	init(){
		console.log('Obstacle is ready...');
		//generate obs.
		this.generateObstacle();
		console.log(this);
	},
	handlingObstacle(){
		this.time++;
		if(this.time >= this.timePush){
			this.pushNewObs();
		}
	},
	kickMe(){
		//this.obs.shift();
	},
	pushNewObs(){
		const obs = {
			width:5,height:null,color:'red',
			speed:3,movespeed:.05,parent:this,
			init(engine){
				this.engine = engine;
				this.height = this.getRandomHeight();
				this.y = this.engine.canvasSetting.height*3/8-this.height/2;
				this.x = this.getXValue();
				
				console.log(this);
			},
			getXValue(){
				return this.engine.canvasSetting.width+(this.engine.canvasSetting.width*[.1,.2,.3,.4,.5,.6,.7,.8,.9].getRandom())+500;
			},
			getRandomHeight(){
				return [10,15,20,25,30].getRandom();
			},
			move(){
				this.x -= this.speed;
				if(this.x < -50)this.parent.kickMe();
			},
			update(){
				this.move();
			},
			draw(){
				if(this.x < this.engine.canvasSetting.width && this.x > 0)this.engine.g.rect(this.x,this.y,this.width,this.height,this.color);
			}
		}
		obs.init(this.engine);
		this.obs.push(obs);
		this.time = 0;
		this.timePush = this.getNewTimePush();
	},
	getNewTimePush(){
		return [20,30].getRandom();
	},
	update(){
		this.obs.forEach(obs=>{
			obs.update();
		})
		
		this.handlingObstacle();
	},
	draw(){
		this.obs.forEach(obs=>{
			obs.draw();
		})
	},
	generateObstacle(){
		this.pushNewObs();
	}
})