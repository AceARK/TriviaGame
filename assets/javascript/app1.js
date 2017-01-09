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
			var correctAnswerIndex = Math.floor(Math.random()*4);
			var choiceArray = [];
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

		var submitButton = $('<button class="btn btn-lg btn-danger" id="submitAnswers">Submit</button>');
		$("#triviaQuestions").append(submitButton);

		$("#submitAnswers").on("click", function(){
	  		game.stopCountdown();
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
		countdownInterval = setInterval(game.decrementTimer,1000);
		game.countDownStarted = true;
	},
	
	decrementTimer : function decrementTimer() {

		$("#timeLeft").html(game.time);

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

		if(game.time>0){
			if((game.time<=10)&&(game.time !==0)){
				$("#timerSound")[0].currentTime = 0;
				$("#timerSound")[0].play();
			}
			game.time--;
		}
	},

	stopCountdown : function stopCountdown() {
		game.countDownStarted = false;
		game.countDownEnd = true;
		clearInterval(countdownInterval);
	},

	// checking if selected options are correct or wrong
	evaluateResults : function evaluateResults() {

		$('.questionAndAnswerDiv').each(function(){
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
		game.endRound();
	},

	// 
	endRound : function endRound() {
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
		$("html,body").css('background-image', url);
		categorySelected = true;
		enableStartButton();
	});

	$(".difficulty").on("click",function(){
		game.difficulty = $(this).data("difficulty");
		$(".difficultyDropdown:first-child").text($(this).text());
		difficultySelected = true;
		enableStartButton();
	});

	$("#start").on("click",function(){
		$(".instruction").hide();
		$(".startRow").hide();
		$("#start").attr('disabled', true);
		$(".categoryDropdown").attr('disabled',true);
		$(".difficultyDropdown").attr('disabled',true);
  		game.startTrivia();
	});

  	$("#restartTrivia").on("click", function(){
  		clearTimeout(resetAfterResultDisplay);
  		game.resetGame();
  	});

});

function enableStartButton() {
	if(categorySelected && difficultySelected) {
		$("#start").attr('disabled',false);
	}
}
