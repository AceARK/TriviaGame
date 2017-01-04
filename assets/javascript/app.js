// Question class
class TriviaQuestion {
	constructor(data) {
		console.log("Here now and received data - " + data);
		this.question = data.question;
		this.correctAnswer = data.correct_answer;
		this.incorrectAnswers = data.incorrect_answers;
	}

	validate() {

		// get value of input radio button clicked
		// compare value to this.correctAnswer
		// if same, return 

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

var countdownInterval;

// Game object
var game = {
	
	time: 15,
	questionCount: 0,
	rightAnswers: 0,
	wrongAnswers: 0,
	unanswered: 0,
	questionsAndAnswersArray: [],
	arrayOfUsedIndices: [],
	countDownStarted: false,
	countDownEnd: false,

	getQuestions : function getQuestions()  {
		var queryURL = "https://opentdb.com/api.php?amount=10&category=17&difficulty=medium&type=multiple";

		return $.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(data){
			game.questionsAndAnswersArray = data.results;
			console.log("Array of questions - " + game.questionsAndAnswersArray[4].question);
			console.log("Array of questions - " + game.questionsAndAnswersArray);
		});
	},

	displayQuestion : function displayQuestion() {
		$('.answerOptions').empty();
		if(game.questionCount == 10) {
			game.endGame();
		}
		else{
			var randomQuestionIndex = Math.floor(Math.random()*10);
			console.log("Random index - " + randomQuestionIndex);
			while(game.arrayOfUsedIndices.indexOf(randomQuestionIndex) != -1) {
				randomQuestionIndex = Math.floor(Math.random()*10);
				console.log("Duplicate hence random index - " + randomQuestionIndex);
			}
			game.arrayOfUsedIndices.push(randomQuestionIndex);
			console.log("Used indices array - " + game.arrayOfUsedIndices);
			console.log("question array - " + game.questionsAndAnswersArray);
			console.log("current question json - " + game.questionsAndAnswersArray[randomQuestionIndex]);
			console.log("current question - " + game.questionsAndAnswersArray[randomQuestionIndex].question);

			var currentQuestion = new TriviaQuestion(game.questionsAndAnswersArray[randomQuestionIndex]);
			console.log("created currentQuestion - " + currentQuestion);
			// console.log("currentQuestion - " + this.currentQuestion.question);
			// console.log("correct answer - " + this.currentQuestion.correctAnswer);
			// console.log("wrong answers - " + this.currentQuestion.incorrectAnswers);

			$("#triviaQuestion").html(currentQuestion.question);

			// get a random number from 0 to 3 for correct answer's index
			// loop through choiceArray and push choices
			// if iterator == correct answer index, push correct answer

			// to display choices ->
			// loop through choice array
			// create new div
			// if iterator == correct answer index, use data-answer="correct", else data-answer="wrong"

			var correctAnswerIndex = Math.floor(Math.random()*3);
			var choiceArray = [];
			console.log("incorrect answers " + currentQuestion.incorrectAnswers);
			var j=0;
			for(var i=0; i<4; i++) {
				var newChoice = $('<div>');
				newChoice.addClass("col-sm-6 options text-center");
				// var newChoice = $('<input>');
				// newChoice.attr({'type': 'radio', 'name' : 'choices'});
				// newChoice.css({'width' : '20px' , 'height' : '20px'});
				if(i === correctAnswerIndex) {
					choiceArray.push(currentQuestion.correctAnswer);
					newChoice.attr("data-answer", "correct");
				}
				else {
					choiceArray.push(currentQuestion.incorrectAnswers[j++]);
					newChoice.attr("data-answer", "wrong");
				}
				newChoice.append(choiceArray[i]);
				$(".answerOptions").append(newChoice);
			}

			console.log("choice array " + choiceArray);
			console.log("correct answer is at position " + (correctAnswerIndex+1));

			game.startCountdown();
			game.questionCount ++;
			console.log("Questions over - " + game.questionCount);
		}
	},

	startCountdown : function startCountdown() {
		if(!game.countDownEnd && !game.countDownStarted){
			game.countdownInterval = setInterval(game.decrementTimer,1000);
		}
		game.countDownStarted = true;
	},

	decrementTimer : function decrementTimer() {
		if(game.time>0){
			game.time--;
		}

		$("#timeLeft").html(game.time);
		console.log("counting down - " + game.time);

		if(game.time === 0) {
			game.countDownEnd = true;
			game.stopCountdown();
			game.displayResult("0");
		}
	},

	stopCountdown : function stopCountdown() {
		game.countDownStarted = false;
		clearInterval(game.countdownInterval);
	},

	// getGiphyImage : function getGiphyImage(questionObject) {
	// 	var giphyImage = 0;// get image from giphy site using ajax
	// 	// get a word from questionObject
	// 	// use ajax call to query word and get image
	// 	//???????document.getElementByClassName("image").html("<img src='" + giphyImage + "'>"); ////// Not sure if this is done here or game.displayResult function
	// },

	displayResult : function displayResult(result) {

		$(".displayResult").show();

		if(result === "0") {
			$("#message").html("You ran out of time.");
		}
		else {
			result ? $("#message").html("You are Correct!!!") : $("#message").html("Wrong Answer!");     
		}
		 
		$("#rightAnswer").html("The correct answer was - " + game.currentQuestion.correctAnswer);
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
		this.countDownStarted = false;
		this.countDownEnd = false
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

  	$(".options").on("click", function(){
  		game.stopCountdown();
  		var isRightChoice = game.currentQuestion.validate(choiceClickedByUser);
  		var isRightChoice = true;
  		game.displayResult(isRightChoice);
  		// game.getGiphyImage(currentQuestion.queryWord);
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