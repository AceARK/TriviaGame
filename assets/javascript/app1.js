var countdownInterval;

// Game object
var game = {
	
	time: 10,
	questionCount: 0,
	rightAnswers: 0,
	wrongAnswers: 0,
	unanswered: 0,
	questionsAndAnswersArray: [],
	arrayOfUsedIndices: [],
	category: "",
	difficulty: "",
	countDownStarted: false,
	countDownEnd: false,

	// ajax call to opentdb to get questions on category specified with difficulty specified
	startTrivia : function startTrivia()  {
		var queryURL = "https://opentdb.com/api.php?amount=10&category="+game.category+"&difficulty="+game.difficulty+"&type=multiple";

		return $.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(data){
			game.questionsAndAnswersArray = data.results;
			console.log("Array of questions - " + game.questionsAndAnswersArray[4].question);
			console.log("Array of questions - " + game.questionsAndAnswersArray);
			// calling function to display questions
			game.displayQuestions();
		});
	},

	// function to display questions and choices to triviaQuestions div
	displayQuestions : function displayQuestions() {
		for(var i=0; i<game.questionsAndAnswersArray.length; i++) {
			var currentQuestion = game.questionsAndAnswersArray[i];
			var questionDiv = $('<div class="questionAndAnswerDiv text-center">');
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
					newChoice.data("answer", "correct");
				}
				else {
					choiceArray.push(currentQuestion.incorrect_answers[j++]);
					newChoice.data("answer", "wrong");
				}
				questionDiv.append(newChoice);
				questionDiv.append(choiceArray[k] + "</label>");
			}
			$("#triviaQuestions").append(questionDiv);
		}

		console.log("choice array " + choiceArray);
		console.log("correct answer is at position " + (correctAnswerIndex+1));
		var submitButton = $('<button class="btn btn-lg btn-info" id="submitAnswers">Submit</button>');
		$("#triviaQuestions").append(submitButton);

		$("#submitAnswers").on("click", function(){

	  		console.log("submit button clicked");
	  		game.stopCountdown();
	  		console.log("countdown stopped. calling evaluate results");
	  		game.evaluateResults();
	  		$("#countDownComplete").hide();
	  	});

		game.startCountdown();
		$("#timeLeft").show();
	},

	// timer functions
	startCountdown : function startCountdown() {
		// if(!game.countDownEnd && !game.countDownStarted){
			countdownInterval = setInterval(game.decrementTimer,1000);
		// }
		game.countDownStarted = true;
	},
	
	decrementTimer : function decrementTimer() {

		$("#timeLeft").html(game.time);
		console.log("counting down - " + game.time);

		if(game.time>0){
			game.time--;
		}

		if(game.time === 0) {
			game.countDownEnd = true;
			game.stopCountdown();
			game.evaluateResults();
			game.endRound();
		}
	},

	stopCountdown : function stopCountdown() {
		game.countDownStarted = false;
		game.countDownEnd = true;
		console.log("entered stopcountdown");
		clearInterval(countdownInterval);
		console.log("cleared countdownInterval");
	},

	// checking if selected options are correct or wrong
	evaluateResults : function evaluateResults() {

		$('.questionAndAnswerDiv').each(function(){
			var checkedInput = $(this).find('input[type="radio"]:checked');
			console.dir(checkedInput);

			switch(checkedInput.data('answer')) {
				case "correct":
					game.rightAnswers++;
					break;

				case "wrong":
					game.wrongAnswers++;
					break;

				default:
					game.unanswered++;
					break;
			}

			game.endRound();
		});		
	},

	// 
	endRound : function endRound() {
		$("#timeLeft").hide();
		$("#correctAnswers").html(game.rightAnswers);
		$("#wrongAnswers").html(game.wrongAnswers);

		$("#unanswered").html(game.unanswered);
		$(".displayResults").show(); 

		if(game.time === 0){
			$("#countDownComplete").show();
		}	
		$("#submitAnswers").attr('disabled', true);
	 	
	    setTimeout(function(){
	    	$(".displayResults").hide();
	    	game.restartGame();
	    },4500);
	},

	restartGame : function restartGame() {
		this.time = 10;
		// clearInterval(countdownInterval);
		this.questionsAndAnswersArray = [];
		this.arrayOfUsedIndices = [];
		this.questionCount = 0;
		this.rightAnswers = 0;
		this.wrongAnswers = 0;
		this.unanswered = 0;
		this.countDownStarted = false;
		this.countDownEnd = false
		$("#timeLeft").hide();
		$(".div>").hide();
		$("#start").attr('disabled',true);
		$(".categoryDropdown:first-child").text("Category");
		$(".difficultyDropdown:first-child").text("Difficulty");
		$("#triviaQuestions").empty();
	}

};

var categorySelected = false;
	var difficultySelected = false;

// program begins
$(document).ready(function(event) { 
	$(".displayResults").hide();
	$("#start").attr('disabled',true);

	$(".category").on("click",function(){
		game.category = $(this).data("category");
		$(".categoryDropdown:first-child").text($(this).text());
		console.log(game.category);
		categorySelected = true;
		console.log(categorySelected);
		enableStartButton();
	});

	$(".difficulty").on("click",function(){
		game.difficulty = $(this).data("difficulty");
		$(".difficultyDropdown:first-child").text($(this).text());
		console.log(game.difficulty);
		difficultySelected = true;
		console.log(difficultySelected);
		enableStartButton();
	});

	$("#start").on("click",function(){
  		console.log("Start button clicked");
  		game.startTrivia();
	});

  	$("#restartTrivia").on("click", function(){
  		game.restartGame();
  	});

});

function enableStartButton() {
	console.log("category selected - "+categorySelected + ". difficulty selected - "+difficultySelected+".");
	if(categorySelected && difficultySelected) {
		console.log("entering enableSTart condition");
		$("#start").attr('disabled',false);
	}
}
