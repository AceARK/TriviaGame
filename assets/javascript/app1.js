var countdownInterval;
var resetAfterResultDisplay;

// Game object
var game = {
	
	time: 30,
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
			var questionDiv = $('<div class="questionAndAnswerDiv">');
			questionDiv.html("<div class='question'>" +(i+1) + ". " + currentQuestion.question + "</div>");
			console.log("question being filled " + currentQuestion.question);
			var correctAnswerIndex = Math.floor(Math.random()*4);
			var choiceArray = [];
			console.log("incorrect answers " + currentQuestion.incorrect_answers);
			var j=0;
			for(var k=0; k<4; k++) {
				var newChoice = $('<input>');
				newChoice.attr({'type': 'radio', 'name' : 'options'+ i, 'id' : 'options'+ i + '-'+ k});
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
				questionDiv.append("<label for=options"+ i + '-'+ k +">"+choiceArray[k]+"</label>");
			}
			$("#triviaQuestions").append(questionDiv);
		}

		$(".triviaRow").show();

		console.log("choice array " + choiceArray);
		console.log("correct answer is at position " + (correctAnswerIndex+1));
		var submitButton = $('<button class="btn btn-lg btn-danger" id="submitAnswers">Submit</button>');
		$("#triviaQuestions").append(submitButton);

		$("#submitAnswers").on("click", function(){

	  		console.log("submit button clicked");
	  		game.stopCountdown();
	  		console.log("countdown stopped. calling evaluate results");
	  		game.evaluateResults();
	  		$("#countDownComplete").hide();
	  	});

		game.startCountdown();
		$(".timer").show();
		$("#timeLeft").show();

		$(".questionAndAnswerDiv>label").hover(function(){
	  		var timerColor = $("#timeLeft").css('background-color');
	  		$(this).css('color', timerColor);
	  	}, function(){
	  		$(this).css('color', 'white');
	  	});
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

		switch(game.time) {
			case 20:
				$("#timeLeft").css('background-color','#6aff00');
				$("#timeLeft").css('border','4px solid #409b00');
				break;

			case 10:
				$("#timeLeft").css('background-color','#e1ff00');
				$("#timeLeft").css('border','4px solid #a8a30a');
				break;

			case 5:
				$("#timeLeft").css('background-color','#ff9900');
				$("#timeLeft").css('border','4px solid #a36100');
				break;

			case 2:
				$("#timeLeft").css('background-color','#e23131');
				$("#timeLeft").css('border','4px solid #700c0c');
				break;

			case 0:
				// $("#timeLeft").html(game.time);
				game.countDownEnd = true;
				game.stopCountdown();
				game.evaluateResults();
				game.endRound();
				break;

		}

		if(game.time>0){
			game.time--;
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

		});		
		game.endRound();
	},

	// 
	endRound : function endRound() {
		// $(".options").attr('disabled',true);
		// $("#timeLeft").hide();
		$("#correctAnswers").html(game.rightAnswers);
		$("#wrongAnswers").html(game.wrongAnswers);
		$("#unanswered").html(game.unanswered);
		if(game.rightAnswers > 5) {
			$("#message").html("Good Job! ");
		}
		$("#triviaQuestions").empty();
		$(".displayResults").show(); 

		if(game.time === 0){
			$("#countDownComplete").show();
		}	
		$("#submitAnswers").attr('disabled', true);
	 	
	    resetAfterResultDisplay = setTimeout(function(){
	    	$(".displayResults").hide();
	    	game.resetGame();
	    },4500);
	},

	resetGame : function resetGame() {
		game.time = 30;
		game.questionsAndAnswersArray = [];
		game.arrayOfUsedIndices = [];
		game.questionCount = 0;
		game.rightAnswers = 0;
		game.wrongAnswers = 0;
		game.unanswered = 0;
		game.countDownStarted = false;
		game.countDownEnd = false;
		categorySelected = false;
		difficultySelected = false;
		$(".timer").hide();
		$("#timeLeft").hide();
		$("#timeLeft").css('background-color','#04ff00');
		$("#timeLeft").css('border','4px solid #028700');
		$("#timeLeft").html("");
		$(".startRow").show();
		$(".instruction").show();
		$("#start").attr('disabled',true);
		$(".displayResults").hide();
		$(".categoryDropdown:first-child").text("Category");
		$(".difficultyDropdown:first-child").text("Difficulty");
		$(".categoryDropdown").attr('disabled',false);
		$(".difficultyDropdown").attr('disabled',false);
	}

};

var categorySelected = false;
var difficultySelected = false;

// program begins
$(document).ready(function(event) { 
	$(".instruction").show();
	$("#start").attr('disabled',true);

	$(".category").on("click",function(){
		game.category = $(this).data("category");
		$(".categoryDropdown:first-child").text($(this).text());
		var url = "url('assets/images/" + game.category + ".jpg')";
		console.log(url);
		$("html,body").css('background-image', url);
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
		$(".instruction").hide();
		$(".startRow").hide();
		$("#start").attr('disabled', true);
		$(".categoryDropdown").attr('disabled',true);
		$(".difficultyDropdown").attr('disabled',true);
  		console.log("Start button clicked");
  		game.startTrivia();
	});

  	$("#restartTrivia").on("click", function(){
  		clearTimeout(resetAfterResultDisplay);
  		game.resetGame();
  	});

});

function enableStartButton() {
	console.log("category selected - "+categorySelected + ". difficulty selected - "+difficultySelected+".");
	if(categorySelected && difficultySelected) {
		console.log("entering enableSTart condition");
		$("#start").attr('disabled',false);
	}
}
