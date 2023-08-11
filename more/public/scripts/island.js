CONSOLE.Object('island',{
	size:{
		x:400,
		y:500
	},grass:[],
	init(){
		this.g = this.engine.g;
		this.x = this.engine.canvasSetting.width/2;
		this.y = this.engine.canvasSetting.height/2;
		this.initGrass(20);
	},
	initGrass(len){
		for(let i=0;i<len;i++){
			this.grass.push({
				radius:Math.random()*50,
				x:Math.floor(Math.random()*this.engine.canvasSetting.width),
				y:Math.floor(Math.random()*this.engine.canvasSetting.height)
			})
		}
	},
	grassDrawing(){
		this.grass.forEach(grass=>{
			this.g.circle(grass.x,grass.y,grass.radius+2,'darkgreen');
			this.g.circle(grass.x,grass.y,grass.radius,'green');
		})
	},
	draw(){
		this.g.rect(this.x,this.y,405,505,'#917c2a');
		this.grassDrawing();
		this.g.rect(this.x,this.y,this.size.x,this.size.y,'#ffdb4d');
	}
});