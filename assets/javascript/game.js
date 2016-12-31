// Question class
class TriviaQuestion {
	constructor TriviaQuestion(question,rightAnswer,choices[]) {
		this.question = question;
		this.rightAnswer = rightAnswer;
		this.choices = choices;
	}

	function validate(userChoice) {
		var result = "";
		// if(userChoice === rightAnswer){
		// 	wins++;
		// 	result = "correct";
		// }

		// else{
		// 	losses++;
		// 	result = "wrong";
		// }
		game.displayResult(result);
		// timer.stopCountdown(); /////////// Don't know if this can access timer object created in beginGame function of game object.
	}

	funtion getGiphyImage(questionObject) {
		var giphyImage = // get image from giphy site using ajax
		// get a word from questionObject
		// use ajax call to query word and get image
		//???????document.getElementByClassName("image").innerHTML("<img src='" + giphyImage + "'>"); ////// Not sure if this is done here or game.displayResult function
	}
}

// Timer class
class Timer {
	constructor Timer(time){
		this.time = time;
	}

	function startCountdown {
		var countdownInterval = setInterval(decrementTimer,1000);
	}

	function decrementTimer {
		number--;
		document.getElementById("timeLeft").innerHTML = number;
	}

	function stopCountdown {
		clearInterval(countdownInterval);
	}
}

// Game object
var game {
	
	time: 15,
	questionCount: 0,
	rightAnswers: 0,
	wrongAnswers: 0,
	unanswered: 0,

	function beginGame {
		if(questionCount == 10) {
			game.endGame();
		}
		else{
			// get random question, right answer and array of choices
			var currentQuestion = new TriviaQuestion(// stuff gotten from trivia question api );
			// create an object of TriviaQuestion by passing the values obtained
			// call display question method

			// creating new Timer object and starting countdown
			var timer = new Timer(15);
			timer.startCountdown();
			questionCount ++;
		}
	},

	function displayResult(result) {
		switch(result) {
		    case "win":
		       document.getElementById("message").innerHTML("You are Correct!!");
		       break;
		    case "loss":
		       document.getElementById("message").innerHTML("Wrong Answer!");
		       break;
		    default:     
		}

		document.getElementById("rightAnswer").innerHTML(currentQuestion.rightAnswer);
	 	//??????? document.getElementById("image").innerHTML(giphyImage);//image received by querying giphy db
	    document.getElementByClassName("image").innerHTML("<img src='" + giphyImage + "'>"); //////???????
	},

	function endGame() {
		document.getElementById("correctAnswers").innerHTML = game.rightAnswers;
		document.getElementById("wrongAnswers").innerHTML = game.wrongAnswers;
		document.getElementById("unanswered").innerHTML = game.unanswered;
		document.getElementByClassName("displayStats")[0].attribute("display","block");
	},

	function restartGame {
		questionCount = 0,
		rightAnswers = 0,
		wrongAnswers = 0,
		unanswered = 0,
		game.beginGame();
	}

}

// program begins
document.addEventListener("DOMContentLoaded", function(event) { 

  	document.getElementById("start").on("click",function(){
  		game.beginGame();
  	});

  	document.getElementByQuery("choice").on("click", function(){
  		// currentQuestion.validate(choiceClickedByUser);
  		timer.stopCountdown(); /////////// Don't know how to access timer object, created in beginGame function, here.
  	});

  	document.getElementById("restartTrivia").on("click", function(){
  		game.restartGame();
  	});

});

