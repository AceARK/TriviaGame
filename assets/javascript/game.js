// Question class
class TriviaQuestion {
	constructor(data) {
		this.question = data.question;
		this.rightAnswer = data.correct_answer;
		this.choices = data.incorrect_answers;
	}

	validate() {}

		// return (userChoice === this.rightAnswer);
		//var result = "";
		// if(userChoice === rightAnswer){
		// 	wins++;
		// 	result = "correct";
		// }

		// else{
		// 	losses++;
		// 	result = "wrong";
		// }
		//game.displayResult(result);
		// timer.stopCountdown(); /////////// Don't know if this can access timer object created in beginGame function of game object.
	
	
}

// Timer class
class Timer {
	constructor(time){
		this.time = time;
	}

	startCountdown() {
		var countdownInterval = setInterval(decrementTimer,1000);
	}

	decrementTimer() {
		number--;
		$("#timeLeft").html = number;
	}

	stopCountdown() {
		clearInterval(countdownInterval);
	}
}

// Game object
var game = {
	
	time: 15,
	questionCount: 0,
	rightAnswers: 0,
	wrongAnswers: 0,
	unanswered: 0,
	questionsAndAnswersArray: [],

	getQuestions : function getQuestions()  {
		var queryURL = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

		return $.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(data){
			questionsAndAnswersArray = data.results;
			// console.log("Array of questions - " + questionsAndAnswersArray);
		});
	},

	beginGame : function beginGame() {
		if(questionCount == 10) {
			game.endGame();
		}
		else{
			var randomQuestionIndex = Math.floor(Math.random()*questionsAndAnswersArray.length);
			var currentQuestion = new TriviaQuestion(questionsAndAnswersArray);// stuff gotten from trivia question api );
			// create an object of TriviaQuestion by passing the values obtained
			// call display question method

			// creating new Timer object and starting countdown
			var timer = new Timer(15);
			timer.startCountdown();
			questionCount ++;
		}
	},

	getGiphyImage : function getGiphyImage(questionObject) {
		var giphyImage = 0;// get image from giphy site using ajax
		// get a word from questionObject
		// use ajax call to query word and get image
		//???????document.getElementByClassName("image").html("<img src='" + giphyImage + "'>"); ////// Not sure if this is done here or game.displayResult function
	},

	displayResult : function displayResult(result) {
		$(".displayResult").show();
		switch(result) {
		    case "win":
		       $("#message").html("You are Correct!!");
		       break;
		    case "loss":
		       $("#message").html("Wrong Answer!");
		       break;
		    default:     
		}

		$("#rightAnswer").html(currentQuestion.rightAnswer);
	 	//??????? $("#image").html(giphyImage);//image received by querying giphy db
	    $(".image").html("<img src='" + giphyImage + "'>"); //////???????
	    setTimeOut($(".displayResult").hide(),4500);
	},

	endGame : function endGame() {
		$("#correctAnswers").html = game.rightAnswers;
		$("#wrongAnswers").html = game.wrongAnswers;
		$("#unanswered").html = game.unanswered;
		$(".displayStats").show();
	},

	restartGame : function restartGame() {
		questionArray = [];
		questionCount = 0;
		rightAnswers = 0;
		wrongAnswers = 0;
		unanswered = 0;
		game.beginGame();
		$(".displayStats").hide();
	}

};

// program begins
$(document).ready(function(event) { 

  	$("#start").on("click",function(){
  		console.log("Start button clicked");
  		$.when(game.getQuestions()).done(function(){
  			console.log("ajax call ends");
  			game.beginGame();
  		}).fail(function(){
  			console.log("Couldn't fetch data.");
  		});
  	});

  	$(".choice").on("click", function(){
  		timer.stopCountdown(); /////////// Don't know how to access timer object, created in beginGame function, here.
  		// currentQuestion.validate(choiceClickedByUser);
  		game.getGiphyImage(currentQuestion.queryWord);
  	});

  	$("#restartTrivia").on("click", function(){
  		game.restartGame();
  	});

});

