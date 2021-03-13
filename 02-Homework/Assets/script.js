//Elements
let timeLeft = 75;
let timer = document.getElementById("timer");
let scores = document.getElementById("scoreKeep");
let buttons = document.getElementById("buttons");
let viewHighScores = document.getElementById("highscores");
//Start button
let beginButton = document.getElementById("begin_button");
beginButton.addEventListener("click", setTime);

let questionDiv = document.getElementById("question-div");
let results = document.getElementById("results");
let choices = document.getElementById("choices");
let storeScores = [];
let storeScoredArray = JSON.parse(window.localStorage.getItem("highScores"));
let questionCount = 0;
let score = 0;

//Creating Questions
let questions = [
    {
        question: "What does HTML stand for?",
        multiplechoice: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Text Makeup Language"],
        correct: "Hyper Text Markup Language"
    },
    {
        question: "How can you make a list that lists the items with numbers?",
        multiplechoice: ["Ol", "Dl", "Ul", "List"],
        correct: "Ol"
    },
    {
        question: "If we want to define a style for an unique element, then which CSS selector will we use?",
        multiplechoice:["text", "class", "Id", "name"],
        correct: "Id"
    },
    {
        question: "How can we write a comment along with CSS code?",
        multiplechoice: ["/ comment /", "/* comment */", "<' comment '>", "// comment //"],
        correct: "/* comment */"
    },
    {
        question: "Which of the following is NOT a Javascript Data type?",
        multiplechoice: ["Undefined", "Number", "Boolean", "Float"],
        correct: "Float"
    }
]

//Function for timer to start when button is pressed
function setTime() {
    displayQuestions();
    let timerInterval = setInterval(function() {
      timeLeft--;
      timer.textContent = "";
      timer.textContent = "Time: " + timeLeft;
      if (timeLeft <= 0 || questionCount === questions.length) {
        clearInterval(timerInterval);
        captureUserScore();
      } 
    }, 1000);
}

//Display Questions
function displayQuestions() {
    removeEls(beginButton);
  
    if (questionCount < questions.length) {
      questionDiv.innerHTML = questions[questionCount].question;
      choices.textContent = "";
  
      for (let i = 0; i < questions[questionCount].multiplechoice.length; i++) {
        let el = document.createElement("button");
        el.innerText = questions[questionCount].multiplechoice[i];
        el.setAttribute("data-id", i);
        el.addEventListener("click", function (event) {
          event.stopPropagation();
  
          if (el.innerText === questions[questionCount].answer) {
            score += timeLeft;
          } else {
            score = 10;
            timeLeft = timeLeft - 10;
          }
          
          questionDiv.innerHTML = "";
  
          if (questionCount === questions.length) {
            return;
          } else {
            questionCount++;
            displayQuestions();
          }
        });
        choices.append(el);
      }
    }
}

//Save scores
function captureUserScore() {
    timer.remove();
    choices.textContent = "";

    let initialsInput = document.createElement("input");
    let postScoreBtn = document.createElement("input");

    results.innerHTML = `You scored ${score} points! Enter initials: `;
    initialsInput.setAttribute("type", "text");
    postScoreBtn.setAttribute("type", "button");
    postScoreBtn.setAttribute("value", "Post My Score!");
    postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storeScoredArray, storeScores);

    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewHighScores.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

let saveScores = (array) => {
    window.localStorage.setItem("highScores", JSON.stringify(array));
}

let defineScoresArray = (arr1, arr2) => {
    if(arr1 !== null) {
      return arr1
    } else {
      return arr2
    }
}

let removeEls = (...els) => {
    for (let el of els) el.remove();
}

function displayAllScores() {
    removeEls(timer, beginButton, results);
    let scoresArray = defineScoresArray(storeScoredArray, storeScores);
  
    scoresArray.forEach(obj => {
      let initials = obj.initials;
      let storedScore = obj.score;
      let resultsP = document.createElement("p");
      resultsP.innerText = `${initials}: ${storedScore}`;
      scores.append(resultsP);
    });
}

function viewScores() {
    viewHighScores.addEventListener("click", function(event) {
      event.preventDefault();
      removeEls(timer, beginButton);
      displayAllScores();
      removeEls(viewHighScores);
      clearScoresBtn();
      goBackBtn();
    });
}

function clearScoresBtn() {    
    let clearBtn = document.createElement("input");
    clearBtn.setAttribute("type", "button");
    clearBtn.setAttribute("value", "Clear Scores");
    clearBtn.addEventListener("click", function(event){
      event.preventDefault();
      removeEls(scores);
      window.localStorage.removeItem("highScores");
    })
    scores.append(clearBtn)
}

function goBackBtn() {
    let backBtn = document.createElement("input");
    backBtn.setAttribute("type", "button");
    backBtn.setAttribute("value", "Go Back");
    backBtn.addEventListener("click", function(event){
      event.preventDefault();
      window.location.reload();
    })
    buttons.append(backBtn)
}

viewScores();