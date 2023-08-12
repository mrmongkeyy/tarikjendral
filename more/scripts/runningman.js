const canvasSetting = {
	width:innerWidth/2,
	height:innerHeight
};

//for mobile handling.
if(innerWidth<=720){
	Object.assign(canvasSetting,{
		width:innerWidth
	})
}

const config = {
	canvasSetting,
	toLoad:[
		{
			id:'proclamationSound',
			type:'audio',
			src:'./more/media/proclamationsound.mp3'
		},
		{
			id:'pullicon',
			type:'img',
			src:'./more/media/pull.png'
		},
		{
			id:'independentPng',
			type:'img',
			src:'./more/media/goodindependentlabel.png'
		},
		{
			id:'palmTree',
			type:'img',
			src:'./more/media/palmtree.png'
		},
		{
			id:'medal',
			type:'img',
			src:'./more/media/medal.png'
		},
		{
			id:'merdeka',
			type:'audio',
			src:'./more/media/merdeka.wav'
		},
		{
			id:'lose',
			type:'audio',
			src:'./more/media/losepeople.wav'
		},
		{
			id:'win',
			type:'audio',
			src:'./more/media/winapplouse.wav'
		},
		{
			id:'crowd',
			type:'audio',
			src:'./more/media/crowdmale.wav',
			loop:true
		},
		{
			id:'bgmusic',
			type:'audio',
			src:'./more/media/bgmusic.wav',
			loop:true
		},
		{
			id:'countdown',
			type:'audio',
			src:'./more/media/321go.mp3'
		}
	]
}

//simple handling.
if(innerWidth<900){
	config.canvasSetting.width = innerWidth;
	config.canvasSetting.height = innerHeight;
}


const forceWinner = function(winner){
	find('body').addChild(makeElement('div',{
		style:`
			position:absolute;
			width:100%;
			height:100%;
			top:0;
			left:0;
			display:flex;
			align-items:center;
			justify-content:center;
		`,
		innerHTML:`
			<div
			style="
				display:flex;
				flex-direction:column;
				align-items:center;
				justify-content:center;
				padding:0 10%;
				height:50%;
				border-radius:30px;
				background:#ffffffe0;
				box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);
				font-family:cursive;
			"
			>
				<div>
					<img src=./more/media/bluemonster.png
					style="
						width:150px;
						height:150px;
						object-fit:cover;
						border-radius:50%;
						background:white;
						padding:2px;
						box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);
					"
					>
				</div>
				<div
				style="
					font-size:32px;
				"
				>
					<span>${winner} win!</span>
				</div>
				<div
				style="
					margin-top:20px;
					font-size:24px;
				"
				>
					<span
					style="
						padding:10px;
						border-radius:15px;
						background:#00bcd4;
						color:white;
						cursor:pointer;
						box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);	
					"
					id=againplay
					>Main Lagi</span>
				</div>
			</div>
		`,
		onadded(){
			this.find('#againplay').onclick = ()=>{location.reload()};
		}
	}))
}





const CONSOLE = new consolE(config);

//setup "MULAI" button.
find('#mulaibutton').onclick = function(){
	CONSOLE.object.playermechanism.start();
	find('#mainmenu').hide();
}
//setup "MENU" button.
find('#gameendbutton').onclick = function(){
	location.reload();
}
//setup "PAUSE" button.
find('#pausebutton').onclick = function(){
	location.reload();
}
//setup "MUSIC" button.
find('#musictogle').onclick = function(){
	CONSOLE.object.playermechanism.playProclamationSound(this);
}