// Quiz questions
let questionArray = [
	{
		"question": "What does HTML stand for?",
		"answers": ["Hyper Text Markup Language", "High Tech Multi-Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
		"correctAnswer": 0
	},

	{
		"question": "What does CSS stand for?",
		"answers": ["Counter Style Sheet", "Computer Style Sheet", "Colourful Style Sheet", "Cascading Style Sheet"],
		"correctAnswer": 3
	},

	{
		"question": "What is the purpose of CSS in web development?",
		"answers": ["To create dynamic web pages", "To define the structure of a web page", "To style and layout web pages", "To handle server-side logic"],
		"correctAnswer": 2
	},

	{
		"question": "What is Bootstrap?",
		"answers": ["A database of JavaScript snippets", "A website for game developers to post their portfolios", "A CSS framework for developing responsive and mobile-first websites", "A community forum to share AI-generated projects"],
		"correctAnswer": 2
	},

	{
		"question": "In JavaScript, what is the purpose of the const keyword?",
		"answers": ["Defining a variable with block scope", "Declaring a constant  variable", "Creating a function", "Executing a loop"],
		"correctAnswer": 1
	},
];

const startBtn = document.getElementById("start-btn"),
	submitScoreBtn = document.getElementById("submit-score"),
	highScoresBtn = document.getElementById("high-scores-btn"),
	quizFormat = document.getElementById("quiz"),
	timer = document.getElementById("timer"),
	nameInputForm = document.getElementById("name-input-form"),
	quizTitle = document.getElementById("quiz-title"),
	totalTime = 60,
	penaltyTime = 10,
	scoreListLength = 10,
	nameInitials = true;
let highestScores = [],
	highScoresObj = {},
	timeOver = true,
	newTime = totalTime,
	questionNumber = 0,
	answerDisplayTime,
	highScore;

// Display quiz description + start button
function initialQuiz() {
	console.log("Page has been reloaded");
	quizFormat.innerHTML = "Answer all the questions within the time limit.<br><br>" +
	"Choosing an incorrect answer will deduct " +	penaltyTime +	" seconds from your remaining time.<br><br>" +
	"Your final score will be the amount of time left at the end of the quiz.<br><br>" +
	"You have one minute to complete the quiz. Answer the quickest to win!<br><br>" +
	"If you do not finish before the timer runs out, your score will be zero.";
	quizFormat.style.marginTop = "20px";
	quizFormat.style.marginBottom = "20px";
	startBtn.style.display = "visible";

	// Retrieve high scores from local storage
	let storedHighScoresArray = JSON.parse(localStorage.getItem("highestScoresArray"));
	if (storedHighScoresArray !== null) {
		highestScores = storedHighScoresArray;
	}
	let storedHighScoreList = JSON.parse(localStorage.getItem("storedHighScoreList"));
	if (storedHighScoreList !== null) {
		highScoresObj = storedHighScoreList;
	}
}

// Run initial function upon page reload
initialQuiz();

// Resets timer, hide elements and resets variables upon start button click
startBtn.addEventListener("click", function () {
	highScoresBtn.style.display = "none";
	quizTitle.textContent = "Coding Quiz";
	newTime = totalTime;
	timeOver = false;
	questionNumber = 0;
	startBtn.style.display = "none";
	quizFormat.textContent = "";
	timer.textContent = "Time left: " + newTime + " seconds";
	document.getElementsByClassName("name-input-row")[0].style.display = "none";

	// Start timer and run the quiz
	decrement();
	runQuiz();
});

// Run quiz
function runQuiz() {
	if (questionNumber === questionArray.length) {
		resultScore();
		return;
	}
	// Display next question
	quizFormat.innerHTML = "";
	createLayout(questionArray[questionNumber]);
	questionNumber++;
}

// Run countdown timer
function decrement() {
	let timerInterval = setInterval(
		function () {
			newTime--;
			timer.textContent = "Time left: " + newTime + " seconds";
			if (newTime <= 0) {
				clearInterval(timerInterval);
				resultScore();
			}
			if (timeOver) {
				clearInterval(timerInterval);
				timer.textContent = "Time left: 0";
			}
		},
		1000
	);
}

// Deduct seconds for incorrect answers
function penalize(penaltyTime) {
	newTime -= penaltyTime;
}

// Display questions
function createLayout(questionObj) {
	let numberOfAnswers = questionObj.answers.length;
	let questionPara = document.createElement("p");
	questionPara.textContent = questionObj["question"];
	questionPara.setAttribute("class", "question col md-12");
	quizFormat.appendChild(questionPara);

	// Display answer buttons & text
	for (let i = 0; i < numberOfAnswers; i++) {
		let newRow = document.createElement("div");
		newRow.setAttribute("class", "row");
		quizFormat.appendChild(newRow);

		let answerBtn = document.createElement("button");
		answerBtn.textContent = i + 1 + ".";
		answerBtn.setAttribute("class", "answerBtn btn btn-primary col-md-1");
		answerBtn.setAttribute("type", "button");
		if (questionObj.correctAnswer === i) {
			answerBtn.setAttribute("id", "correctAnswer");
		}

		let answerText = document.createElement("p");
		answerText.textContent = questionObj.answers[i];
		answerText.setAttribute("class", "answerText col-md-11");

		newRow.appendChild(answerBtn);
		newRow.appendChild(answerText);
	}

	// Add event listener to check the answer
	quizFormat.addEventListener("click", checkAnswer);
}

function checkAnswer(event) {
	event.preventDefault();
	if (event.target.matches("button")) {
		let hrElem = document.getElementById("answer-bar");
		let feedbackText = document.getElementById("correct-incorrect");
		if (event.target.id === "correctAnswer") {
			feedbackText.textContent = "Correct"
			feedbackText.style.color = "limegreen";
			feedbackText.style.fontWeight = "bold";
		}
		else {
			feedbackText.textContent = "Incorrect (–10 seconds)";
			feedbackText.style.color = "red";
			feedbackText.style.fontWeight = "bold";
			penalize(penaltyTime);
		}

		// Unhide the "Correct" / "Incorrect" text
		hrElem.style.visibility = "visible";
		feedbackText.style.visibility = "visible";

		// Continue the quiz
		runQuiz();

		// Show "Correct" / "Incorrect" for a limited time
		answerDisplayTime = newTime - 2;
		if (answerDisplayTime < 0) {
			answerDisplayTime = 0;
		}
		let displayInterval = setInterval(
			function () {
				if (answerDisplayTime >= newTime) {
					hrElem.style.visibility = "hidden";
					feedbackText.style.visibility = "hidden";
					clearInterval(displayInterval);
				}
			},
			1000
		);
	}
}

// Add event listener to high score form & buttons
nameInputForm.addEventListener("submit", function (event) {
	submitName(event);
});

submitScoreBtn.addEventListener("click", function (event) {
	submitName(event);
});

document.getElementById("high-scores-btn").addEventListener("click", displayHighScores);
document.getElementById("high-scores").addEventListener("click", function () {
	startBtn.style.display = "inline-block";
	displayHighScores();
});

// End quiz
function resultScore() {
	timeOver = true;
	let displayInterval = setTimeout(
		function () {
			document.getElementById("answer-bar").style.visibility = "hidden";
			document.getElementById("correct-incorrect").style.visibility = "hidden";
		},
		2000
	);

	quizFormat.innerHTML = "";
	console.log("Quiz completed");

	// Define score as time remaining
	timer.textContent = "Time left: 60 seconds";
	highScore = newTime;
	if (highScore < 0) {
		highScore = 0;
	}

	// Display score
	let highScoreDisplay = document.createElement("p");
	highScoreDisplay.setAttribute("class", "col-md-12 high-score");
	quizFormat.textContent = "Your score was: " + highScore;

	if (highScore === 0) {
		highScoreDisplay.textContent += "\nTry again!";
		quizFormat.appendChild(highScoreDisplay);
	}
	else {
		highScoreDisplay.textContent += "\nGood job!";
		quizFormat.appendChild(highScoreDisplay);
		document.getElementsByClassName("name-input-row")[0].style.display = "block";
	}

	// Display start & high scores buttons
	startBtn.textContent = "Restart Quiz";
	startBtn.style.display = "inline-block";
	highScoresBtn.style.display = "inline-block";
}

// Determine whether a score is a high score
function isHighScore(highScore) {
	highestScores.sort();
	if (highestScores.length < scoreListLength) {
		return true;
	}
	if (highScore > highestScores[0]) {
		return true;
	}
	return false;
}

// High score form
function submitName(event) {
  event.preventDefault();

  // Store and sort scores with user initials
  if (inputName(highScore)) {
    let sortedScores = scoreSort();
    let lowScorerName = sortedScores[sortedScores.length - 1][1];
    highScoresObj[lowScorerName].sort();
    highScoresObj[lowScorerName].splice(0, 1);
    highestScores.shift();
  }

  highestScores.push(highScore);
  localStorage.setItem("highestScoresArray", JSON.stringify(highestScores));

  // Update arrays with latest data from local storage
  highestScores = JSON.parse(localStorage.getItem("highestScoresArray"));
  highScoresObj = JSON.parse(localStorage.getItem("storedHighScoreList"));

  document.getElementsByClassName("name-input-row")[0].style.display = "none";

  // Display high scores with the updated data
  displayHighScores();
}

// Validate name input
function inputName(highScore) {
	let nameInput = document.querySelector("#name-text").value;
	if (nameInput === "") {
		alert("Enter at least 1 letter.");
		return false;
	}
	if (nameInitials) {
		if (nameInput.length > 3) {
			alert("Please enter maximum three letters.");
			return false;
		}
		nameInput = nameInput.toUpperCase();
	}
	if (highScoresObj[nameInput] === undefined) {
		highScoresObj[nameInput] = [];
		highScoresObj[nameInput].push(highScore);
		localStorage.setItem("storedHighScoreList", JSON.stringify(highScoresObj));
	}
	else {
		highScoresObj[nameInput].push(highScore);
		localStorage.setItem("storedHighScoreList", JSON.stringify(highScoresObj));
	}
	return true;
}

// Displaysscores in styled rows
function displayHighScores() {
	quizFormat.innerHTML = "";
	highScoresBtn.style.display = "none";
	quizTitle.textContent = "High Scores";

	// Retrieve sorted scores
	let sortedScores = scoreSort();
	
	// Alternate row background colours
	let alternateBackground = true;

	// Loop through sorted scores to create and append rows
	for (let i = 0, j = sortedScores.length; i < j; i++) {
			let scoreRow = document.createElement("div");
			
			// Set class for alternating row background
			if (alternateBackground) {
					scoreRow.setAttribute("class", "row high-score-row odd-row");
					alternateBackground = false;
			} else {
					scoreRow.setAttribute("class", "row high-score-row even-row");
					alternateBackground = true;
			}

			// Append row to quiz format
			quizFormat.appendChild(scoreRow);

			// Create and append columns for name and score
			let nameCol = document.createElement("div");
			nameCol.setAttribute("class", "col-md-11");
			nameCol.textContent = sortedScores[i][1];
			scoreRow.appendChild(nameCol);

			let scoreCol = document.createElement("div");
			scoreCol.setAttribute("class", "col-md-1");
			scoreCol.textContent = sortedScores[i][0];
			scoreRow.appendChild(scoreCol);
	}
}
// Puts names and high scores into an array
function scoreSort() {
	let scoreArray = [];
	for (let scoreName in highScoresObj) {
		for (let i = 0, j = highScoresObj[scoreName].length; i < j; i++) {
			let individualScore = [];
			individualScore.push(highScoresObj[scoreName][i]);
			individualScore.push(scoreName);
			scoreArray.push(individualScore);
		}
	}

	// Bubble sort on scoreArray, sorting in descending order:
	do {
		var swap = 0;
		for (let i = 0, j = scoreArray.length - 1; i < j; i++) {
			if (scoreArray[i][0] < scoreArray[i + 1][0]) {
				let tmp = scoreArray[i];
				scoreArray[i] = scoreArray[i + 1];
				scoreArray[i + 1] = tmp;
				swap++;
			}
		}
	} while (swap != 0);
	return scoreArray;
}
