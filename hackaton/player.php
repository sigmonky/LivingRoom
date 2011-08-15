
<html>
	<head>
	  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	  <script type="text/javascript" src="../talent/js/strophe.min.js"></script> 
	  <script type="text/javascript" src="../talent/js/strophe.pubsub.min.js"></script> 
	  <script type="text/javascript" src="../talent/js/shared.js"></script>
	  <script type="text/javascript" src="hackaton.js"></script>
  
  <script>
	var player;
	var step = 5;


	function mtvnPlayerLoaded( playerId ){
		player = document.getElementById(playerId);
		player.addEventListener('METADATA','onMetaData');
		player.addEventListener('READY','onReady');
		player.addEventListener('PLAYHEAD_UPDATE','onPlayheadUpdate');
	}

	function onPlayerLoaded(controller){
		player = controller.player;
		player.addEventListener('METADATA','onMetaData');
		player.addEventListener('READY','onReady');
	}

	function stepBack(){
		currentTime = player.getPlayheadTime();
		player.setPlayheadTime(currentTime - step);
	}
	
	function stepForward(){
		currentTime = player.getPlayheadTime();
		player.setPlayheadTime(currentTime + step);
	}

	
  </script>


		<style>			

			#video-player {
				width: 585px;
				height: 360px;
			}


		</style>
	</head>
	<body>

			<div id="video-player">
				<embed src="http://media.mtvnservices.com/mgid:cms:video:thedailyshow.com:394223" 
					type="application/x-shockwave-flash" 
					name="player1"
					id="player1"
					width="100%" 
					height="100%"
					flashVars="autoPlay=true"
					allowScriptAccess="always">
				</embed>
			</div><br/>
			<br/>
			<div id="connection_status">Connecting...</div><br/><br/>
			<div id="screenshot" style="display:none"><img src="http://www.logoslogic.com/chat/LivingRoom/hackaton/share.jpg" /></div><br/>
		  	<div id="share" style="font-size:1.2em"></div>
		
		</body>
		</html>
