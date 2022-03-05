//# Fetching HTML Nodes
const questionSubmitBtnNode = document.getElementById(
  "right-div-question-form-items-submit"
);
const leftDivQuestPanelNode = document.getElementById(
  "left-div-question-panel"
);
const questionSubjectNode = document.getElementById("question-subject");
const questionDescriptionNode = document.getElementById("question-description");
const rightDivQuesFormNode = document.getElementById("right-div-question-form");
const rightDivResponseFormNode = document.getElementById(
  "right-div-question-resolve-form"
);
const rightDivQuesPanelNode = document.getElementById(
  "right-div-question-panel"
);
const upvoteBtnNode = document.getElementById("upvoteBtn");
const downvoteBtnNode = document.getElementById("downvoteBtn");
const resolveBtnNode = document.getElementById("resolveBtn");
const responseNode = document.getElementById("response");
const addResponseNode = document.getElementById("add-response");
const addCommentBtnNode = document.getElementById("addCommentBtn");
const commentorNameNode = document.getElementById("commentorName");
const commentDescriptionNode = document.getElementById("commentDescription");
const rightDivResponsePanel = document.getElementById(
  "right-div-response-panel"
);

// listen to value change

// filter result

// clear all questions

//! display all exixting questions stored in local storage
function onLoad() {
  //* get all ques from local storage
  let quesStoredInLocalStorage = getAllQuesFromLocalStorage();

  //* add all ques to left div ques panel
  quesStoredInLocalStorage.forEach(function (question) {
    appendQuesToLeftDivQuesPanel(question);
  });
}

onLoad();

//! listen for click event on question submit button to create a question
questionSubmitBtnNode.addEventListener("click", questionSubmitHandler);

function questionSubmitHandler(event) {
  event.preventDefault();

  let question = {
    subject: questionSubjectNode.value,
    description: questionDescriptionNode.value,
  };

  appendQuesToLeftDivQuesPanel(question);
  saveQuesToLocalStorage(question);
}

//! save question to local sotrage
function saveQuesToLocalStorage(question) {
  //* get all qiestions first and push the new qurstion and then store again in storage
  let quesStoredInLocalStorage = getAllQuesFromLocalStorage();

  quesStoredInLocalStorage.push(question);

  localStorage.setItem("questions", JSON.stringify(quesStoredInLocalStorage));
}

//! get all questions from local storage
function getAllQuesFromLocalStorage() {
  let allQues = localStorage.getItem("questions");

  if (allQues) {
    allQues = JSON.parse(allQues);
  } else {
    allQues = [];
  }

  return allQues;
}

//! append question to left div question panel
function appendQuesToLeftDivQuesPanel(question) {
  const quesDivNode = document.createElement("div");
  const quesSubjectNode = document.createElement("h2");
  const quesDescriptionNode = document.createElement("p");
  const quesUpvotesNode = document.createElement("p");
  const quesDownvotesNode = document.createElement("p");

  quesSubjectNode.innerHTML = question.subject;
  quesDescriptionNode.innerHTML = question.description;
  quesUpvotesNode.innerHTML = "Upvotes: " + "0";
  quesDownvotesNode.innerHTML = "Downvotes: " + "0";

  quesDivNode.appendChild(quesSubjectNode);
  quesDivNode.appendChild(quesDescriptionNode);
  quesDivNode.appendChild(quesUpvotesNode);
  quesDivNode.appendChild(quesDownvotesNode);

  leftDivQuestPanelNode.appendChild(quesDivNode);

  //* adding click event listener on quesDivNode
  quesDivNode.addEventListener("click", questionClickHandler(question));
}

// clear question form

// listen for click on question and display in right pane
function questionClickHandler(question) {
  //* using closure so we can access question variable
  return function () {
    //* hide right div question form
    hideQuestionForm();

    //* clear previous question details
    rightDivQuesPanelNode.innerHTML = "";

    //* display resposne form
    displayResponseForm();

    //* display question details in right div question panel
    appendQuesToRightDivQuesPanel(question);

    //* show all previous responses

    //* add click event listener on response, upvote & downvote button
    resolveBtnNode.onclick = quesResolveHandler;

    //* add click event listener on add comment button
    addCommentBtnNode.onclick = addCommentHandler;
  };
}

// upvotes

//downVote

// update question UI

//* get question container from DOM

//! listen for click on resolve button
function quesResolveHandler() {
  addResponseNode.style.display = "block";
}

function addCommentHandler() {
  let response = {
    name: commentorNameNode.value,
    description: commentDescriptionNode.value,
  };

  console.log(response);

  appendResponseToRightDivResponsePanel(response);
}

//! append response in right div response panel
function appendResponseToRightDivResponsePanel(response) {
  const commentDivNode = document.createElement("div");
  const commentorNameNode = document.createElement("h2");
  const commentDescriptionNode = document.createElement("p");

  commentorNameNode.innerHTML = response.name;
  commentDescriptionNode.innerHTML = response.description;

  commentDivNode.appendChild(commentorNameNode);
  commentDivNode.appendChild(commentDescriptionNode);

  rightDivResponsePanel.appendChild(commentDivNode);
}

//! hide question form
function hideQuestionForm() {
  rightDivQuesFormNode.style.display = "none";
}

//! display resposne form
function displayResponseForm() {
  rightDivResponseFormNode.style.display = "block";
}

//! display question in right div ques panel node
function appendQuesToRightDivQuesPanel(question) {
  const quesDivNode = document.createElement("div");
  const quesSubjectNode = document.createElement("h2");
  const quesDescriptionNode = document.createElement("p");

  quesSubjectNode.innerHTML = question.subject;
  quesDescriptionNode.innerHTML = question.description;

  quesDivNode.appendChild(quesSubjectNode);
  quesDivNode.appendChild(quesDescriptionNode);

  rightDivQuesPanelNode.appendChild(quesDivNode);
}

// update question

// save response
