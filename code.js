var score, portalMode, highScore;

getKeyValue("high_score", function(savedHighScore) {
  if (savedHighScore != undefined) {
    highScore = savedHighScore;
    setText("highScoreIntroText", "High Score: " + highScore);
  }
});

var clickSoundLocation = "assets/category_alerts/vibrant_game_carton_start_game_2_long.mp3";
var moveSoundLocation = "assets/category_pop/deep_bubble_notification.mp3";

var lowScoreQuotes = ["Better luck next time!",
                      "You can make it!"];
var mediumScoreQuotes = ["You have potential!",
                         "You're getting there!"];
var highScoreQuotes = ["You did great!",
                       "That was amazing!"];

//Plays audio to listen to while the player reads information about the game. 
playSound("assets/category_background/eerie_beginnings.mp3", true);

onEvent("startButton", "click", function() {
  stopSound();
  playSound(clickSoundLocation, false);
  portalMode = getChecked("portalModeCheckbox");
  startGame();
});

onEvent("playAgainButton", "click", function() {
  stopSound();
  playSound(clickSoundLocation, false);
  portalMode = getChecked("portalModeAgainCheckbox");
  startGame();
});

onEvent("resetHighScoreBtn", "click", function() {
	highScore = undefined;
	setKeyValue("high_score", highScore);
	setText("highScoreText", "High Score: 0");
});

onEvent("leftButton", "click", function() { moveShipLeft(); });

onEvent("rightButton", "click", function() { moveShipRight(); });

onEvent("fireButton", "click", function() { fireDot(); });

onEvent("playScreen", "keydown", function(event) {
  //console.log(JSON.stringify(event)); // <--- debug purposes
  if (event.key.toUpperCase() == "D" || event.key == "Right")
    moveShipRight();
  if (event.key.toUpperCase() == "A" || event.key == "Left")
    moveShipLeft();
  if (event.key == " " && !event.repeat)
    fireDot();
});

function startGame() {
  setPosition("squareImage", 120, 0);
  setPosition("shipImage", 120, 221);
  score = 0;
  setText("scoreCounter", "Score: " + score);
  setScreen("playScreen");
  moveSquare();
}

function endGame() {
  stopTimedLoop();
  playSound("assets/category_music/8bit_game_over_1.mp3", false);
  setChecked("portalModeAgainCheckbox", portalMode);
  if (highScore == undefined || score > highScore) {
    highScore = score;
    setKeyValue("high_score", highScore);
  }
  setText("highScoreText", "High Score: " + highScore);
  setText("resultsText", "Score: " + score);
  if (score >= 50)
    setText("endGameText", randomElementFrom(highScoreQuotes));
  else if (score >= 25)
    setText("endGameText", randomElementFrom(mediumScoreQuotes));
  else
    setText("endGameText", randomElementFrom(lowScoreQuotes));
  setScreen("endScreen");
}

function moveShipLeft() {
  playSound(moveSoundLocation, false);
  changeXPosition("shipImage", -15);
	if (getXPosition("shipImage") <= -15) {
   if (portalMode)
     setXPosition("shipImage", 255);
   else
     setXPosition("shipImage", -15);
	}
}

function moveShipRight() {
  playSound(moveSoundLocation, false);
  changeXPosition("shipImage", 15);
  if (getXPosition("shipImage") >= 255) {
    if (portalMode) {
      setXPosition("shipImage", -15);
    } else {
      setXPosition("shipImage", 255);
    }
  }
}

var fireDotLoop;
function fireDot() {
  if (fireDotLoop != undefined)
    stopTimedLoop(fireDotLoop);
  
  setPosition("dotImage", getXPosition("shipImage") + 30, getYPosition("shipImage") + 7);
  playSound("assets/category_projectile/game_ball_bounce.mp3", false);
  showElement("dotImage");
  fireDotLoop = timedLoop(5, function() {
    changeYPosition("dotImage", -10);
    var dotHitSquare = getYPosition("dotImage") <= getYPosition("squareImage") &&
    getXPosition("dotImage") >= getXPosition("squareImage") - 11 &&
    getXPosition("dotImage") <= getXPosition("squareImage") + 50;
    
    if (dotHitSquare) {
      hideElement("dotImage");
      stopTimedLoop();
      score++;
      setText("scoreCounter", "Score: " + score);
      moveSquare();
    } else if (getYPosition("dotImage") <= 0) { //if dot goes above the app window
      hideElement("dotImage");
      stopTimedLoop(fireDotLoop);
    }
  });
}

var moveSquareLoop;
function moveSquare() {
  switch (randomNumber(1, 2)) {
    case 1:
      if (getXPosition("squareImage") + 55 > 250)
        setPosition("squareImage", randomNumber(28, getXPosition("squareImage") - 55), 0);
      else
        setPosition("squareImage", randomNumber(getXPosition("squareImage") + 55, 250), 0);
      break;
    case 2:
      if (getXPosition("squareImage") - 55 < 28)
        setPosition("squareImage", randomNumber(getXPosition("squareImage") + 55, 250), 0);
      else
        setPosition("squareImage", randomNumber(28, getXPosition("squareImage") - 55), 0);
      break;
  }
  
  /* Same as:
  var squareSpeed = 1200 - 20*score;
  if (squareSpeed < 200) squareSpeed = 200;
  */
  var squareSpeed = (1200 - 20*score < 200) ? 200 : 1200 - 20*score;
  moveSquareLoop = timedLoop(squareSpeed, function() {
    changeYPosition("squareImage", 10);
    if (getYPosition("squareImage") >= 160)
      endGame();
  });
}

function randomElementFrom(list) {
  return list[randomNumber(0, list.length - 1)];
}

function setXPosition(object, xPosition) {
  setProperty(object, "x", xPosition);
}

function changeXPosition(object, xPositionChange) {
  setProperty(object, "x", getXPosition(object) + xPositionChange);
}

function setYPosition(object, yPosition) {
  setProperty(object, "y", yPosition);
}

function changeYPosition(object, yPositionChange) {
  setProperty(object, "y", getYPosition(object) + yPositionChange);
}
