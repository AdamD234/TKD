let stage = 0;
let englishOrKorean = 0;
const questionText = document.querySelector(".question");
const answerText = document.querySelector(".answer");
const stats = document.querySelector(".stats");
const topPercentage = document.querySelector(".top.percentage");
const bottomPercentage = document.querySelector(".bottom.percentage");
const questionTypeEl = document.querySelector(".question-type");
const root = document.documentElement;
let questionNumber;
let question;
let answeredQuestions;
let correctQuestions;
let percentages;

if (document.cookie == ""){
  answeredQuestions = new Array(translations.length).fill(0);
  correctQuestions = new Array(translations.length).fill(0);
  percentages = new Array(translations.length).fill(0);
} else {
  answeredQuestions = document.cookie.split(`answered=`).pop().split(';')[0].split(",");
  correctQuestions = document.cookie.split(`; correct=`).pop().split(';')[0].split(",");
  percentages = document.cookie.split(`; percentages=`).pop().split(';')[0].split(",");
}

if (percentages.includes("NaN") || translations.length != answeredQuestions.length) {
  answeredQuestions = new Array(translations.length).fill(0);
  correctQuestions = new Array(translations.length).fill(0);
  percentages = new Array(translations.length).fill(0);
  document.cookie = "answered=" + answeredQuestions.toString() + "; expires=Thu, 31 Oct 2024 12:00:00 UTC";
  document.cookie = "correct=" + correctQuestions.toString() + "; expires=Thu, 31 Oct 2024 12:00:00 UTC";
  document.cookie = "percentages=" + percentages.toString() + "; expires=Thu, 31 Oct 2024 12:00:00 UTC";
}
updateScreen();

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    updateScreen();
  }
});

function updateScreen() {
  if (stage == 0) {
    resetButtons();
    nextQuestion();
    stage++;
  } else if (stage == 1) {
    showAnswer();
  } else if (stage == 3) {
    stage = 0;
  }
}

function nextQuestion() {
  let questionType = Math.random() * 20;
  if (questionType < 10){
    questionNumber = Math.round(Math.random() * translations.length);
    questionTypeEl.style.setProperty("--word-color", "var(--lime)");
    questionTypeEl.childNodes[1].src = "random.svg";
    questionTypeEl.childNodes[3].innerHTML = "Random";
  } else if (questionType < 15){
    let lowestPercentages = findLowest(percentages);
    questionNumber = lowestPercentages[Math.round(Math.random() * lowestPercentages.length)];
    questionTypeEl.style.setProperty("--word-color", "var(--red)");
    questionTypeEl.childNodes[1].src = "exclamation-mark.svg";
    questionTypeEl.childNodes[3].innerHTML = "Low Accuracy";
  }  else if (questionType < 19){
    let leastAsked = findLowest(answeredQuestions);
    questionNumber = leastAsked[Math.round(Math.random() * leastAsked.length)];
    questionTypeEl.style.setProperty("--word-color", "var(--orange)");
    questionTypeEl.childNodes[1].src = "eye-closed.svg";
    questionTypeEl.childNodes[3].innerHTML = "Infrequent";
  } else {
    questionNumber = Math.round(Math.random() * (translations.length - 233)) + 233;
    questionTypeEl.style.setProperty("--word-color", "var(--light-blue)");
    questionTypeEl.childNodes[1].src = "paragraph.svg";
    questionTypeEl.childNodes[3].innerHTML = "Longer Answer";
  }
  if(questionNumber > 233) {
    answerText.style.fontSize = "1.5rem"
  } else {
    answerText.style.fontSize = "2rem"
  }
  question = translations[questionNumber];
  englishOrKorean = Math.round(Math.random());
  if (questionNumber < 38 || questionNumber == 233 || questionNumber == 239) {
    belt("white");
  } else if (questionNumber < 60 || questionNumber == 234 || questionNumber == 240) {
    belt("white","yellow");
  } else if (questionNumber < 72 || questionNumber == 241) {
    belt("yellow");
  } else if (questionNumber < 90 || questionNumber == 235 || questionNumber == 242) {
    belt("yellow","green");
  } else if (questionNumber < 113 || questionNumber == 243) {
    belt("green");
  } else if (questionNumber < 132 || questionNumber == 236 || questionNumber == 244) {
    belt("green","blue");
  } else if (questionNumber < 163 || questionNumber == 245) {
    belt("blue");
  } else if (questionNumber < 177 || questionNumber == 237 || questionNumber == 246) {
    belt("blue","red");
  } else if (questionNumber < 194 || questionNumber == 247) {
    belt("red");
  } else if (questionNumber < 207 || questionNumber == 238 || questionNumber == 248) {
    belt("red","black");
  } else {
    belt("black");
  }
  
  if(questionNumber > 232) {
    englishOrKorean = 0;
  }
  root.style.setProperty("--opacity", "0");
  root.style.setProperty("--transition-time", "0s");
  questionText.innerHTML = question[englishOrKorean];
  questionText.innerHTML = question[englishOrKorean];
  answerText.innerHTML = question[1 - englishOrKorean];
}

function showAnswer() {
  root.style.setProperty("--transition-time", "1s");
  root.style.setProperty("--opacity", "1");
  stage = 2;
}

function answer(correct, buttonPressed) {
  parent = buttonPressed.parentElement;
  let oldPercentage = percentages[questionNumber];
  answeredQuestions[questionNumber] = parseInt(answeredQuestions[questionNumber]) + 1;
  if (stage == 2) {
    let otherButton;
    if (correct) {
      otherButton = document.querySelector(".wrong");
      stats.classList.add("up");
      correctQuestions[questionNumber] = parseInt(correctQuestions[questionNumber]) + 1;
      let percent = Math.floor(100 * correctQuestions[questionNumber] / answeredQuestions[questionNumber]);
      percentages[questionNumber] = percent;
      topPercentage.innerHTML = percent + "%";
      bottomPercentage.innerHTML = oldPercentage + "%";
    } else {
      otherButton = document.querySelector(".right");
      parent.style.flexDirection = "row-reverse";
      let percent = Math.floor(100 * correctQuestions[questionNumber] / answeredQuestions[questionNumber]);
      percentages[questionNumber] = percent;
      topPercentage.innerHTML = oldPercentage + "%";
      bottomPercentage.innerHTML =  percent + "%";
    }
    otherButton.style.display = "none";
    stats.style.display = "grid";
    pressedEffect(buttonPressed)
    stage = 3;
    document.cookie = "answered=" + answeredQuestions.toString() + "; expires=Thu, 31 Oct 2024 12:00:00 UTC";
    document.cookie = "correct=" + correctQuestions.toString() + "; expires=Thu, 31 Oct 2024 12:00:00 UTC";
    document.cookie = "percentages=" + percentages.toString() + "; expires=Thu, 31 Oct 2024 12:00:00 UTC";
  }
}
function pressedEffect(buttonPressed) {
  buttonPressed.classList.add("selected");
}

function resetButtons() {
  let parent = document.querySelector(".buttons");
  parent.style.flexDirection = "row";
  button = document.querySelector(".wrong");
  button.style.display = "grid";
  button.classList.remove("selected");
  button = document.querySelector(".right");
  button.classList.remove("selected");
  button.style.display = "grid";
  stats.style.display = "none";
  stats.classList.remove("up");
}


function findLowest(array) {
  let lowest = 100;
  let output = [] 
  for (i in array){
    if(array[i] < lowest) {
      output = [];
      output.push(i)
      lowest = array[i];
    } else if(array[i] == lowest) {
      output.push(i)
    }
  }
  return output;
}

function belt(main, tag) {
  root.style.setProperty("--main",`var(--${main})`);
  if(tag){
    root.style.setProperty("--tag",`var(--${tag})`);
  } else {
    root.style.setProperty("--tag",`var(--${main})`);
  }
}