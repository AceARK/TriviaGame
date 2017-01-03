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

// let countdownInterval;
// Timer class
class Timer {

	constructor(time){
		this.time = time;
	}


	startCountdown() {
		this.countdownInterval = setInterval(this.decrementTimer,1000);
	}

	decrementTimer() {
		this.time--;
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
			// create new radio button
			// if iterator == correct answer index, use data-answer="correct", else data-answer="wrong"

			var correctAnswerIndex = Math.floor(Math.random()*3);
			var choiceArray = [];
			console.log("incorrect answers " + currentQuestion.incorrectAnswers);
			var j=0;
			for(var i=0; i<4; i++) {
				var inputContainer = $('<div>');
				inputContainer.addClass("options col-sm-6");
				var newChoice = $('<input>');
				newChoice.attr({'type': 'radio', 'name' : 'choices'});
				newChoice.css({'width' : '20px' , 'height' : '20px'});
				if(i === correctAnswerIndex) {
					choiceArray.push(currentQuestion.correctAnswer);
					newChoice.attr("data-answer", "correct");
				}
				else {
					choiceArray.push(currentQuestion.incorrectAnswers[j++]);
					newChoice.attr("data-answer", "wrong");
				}
				newChoice.attr("value",choiceArray[i]);
				inputContainer.append(newChoice).append(choiceArray[i] + "<br>");
				$(".answerOptions").append(inputContainer);
			}

			console.log("choice array " + choiceArray);
			console.log("correct answer is at position " + (correctAnswerIndex+1));

			// to display the options
			// 

			// for(var i=0; i<4; i++) {
			// 	var j =0;
			// 	var newChoice = document.createElement('input');
			// 	newChoice.setAttribute('type', 'radio');
			// 	if(i === correctAnswerIndex) {
			// 		newChoice.value = game.choiceArray[correctAnswerIndex];
			// 		console.log("newChoice's value " + newChoice.value);
			// 	}

			// 	else {
			// 			while(j<3) {
			// 				console.log("choieARray " + game.choiceArray);
			// 				newChoice.value = game.choiceArray[++j];
			// 				console.log("newChoice value value " + newChoice.value);
			// 			}
			// 		}
			// 	$(".answerOptions").append(newChoice);
			// }

			// creating new Timer object and starting countdown
			var timer = new Timer(15);
			timer.startCountdown();
			game.questionCount ++;
			console.log("Questions over - " + game.questionCount);
		}
	},

	// displayChoices : function displayChoices() {

	// 	// get a random number from 0 to 3 for correct answer's index
	// 	// loop through choiceArray and push choices
	// 	// if iterator == correct answer index, push correct answer

	// 	correctAnswerIndex = Math.floor(Math.random()*3);
	// 	for(var i=0; i<4; i++) {
	// 		if(i === correctAnswerIndex) {
	// 			game.choiceArray.push(game.currentQuestion.correctAnswer);
	// 		}
	// 		game.choiceArray.push(game.currentQuestion.incorrectAnswers);
	// 	}

	// 	for(var i=0; i<4; i++) {
	// 		var newChoice = document.createElement('input');
	// 	newChoice.setAttribute('type', 'radio');

	// 	newChoice.value = choiceArray[correctAnswerIndex];  

	// 	$(".answerOptions").appendChild(newChoice);
	// 	}
		
	// },

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
  		//var isRightChoice = currentQuestion.validate(choiceClickedByUser);
  		var isRightChoice = true;
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