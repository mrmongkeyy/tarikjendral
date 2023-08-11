CONSOLE.Object('ground',{
	init(){
		this.grass = {
			g:this.engine.g,
			w:this.engine.canvasSetting.width,
			h:this.engine.canvasSetting.height,
			x:this.engine.canvasSetting.width/2,
			y:this.engine.canvasSetting.height/2,
			color:'#fcff95',
			draw(){
				this.g.rect(this.x,this.y,this.w,this.h,this.color);
			}
		}
		this.land = {
			g:this.engine.g,
			w:this.engine.canvasSetting.width*1/3,
			h:this.engine.canvasSetting.height,
			x:this.engine.canvasSetting.width/2,
			y:this.engine.canvasSetting.height/2,
			color:'whitesmoke',
			draw(){
				this.g.rect(this.x,this.y,this.w+2,this.h,'black');
				this.g.rect(this.x,this.y,this.w,this.h,this.color);
			}
		}
		this.randomTree = {
			tree:[],
			engine:this.engine,
			g:this.engine.g,
			init(){
				for(let i=0;i<40;i++){
					this.tree.push({
						x:Math.random()*this.engine.canvasSetting.width,
						y:Math.random()*this.engine.canvasSetting.height,
						r:Math.random()*50,
						color:'green'
					})
				}
			},
			draw(){
				this.tree.forEach(tree=>{
					this.g.circle(tree.x,tree.y,tree.r,tree.color);
				})
			}
		}
		this.randomTree.init();
	},
	peoplesLen:25,
	drawPeopleSide(){
		forIn(this.peoplesLen,(i)=>{
			let end = this.engine.canvasSetting.height-15;
			let x = this.engine.canvasSetting.width/2-(this.land.w/2+20);
			let y = end-this.engine.canvasSetting.height*i/this.peoplesLen;
			
			this.engine.g.rect(x,y,20,20,'#000000c2');
			this.engine.g.rect(x,y,15,15,'#ffe582');
			this.engine.g.circle(x-2,y,7,'#dfa943');
			this.engine.g.circle(x-5,y,7,'black');
		})
		forIn(this.peoplesLen,(i)=>{
			let end = this.engine.canvasSetting.height-15;
			let x = this.engine.canvasSetting.width/2+(this.land.w/2+20);
			let y = end-this.engine.canvasSetting.height*i/this.peoplesLen;
			
			this.engine.g.rect(x,y,20,20,'#000000c2');
			this.engine.g.rect(x,y,15,15,'#ffe582');
			this.engine.g.circle(x+2,y,7,'#dfa943');
			this.engine.g.circle(x+5,y,7,'black');
		})
	},
	palmLen:6,
	drawPalmTree(){
		forIn(this.palmLen,(i)=>{
			let end = this.engine.canvasSetting.height-15;
			let x = this.engine.canvasSetting.width/2-(this.land.w/2+20);
			let y = end-this.engine.canvasSetting.height*i/this.palmLen;
			this.engine.g.putImage(this.engine.assets.img.palmTree,
				x,y,100,100
			)
		})
		forIn(this.palmLen,(i)=>{
			let end = this.engine.canvasSetting.height-15;
			let x = this.engine.canvasSetting.width/2+(this.land.w/2+20);
			let y = end-this.engine.canvasSetting.height*i/this.palmLen;
			this.engine.g.putImage(this.engine.assets.img.palmTree,
				x,y,100,100
			)
		})
	},
	draw(){
		this.grass.draw();
		//this.randomTree.draw();
		this.land.draw();
		//drawing the flag.
		this.engine.g.rect(this.engine.canvasSetting.width/2,this.engine.canvasSetting.height*2/7,this.land.w,2,'black');
		this.engine.g.rect(this.engine.canvasSetting.width/2,this.engine.canvasSetting.height*5/7,this.land.w,2,'black');
		this.engine.g.putImage(this.engine.assets.img.independentPng,this.engine.canvasSetting.width/2,this.engine.canvasSetting.height/2,this.land.w,this.land.w)
		this.drawPeopleSide();
		this.drawPalmTree();
	}
})