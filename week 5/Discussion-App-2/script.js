//# Fetching HTML Nodes
const questionSubmitBtnNode = document.getElementById(
  "right-div-question-form-items-submit"
);
const leftDivQuesPanelNode = document.getElementById("left-div-question-panel");
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
const rightDivResponsePanelNode = document.getElementById(
  "right-div-response-panel"
);
const newQuesFormBtnNode = document.getElementById("newQuesFormBtn");
const searchQuesNode = document.getElementById("searchQues");

//! listen for click on new ques form btn
newQuesFormBtnNode.addEventListener("click", newQuesFormHandler);

function newQuesFormHandler() {
  hideResponseForm();
  displayQuestionForm();
}

//! listen to value change on search question input
searchQuesNode.addEventListener("keyup", function (event) {
  filterQues(event.target.value);
});

//! filter result according to search text
function filterQues(searchText) {
  let allQues = getAllQuesFromLocalStorage();

  if (searchText) {
    clearLeftDivQuesPanel();

    let filteredQues = allQues.filter(function (ques) {
      if (ques.subject.includes(searchText)) {
        return true;
      }
    });

    if (filteredQues.length) {
      filteredQues.forEach(function (ques) {
        appendQuesToLeftDivQuesPanel(ques);
      });
    } else {
      printNoMatchFound();
    }
  } else {
    clearLeftDivQuesPanel();

    allQues.forEach(function (ques) {
      appendQuesToLeftDivQuesPanel(ques);
    });
  }
}

//! clear all questions in left div ques panel
function clearLeftDivQuesPanel() {
  leftDivQuesPanelNode.innerHTML = "";
}

//! print No match found if no ques matches search text
function printNoMatchFound() {
  let msgNode = document.createElement("h2");
  msgNode.innerHTML = "No Matches Found!";
  leftDivQuesPanelNode.appendChild(msgNode);
}

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
    responses: [],
    upvotes: 0,
    downvotes: 0,
    createdAt: Date.now() /* for time in ms */,
  };

  appendQuesToLeftDivQuesPanel(question);
  saveQuesToLocalStorage(question);
}

//! save question to local storage
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
  const createdAtNode = document.createElement("p");

  quesDivNode.setAttribute("id", question.subject);

  quesSubjectNode.innerHTML = question.subject;
  quesDescriptionNode.innerHTML = question.description;
  quesUpvotesNode.innerHTML = "Upvotes: " + question.upvotes;
  quesDownvotesNode.innerHTML = "Downvotes: " + question.downvotes;
  createdAtNode.innerHTML =
    "Created At: " + new Date(question.createdAt).toLocaleString();

  quesDivNode.appendChild(quesSubjectNode);
  quesDivNode.appendChild(quesDescriptionNode);
  quesDivNode.appendChild(quesUpvotesNode);
  quesDivNode.appendChild(quesDownvotesNode);
  quesDivNode.appendChild(createdAtNode);

  leftDivQuesPanelNode.appendChild(quesDivNode);

  //* adding click event listener on quesDivNode
  quesDivNode.onclick = questionClickHandler(question);
}

// clear question form

// listen for click on question and display in right pane
function questionClickHandler(question) {
  //* using closure so we can access question variable
  return function () {
    //* hide right div question form
    hideQuestionForm();

    //* clear previous question details & response details
    rightDivQuesPanelNode.innerHTML = "";
    rightDivResponsePanelNode.innerHTML = "";

    //* display resposne form
    displayResponseForm();

    //* display question details in right div question panel
    appendQuesToRightDivQuesPanel(question);

    //* show all previous responses
    // setupResponsePanel(question);

    let responses = question.responses;
    responses.forEach(function (response) {
      appendResponseToRightDivResponsePanelNode(response);
    });

    //* add click event listener on response, upvote & downvote button
    resolveBtnNode.onclick = quesResolveHandler(question);
    upvoteBtnNode.onclick = quesUpvoteHandler(question);
    downvoteBtnNode.onclick = quesDownvoteHandler(question);

    //* add click event listener on add comment button
    addCommentBtnNode.onclick = addCommentHandler(question);
  };
}

//! upvote ques
function quesUpvoteHandler(question) {
  return function () {
    question.upvotes++;
    updateQuesInLocalStorage(question);
    updateQuestionUI(question);
  };
}

//! downvote ques
function quesDownvoteHandler(question) {
  return function () {
    question.downvotes++;
    updateQuesInLocalStorage(question);
    updateQuestionUI(question);
  };
}

//! update ques in local storage
function updateQuesInLocalStorage(updatedQuestion) {
  let allQues = getAllQuesFromLocalStorage();

  let revisedQuestions = allQues.map(function (ques) {
    if (updatedQuestion.subject === ques.subject) {
      return updatedQuestion;
    }

    return ques;
  });

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

//! update selected question UI after upvote/downvote
function updateQuestionUI(question) {
  //* get question container from DOM
  let quesContainerNode = document.getElementById(question.subject);

  quesContainerNode.childNodes[2].innerHTML = "Upvotes: " + question.upvotes;
  quesContainerNode.childNodes[3].innerHTML =
    "Downvotes: " + question.downvotes;
}

//! listen for click on resolve btn
function quesResolveHandler(selectedQuestion) {
  return function () {
    deleteQuesFromLocalStorage(selectedQuestion);
    removeQuesFromLeftDivQuesPanel(selectedQuestion);
    hideResponseForm();
    displayQuestionForm();
  };
}

//! remove ques from local storage
function deleteQuesFromLocalStorage(selectedQuestion) {
  let allQues = getAllQuesFromLocalStorage();

  let revisedQuestions = allQues.filter(function (ques) {
    if (selectedQuestion.subject === ques.subject) {
      return false;
    }
    return true;
  });

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

//! remove ques form left div ques panel
function removeQuesFromLeftDivQuesPanel(selectedQuestion) {
  let quesContainerNode = document.getElementById(selectedQuestion.subject);

  leftDivQuesPanelNode.removeChild(quesContainerNode);
}

function addCommentHandler(question) {
  return function () {
    let response = {
      name: commentorNameNode.value,
      description: commentDescriptionNode.value,
    };

    // setupResponsePanel(question);

    appendResponseToRightDivResponsePanelNode(response);
    saveResponseInLocalStorage(question, response);
  };
}

// //! add/clear response panel as needed
// function setupResponsePanel(question) {
//   console.log("setup caleld");
//   let responses = question.responses;
//   console.log(responses);
//   if (responses.length == 0) {
//     rightDivResponsePanelNode.innerHTML = "No Responses Submitted!";
//   } else {
//     rightDivResponsePanelNode.innerHTML = "";
//   }
// }

//! append response in right div response panel
function appendResponseToRightDivResponsePanelNode(response) {
  const commentDivNode = document.createElement("div");
  const commentorNameNode = document.createElement("h2");
  const commentDescriptionNode = document.createElement("p");

  commentorNameNode.innerHTML = response.name;
  commentDescriptionNode.innerHTML = response.description;

  commentDivNode.appendChild(commentorNameNode);
  commentDivNode.appendChild(commentDescriptionNode);

  rightDivResponsePanelNode.appendChild(commentDivNode);
}

//! display question form
function displayQuestionForm() {
  rightDivQuesFormNode.style.display = "block";
}

//! hide question form
function hideQuestionForm() {
  rightDivQuesFormNode.style.display = "none";
}

//! display resposne form
function displayResponseForm() {
  rightDivResponseFormNode.style.display = "block";
}

//! hide response form
function hideResponseForm() {
  rightDivResponseFormNode.style.display = "none";
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

//! save response in local storage
function saveResponseInLocalStorage(selectedQuestion, response) {
  //* get all qiestions first and push the updated qurstion and then store again in storage
  let quesStoredInLocalStorage = getAllQuesFromLocalStorage();

  let updatedQues = quesStoredInLocalStorage.map(function (ques) {
    if (ques.title === selectedQuestion.title) {
      ques.responses.push(response);
    }
    return ques;
  });

  localStorage.setItem("questions", JSON.stringify(updatedQues));
}
