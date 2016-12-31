// Question class
class TriviaQuestion {
	constructor(data) {
		console.log("Here now and received data - " + data);
		this.question = data.question;
		this.correctAnswer = data.correct_answer;
		this.incorrectAnswers = data.incorrect_answers;
	}

	validate() {

		return (userChoice == this.rightAnswer);
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
		// timer.stopCountdown(); /////////// Don't know if this can access timer object created in displayQuestion function of game object.
	}
	
}

let countdownInterval;
// Timer class
class Timer {

	constructor(time){
		this.time = time;
	}

	startCountdown() {
		this.countdownInterval = setInterval(decrementTimer,1000);
	}

	decrementTimer() {
		time--;
		$("#timeLeft").html = time;
	}

	stopCountdown() {
		clearInterval(this.countdownInterval);
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
	arrayOfUsedIndices : [],

	getQuestions : function getQuestions()  {
		var queryURL = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

		return $.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(data){
			this.questionsAndAnswersArray = data.results;
			console.log("Array of questions - " + this.questionsAndAnswersArray[4].question);
			console.log("Array of questions - " + this.questionsAndAnswersArray);
		});
	},

	displayQuestion : function displayQuestion() {
		if(this.questionCount == 10) {
			this.endGame();
		}
		else{
			var randomQuestionIndex = Math.floor(Math.random()*10);
			console.log("Random index - " + randomQuestionIndex);
			while(this.arrayOfUsedIndices.indexOf(randomQuestionIndex) != -1) {
				randomQuestionIndex = Math.floor(Math.random()*10);
				console.log("Duplicate hence random index - " + randomQuestionIndex);
			}
			this.arrayOfUsedIndices.push(randomQuestionIndex);
			console.log("Used indices array - " + this.arrayOfUsedIndices);
			console.log("question array - " + this.questionsAndAnswersArray);
			console.log("current question json - " + this.questionsAndAnswersArray[randomQuestionIndex]);
			console.log("current question - " + this.questionsAndAnswersArray[randomQuestionIndex].question);

			var currentQuestion = new TriviaQuestion(this.questionsAndAnswersArray[randomQuestionIndex]);
			console.log("created currentQuestion - " + this.currentQuestion);

			$("#triviaQuestion").html(currentQuestion.question);

			// creating new Timer object and starting countdown
			var timer = new Timer(15);
			timer.startCountdown();
			this.questionCount ++;
			console.log("Questions over - " + this.questionCount);
		}
	},

	// getGiphyImage : function getGiphyImage(questionObject) {
	// 	var giphyImage = 0;// get image from giphy site using ajax
	// 	// get a word from questionObject
	// 	// use ajax call to query word and get image
	// 	//???????document.getElementByClassName("image").html("<img src='" + giphyImage + "'>"); ////// Not sure if this is done here or game.displayResult function
	// },

	displayResult : function displayResult(result) {
		$(".displayResult").show();

		result ? $("#message").html("You are Correct!!!") : $("#message").html("Wrong Answer!");     
		 
		$("#rightAnswer").html(currentQuestion.correctAnswer);
	 	//??????? $("#image").html(giphyImage);//image received by querying giphy db
	    // $(".image").html("<img src='" + giphyImage + "'>"); //////???????
	    setTimeOut($(".displayResult").hide(),4500);
	    this.displayQuestion();
	},

	endGame : function endGame() {
		$("#correctAnswers").html = this.rightAnswers;
		$("#wrongAnswers").html = this.wrongAnswers;
		$("#unanswered").html = this.unanswered;
		$(".displayStats").show();
	},

	restartGame : function restartGame() {
		this.questionArray = [];
		this.questionCount = 0;
		this.rightAnswers = 0;
		this.wrongAnswers = 0;
		this.unanswered = 0;
		this.game.displayQuestion();
		$(".displayStats").hide();
	}

};

// program begins
$(document).ready(function(event) { 
	ajaxCall();
	
  	$("#start").on("click",function(){
  		console.log("Start button clicked");
  		game.displayQuestion();
  	});

  	$(".choice").on("click", function(){
  		timer.stopCountdown(); /////////// Don't know how to access timer object, created in displayQuestion function, here.
  		var isRightChoice = currentQuestion.validate(choiceClickedByUser);
  		game.displayResult(isRightChoice);
  		game.getGiphyImage(currentQuestion.queryWord);
  	});

  	$("#restartTrivia").on("click", function(){
  		game.restartGame();
  	});

});

function ajaxCall() {
	$.when(game.getQuestions()).done(function(){
		console.log("Done");
	}).fail(function(){
		console.log("Couldn't fetch data.");
	});
}