// Global variables to clear timeouts and intervals
var countdownInterval;
var resetAfterResultDisplay;

// global flags for Category and Difficulty selection
var categorySelected = false;
var difficultySelected = false;

// Game object
var game = {
	// variables
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
			// calling function to display questions
			game.displayQuestions();
		});
	},

	// function to display questions and choices to triviaQuestions div
	displayQuestions : function displayQuestions() {
		// looping through array of questions to get questions and corresponding choices
		for(var i=0; i<game.questionsAndAnswersArray.length; i++) {
			var currentQuestion = game.questionsAndAnswersArray[i];
			var questionDiv = $('<div class="questionAndAnswerDiv">');
			questionDiv.html("<div class='question'>" +(i+1) + ". " + currentQuestion.question + "</div>");
			// choosing random index to store correct answer
			var correctAnswerIndex = Math.floor(Math.random()*4);
			var choiceArray = [];
			var j=0;
			// looping 4 times to create 4 options with correct and wrong answers
			for(var k=0; k<4; k++) {
				var newChoice = $('<input>');
				newChoice.attr({'type': 'radio', 'name' : 'options'+ i, 'id' : 'options'+ i + '-'+ k});
				newChoice.addClass('options');
				newChoice.css({'width' : '20px' , 'height' : '20px'});
				// if index k = index of correct answer, push correct answer
				if(k === correctAnswerIndex) {
					choiceArray.push(currentQuestion.correct_answer);
					newChoice.data("answer", "correct");
				}else {
					// else push wrong answers from array of wrong answers 
					choiceArray.push(currentQuestion.incorrect_answers[j++]);
					newChoice.data("answer", "wrong");
				}
				questionDiv.append(newChoice);
				questionDiv.append("<label for=options"+ i + '-'+ k +">"+choiceArray[k]+"</label>");
			}
			// append all of it to triviaQuestions div
			$("#triviaQuestions").append(questionDiv);
		}

		// show all of it
		$(".triviaRow").show();

		// dynamically creating submit button
		var submitButton = $('<button class="btn btn-lg btn-danger" id="submitAnswers">Submit</button>');
		$("#triviaQuestions").append(submitButton);

		// add event listener to submit button, to stop countdown, and evaluate results
		$("#submitAnswers").on("click", function(){
	  		game.stopCountdown();
	  		game.evaluateResults();
	  		$("#countDownComplete").hide();
	  	});

		// show timer and start countdown
		game.startCountdown();
		$(".timer").show();
		$("#timeLeft").show();

		// Added feature to match options hover color to timer color for better time tracking
		$(".questionAndAnswerDiv>label").hover(function(){
	  		var timerColor = $("#timeLeft").css('background-color');
	  		$(this).css('color', timerColor);
	  	}, function(){
	  		$(this).css('color', 'white');
	  	});
	},

	// timer functions - start
	startCountdown : function startCountdown() {
		countdownInterval = setInterval(game.decrementTimer,1000);
		game.countDownStarted = true;
	},
	
	// decrement
	decrementTimer : function decrementTimer() {

		$("#timeLeft").html(game.time);

		// switch case to change timer color based on seconds left
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
				$("#timerEnd")[0].currentTime = 0;
				$("#timerEnd")[0].play();
				game.countDownEnd = true;
				game.stopCountdown();
				game.evaluateResults();
				game.endRound();
				break;

		}

		// decrement if time>0, and play sound appropriately
		if(game.time>0){
			if((game.time<=10)&&(game.time !==0)){
				$("#timerSound")[0].currentTime = 0;
				$("#timerSound")[0].play();
			}
			game.time--;
		}
	},

	// timer stop
	stopCountdown : function stopCountdown() {
		game.countDownStarted = false;
		game.countDownEnd = true;
		clearInterval(countdownInterval);
	},

	// checking if selected options are correct or wrong
	evaluateResults : function evaluateResults() {

		// for each of the questions
		$('.questionAndAnswerDiv').each(function(){
			// getting selected item from options
			var checkedInput = $(this).find('input[type="radio"]:checked');

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
		// call function to end round	
		game.endRound();
	},

	// Function to end round
	endRound : function endRound() {
		// display stats
		$("#correctAnswers").html(game.rightAnswers);
		$("#wrongAnswers").html(game.wrongAnswers);
		$("#unanswered").html(game.unanswered);
		// display message if more than 5 correct answers
		if(game.rightAnswers > 5) {
			$("#message").html("Good Job! ");
		}
		// empty triviaQuestions div and show results div
		$("#triviaQuestions").empty();
		$(".displayResults").show(); 

		// show message if counted down to 0
		if(game.time === 0){
			$("#countDownComplete").show();
		}
		// disable submit button	
		$("#submitAnswers").attr('disabled', true);
	 	// Time out function to hide results div after 4.5 secs, and reset game 
	    resetAfterResultDisplay = setTimeout(function(){
	    	$(".displayResults").hide();
	    	game.resetGame();
	    },4500);
	},

	// reset function to reset all values, hide appropriate divs, show the rest and disable start button
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

// program begins
$(document).ready(function(event) { 
	// show instruction, disable start button until Category and Difficulty specified
	$(".instruction").show();
	$("#start").attr('disabled',true);

	// Set category to selected value and display on dropdown button
	// Additional feature of getting background on Category selection
	$(".category").on("click",function(){
		game.category = $(this).data("category");
		$(".categoryDropdown:first-child").text($(this).text());
		var url = "url('assets/images/" + game.category + ".jpg')";
		$("html,body").css('background-image', url);
		categorySelected = true;
		enableStartButton();
	});

	// Set difficulty to selected value and display on dropdown button
	$(".difficulty").on("click",function(){
		game.difficulty = $(this).data("difficulty");
		$(".difficultyDropdown:first-child").text($(this).text());
		difficultySelected = true;
		enableStartButton();
	});

	// On click of start button, hide instruction, disable buttons and get questions
	$("#start").on("click",function(){
		$(".instruction").hide();
		$(".startRow").hide();
		$("#start").attr('disabled', true);
		$(".categoryDropdown").attr('disabled',true);
		$(".difficultyDropdown").attr('disabled',true);
  		game.startTrivia();
	});

	// On click of restart button, clear timeout set to hide display results, and reset game
  	$("#restartTrivia").on("click", function(){
  		clearTimeout(resetAfterResultDisplay);
  		game.resetGame();
  	});

});

// enabling start button only if both category and difficulty are specified
function enableStartButton() {
	if(categorySelected && difficultySelected) {
		$("#start").attr('disabled',false);
	}
}
