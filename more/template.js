module.exports = {
	app(config){
		return `
			<html>
			<head>
				<title>TarikJendral!: Spesial Kemerdekaan!</title>
				<meta name=viewport content=width=device-width,initial-scale=1>
				<style>
					@font-face{
						font-family:'gumdrop',
						src:url('/file?fn=gm.otf');
					}
					body{
						background:#fcff95;
						font-family:math;
						overflow:hidden;
					}
					canvas{
						background:white;
					}
				</style>
			</head>
			<body>
				<content
				style="
					display:none;
					position:relative;
				"
				>
					
				</content>
				<div id=gameplayui>
					<div>
						<img src=/file?fn=pausebutton.png id=pausebutton
						style="
							width:24px;
							height:24px;
							margin-top:5px;
							cursor:pointer;
							padding:8px;
							background:white;
							border-radius:50%;
						"
						>
					</div>
				</div>
				<div id=mainmenu>
					<div id=whitebox
					>
						<div style=position:relative;>
							<img src=/file?fn=goodindependentlabel.png
							style="
								width:100%;
								height:100%;
								object-fit:cover;
							"
							>
							<div
							style="
								width:100%;
								height:100%;
								position:absolute;
								top:0;
								display:flex;
								justify-content:center;
								align-items:center;
								flex-direction:column;
								gap:64px;
							"
							>
								<div style="
									color:#d90001;
									font-size:32px;
									padding:10px;
									cursor:pointer;
									background:white;
								">
									"TARIK JENDRAL!"
								</div>
								<div style="
									background:#d90001;
									color:white;
									font-size:24px;
									padding:10px;
									border:2px solid white;
									border-radius:20px;
									cursor:pointer;
								"
								id=mulaibutton
								>
									MAIN
								</div>
								<div style=position:absolute;bottom:0;font-weight:bold;margin-bottom:10px;>
									&copy GEMA/MRMONGKEYY 2023.
								</div>
								<div style=position:absolute;top:0;left:0;font-weight:bold;margin:10px;>
									<img src=/file?fn=musicnote.png
									style="
										width:24px;
										height:24px;
										padding:8px;
										background:whitesmoke;
										border-radius:50%;
										cursor:pointer;
									" id=musictogle
									>
								</div>
							</div>
							
						</div>
					</div>
				</div>
				<div id=gamepause>
					<div id=whitebox
					>
						<div style=position:relative;>
							<img src=/file?fn=goodindependentlabel.png
							style="
								width:100%;
								height:100%;
								object-fit:cover;
							"
							>
							<div
							style="
								width:100%;
								height:100%;
								position:absolute;
								top:0;
								display:flex;
								justify-content:center;
								align-items:center;
								flex-direction:column;
							"
							>
								<div style="
									color:#d90001;
									font-size:32px;
									padding:10px;
									cursor:pointer;
									background:white;
									margin-bottom:64px;
								">
									"Ada Apa Jendral?"
								</div>
								<div style="
									background:#d90001;
									color:white;
									font-size:24px;
									padding:10px;
									border:2px solid white;
									border-radius:20px;
									cursor:pointer;
									margin-bottom:8px;
								"
								id=mulaibutton
								>
									MENU
								</div>
								<div style="
									background:#d90001;
									color:white;
									font-size:24px;
									padding:10px;
									border:2px solid white;
									border-radius:20px;
									cursor:pointer;
								"
								id=mulaibutton
								>
									LANJUTKAN
								</div>
								<div style=position:absolute;bottom:0;font-weight:bold;margin-bottom:10px;>
									&copy GEMA 2023.
								</div>
							</div>
							
						</div>
					</div>
				</div>
				<div id=gameend>
					<div id=whitebox
					>
						<div style=position:relative;>
							<img src=/file?fn=goodindependentlabel.png
							style="
								width:100%;
								height:100%;
								object-fit:cover;
							"
							>
							<div
							style="
								width:100%;
								height:100%;
								position:absolute;
								top:0;
								display:flex;
								justify-content:center;
								align-items:center;
								flex-direction:column;
								gap:64px;
							"
							>
								<div style="
									color:#d90001;
									font-size:32px;
									padding:10px;
									cursor:pointer;
									background:white;
								" id=gameendstate>
									"Tarikan Perjuangan"
								</div>
								<div style="
									background:#d90001;
									color:white;
									font-size:24px;
									padding:10px;
									border:2px solid white;
									border-radius:20px;
									cursor:pointer;
								"
								id=gameendbutton
								>
									MENU
								</div>
								<div style=position:absolute;bottom:0;font-weight:bold;margin-bottom:10px;>
									&copy GEMA/MRMONGKEYY 2023.
								</div>
							</div>
							
						</div>
					</div>
				</div>
				<div
				id=loading
				style="
					position:absolute;
					background:black;
					width:100%;
					height:100%;
					top:0;
					left:0;
					display:flex;
					align-items:center;
					justify-content:center;
					flex-direction:column;
					font-family:cursive;
					font-size:12px;
				"
				>
					<div
					style="
						display:flex;
						align-items:center;
						justify-content:center;
						flex-direction:column;
					"
					>
						<div
						style="color:white;font-weight:bold;
							width:100%;
							text-align:center;
						"
						>
							<span>InfinityDreams Studios Present</span>
						</div>
						<img src=/file?fn=loadingscreen.gif
						style="
							width:200px;
							height:200px;
							object-fit:cover;
							border-radius:30%;
							margin-top:5px;
							box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);
						"
						>
						<div
						style="color:white;font-weight:bold;
							margin-top:5px;
							width:100%;
							text-align:center;
						"
						>
							<span>Powered By BananaConsole 2023.</span>
						</div>
					</div>
				</div>
				<script src=/scripts?fn=infinity></script>
				<script src=/scripts?fn=console></script>
				<script src=/scripts?fn=runningman></script>
				<script src=/scripts?fn=ground></script>
				<script src=/scripts?fn=player></script>
				
				
				<script>CONSOLE.start()</script>
			</body>
		</html>
		`;
	}
}