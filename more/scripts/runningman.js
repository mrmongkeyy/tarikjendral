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
	debug:true,
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
//setup "INFO" button.
find('#infobutton').onclick = function(){
	find('#infomenu').show('flex');
}
//setup "CLOSEINFOBUTTON" button.
find('#closeinfopage').onclick = function(){
	find('#infomenu').hide();
}
//setup "sendmewa" button.
find('#sendmewa').onclick = function(){
	open('https://api.whatsapp.com/send?phone=+62895605801484&text=Halo bang!','_blank');
}
//setup "helpme" button.
find('#helpme').onclick = function(){
	open('https://saweria.co/gemasajaa','blank');
}