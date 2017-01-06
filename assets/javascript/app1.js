// // Question class
// class TriviaQuestion {
// 	constructor(data) {
// 		console.log("Here now and received data - " + data);
// 		this.question = data.question;
// 		this.correctAnswer = data.correct_answer;
// 		this.incorrectAnswers = data.incorrect_answers;
// 	}

// 	validate() {

// 		// get value of input radio button clicked
// 		// compare value to this.correctAnswer
// 		// if same, return 

// 		return (userChoice == this.rightAnswer);
// 		//var result = "";
// 		// if(userChoice === rightAnswer){
// 		// 	wins++;
// 		// 	result = "correct";
// 		// }

// 		// else{
// 		// 	losses++;
// 		// 	result = "wrong";
// 		// }
// 		//game.displayResult(result);
// 		// timer.stopCountdown(); /////////// Don't know if this can access timer object created in displayQuestion function of game object.
// 	}
	
// }


var countdownInterval;

// Game object
var game = {
	
	time: 30,
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

	displayQuestions : function displayQuestions() {
		for(var i=0; i<game.questionsAndAnswersArray.length; i++) {
			var currentQuestion = game.questionsAndAnswersArray[i];
			var questionDiv = $('<div.questionAndAnswerDiv.text-center>');
			questionDiv.html(currentQuestion.question + "<br>");
			console.log("question being filled " + currentQuestion.question);
			var correctAnswerIndex = Math.floor(Math.random()*4);
			var choiceArray = [];
			console.log("incorrect answers " + currentQuestion.incorrect_answers);
			var j=0;
			for(var k=0; k<4; k++) {
				var newChoice = $('<input>');
				newChoice.attr({'type': 'radio', 'name' : 'options'+[i]});
				newChoice.addClass('options');
				newChoice.css({'width' : '20px' , 'height' : '20px'});
				if(k === correctAnswerIndex) {
					choiceArray.push(currentQuestion.correct_answer);
					newChoice.attr("data-answer", "correct");
				}
				else {
					choiceArray.push(currentQuestion.incorrect_answers[j++]);
					newChoice.attr("data-answer", "wrong");
				}
				questionDiv.append(newChoice);
				questionDiv.append(choiceArray[k] + "</label>");
			}
			$("#triviaQuestions").append(questionDiv);
			$("#triviaQuestions").append("<br><br>");;
		}

		console.log("choice array " + choiceArray);
		console.log("correct answer is at position " + (correctAnswerIndex+1));

		game.startCountdown();
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
			game.evaluateResults();
			game.displayResults();
		}
	},

	stopCountdown : function stopCountdown() {
		game.countDownStarted = false;
		clearInterval(game.countdownInterval);
	},

	evaluateResults : function evaluateResults() {
		for(var i=0; i<game.questionsAndAnswersArray.length; i++) {
			var option = "options"+i;
			var selectedOption = ".options[name="+option+"]";
			$(selectedOption).each(function() {
				if($("input: checked").attributes.data-answer.nodeValue === "correct") { 
		  			game.rightAnswers++;
		  			console.log("rightAnswer count " + game.rightAnswers);
		  		}
		  		else {
		  			game.wrongAnswers++;
		  			console.log("wrongAnswer count " + game.wrongAnswers);
		  		}
			})
		}
		
	}

	displayResults : function displayResults() {

		$(".displayResults").show();

		if(game.time === 0){
			$("#countDownComplete").show();
		}	
		 
		$("#correctAnswers").html(game.rightAnswers);
		$("#wrongAnswers").html(game.wrongAnswers);

		$("#unanswered").html(game.unanswered);
	 	
	    // setTimeout(function(){$(".displayResults").hide()},4500);
	},

	// endGame : function endGame() {
		// $("#correctAnswers").html = this.rightAnswers;
		// $("#wrongAnswers").html = this.wrongAnswers;
		// $("#unanswered").html = this.unanswered;
		// $(".displayStats").show();
	// },

	restartGame : function restartGame() {
		this.questionArray = [];
		this.questionCount = 0;
		this.rightAnswers = 0;
		this.wrongAnswers = 0;
		this.unanswered = 0;
		this.countDownStarted = false;
		this.countDownEnd = false
		this.game.displayQuestion();
		$(".displayResults").hide();
	}

};

// program begins
$(document).ready(function(event) { 
	$(".displayResults").hide();
	ajaxCall();
	
  	$("#start").on("click",function(){
  		console.log("Start button clicked");
  		game.displayQuestions();
  	});

  	$(".options").on("click", function(){
	   		
   		if($("input: checked").attributes.data-answer.nodeValue === "correct") { ////////// this seems to not be working
  			game.rightAnswers++;
  			console.log("rightAnswer count " + game.rightAnswers);
  		}
  		else {
  			game.wrongAnswers++;
  			console.log("wrongAnswer count " + game.wrongAnswers);
  		}
   		
  		
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