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
  getAllQuesFromServer(function (allQuesStoredInServer) {
    clearLeftDivQuesPanel();

    if (searchText) {
      let filteredQues = allQuesStoredInServer.filter(function (ques) {
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
      allQuesStoredInServer.forEach(function (ques) {
        appendQuesToLeftDivQuesPanel(ques);
      });
    }
  });
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
  getAllQuesFromServer(function (allQuesStoredInServer) {
    //* sort all ques aq to favourite
    allQuesStoredInServer = allQuesStoredInServer.sort(function (currentQues) {
      if (currentQues.isFavourite) {
        return -1;
      }

      return 1;
    });

    //* add all ques to left div ques panel
    allQuesStoredInServer.forEach(function (question) {
      appendQuesToLeftDivQuesPanel(question);
    });
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
    isFavourite: false,
  };

  if (question.subject !== "" && question.description !== "") {
    addNewQuesInServer(question, function () {
      appendQuesToLeftDivQuesPanel(question);
      clearRightDivQuesForm();
    });
  }
}

//! append question to left div question panel
function appendQuesToLeftDivQuesPanel(question) {
  const quesDivNode = document.createElement("div");
  const quesSubjectNode = document.createElement("h2");
  const quesDescriptionNode = document.createElement("p");
  const quesUpvotesNode = document.createElement("p");
  const quesDownvotesNode = document.createElement("p");
  const createdAtNode = document.createElement("p");
  const timestampNode = document.createElement("p");
  const addToFavouriteNode = document.createElement("button");

  quesDivNode.setAttribute("id", question.subject);

  quesSubjectNode.innerHTML = question.subject;
  quesDescriptionNode.innerHTML = question.description;
  quesUpvotesNode.innerHTML = "Upvotes: " + question.upvotes;
  quesDownvotesNode.innerHTML = "Downvotes: " + question.downvotes;
  createdAtNode.innerHTML =
    "Created At: " + new Date(question.createdAt).toLocaleString();
  timestampNode.innerHTML =
    "Created: " +
    updateAndConvertTime(timestampNode)(question.createdAt) +
    " ago ";
  if (question.isFavourite) {
    addToFavouriteNode.innerHTML = "Remove From Favourites";
  } else {
    addToFavouriteNode.innerHTML = "Add To Favourites";
  }

  quesDivNode.appendChild(quesSubjectNode);
  quesDivNode.appendChild(quesDescriptionNode);
  quesDivNode.appendChild(quesUpvotesNode);
  quesDivNode.appendChild(quesDownvotesNode);
  quesDivNode.appendChild(createdAtNode);
  quesDivNode.appendChild(timestampNode);
  quesDivNode.appendChild(addToFavouriteNode);

  leftDivQuesPanelNode.appendChild(quesDivNode);

  //* adding click event listener on quesDivNode
  quesDivNode.onclick = questionClickHandler(question);

  //* adding click event listener on addToFavouriteNode
  addToFavouriteNode.addEventListener(
    "click",
    toggleFavouriteQuesHandler(question)
  );
}

//! toggleFavouriteQuesHandler
function toggleFavouriteQuesHandler(question) {
  return function () {
    question.isFavourite = !question.isFavourite;
    updateQuesInServer(question);
    updateQuestionUI(question);
  };
}

//! setInterval & Update time
function updateAndConvertTime(element) {
  return function (time) {
    setInterval(function () {
      element.innerHTML = "Created: " + timePassedSinceCreation(time) + " ago ";
    }, 1000);

    return timePassedSinceCreation(time);
  };
}

//! calculate time passed since creation of question
function timePassedSinceCreation(creationTime) {
  let currentTime = Date.now();
  let timePassed = currentTime - new Date(creationTime).getTime();

  let secPassed = parseInt(timePassed / 1000);
  let minPassed = parseInt(secPassed / 60);
  let hourPassed = parseInt(minPassed / 60);

  return (
    hourPassed + " hours " + minPassed + " minutes " + secPassed + " seconds"
  );
}

//! clear question form
function clearRightDivQuesForm() {
  questionSubjectNode.value = "";
  questionDescriptionNode.value = "";
}

//! clear response form
function clearResponseForm() {
  commentorNameNode.value = "";
  commentDescriptionNode.value = "";
}

//! listen for click on question and display in right panel
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
    updateQuesInServer(question);
    updateQuestionUI(question);
  };
}

//! downvote ques
function quesDownvoteHandler(question) {
  return function () {
    question.downvotes++;
    updateQuesInServer(question);
    updateQuestionUI(question);
  };
}

//! update selected question UI after upvote/downvote
function updateQuestionUI(question) {
  //* get question container from DOM
  let quesContainerNode = document.getElementById(question.subject);

  quesContainerNode.childNodes[2].innerHTML = "Upvotes: " + question.upvotes;
  quesContainerNode.childNodes[3].innerHTML =
    "Downvotes: " + question.downvotes;
  if (question.isFavourite) {
    quesContainerNode.childNodes[6].innerHTML = "Remove From Favourites";
  } else {
    quesContainerNode.childNodes[6].innerHTML = "Add To Favourites";
  }
}

//! listen for click on resolve btn
function quesResolveHandler(selectedQuestion) {
  return function () {
    deleteQuesFromServer(selectedQuestion);
    removeQuesFromLeftDivQuesPanel(selectedQuestion);
    hideResponseForm();
    displayQuestionForm();
  };
}

//! remove ques form left div ques panel
function removeQuesFromLeftDivQuesPanel(selectedQuestion) {
  let quesContainerNode = document.getElementById(selectedQuestion.subject);

  leftDivQuesPanelNode.removeChild(quesContainerNode);
}

//! handler for add comment button
function addCommentHandler(question) {
  return function () {
    let response = {
      name: commentorNameNode.value,
      description: commentDescriptionNode.value,
    };

    if (response.name !== "" && response.description !== "") {
      saveResponseInServer(question, response, function () {
        appendResponseToRightDivResponsePanelNode(response);
        clearResponseForm();
      });
    }
  };
}

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

//! Function to Generate Unique ID
function generateUniqueId() {
  return JSON.stringify(Math.floor(Math.random() * Date.now()));
}

//# CRUD in Server

//! get all ques from server
function getAllQuesFromServer(onResponseFromServer) {
  let request = new XMLHttpRequest();
  request.open("GET", "https://storage.codequotient.com/data/get");
  request.send();
  request.addEventListener("load", function (event) {
    let getRequestResponseData = JSON.parse(event.target.responseText);
    let allQuesStoredInServer = JSON.parse(getRequestResponseData.data);
    console.log("All Ques Retrieved from Server Successfully");
    onResponseFromServer(allQuesStoredInServer);
  });
}

//! add new ques in server
function addNewQuesInServer(question, onQuesSaveInServer) {
  //* get all qiestions first and push the new qurstion and then store again in server the updated array of questions
  getAllQuesFromServer(function (allQuesStoredInServer) {
    allQuesStoredInServer.push(question);

    let postObj = {
      data: JSON.stringify(allQuesStoredInServer),
    };

    let postData = JSON.stringify(postObj);

    let request = new XMLHttpRequest();
    request.open("POST", "https://storage.codequotient.com/data/save");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData);
    request.addEventListener("load", function (event) {
      console.log(
        "New Ques Added in Server Successfully: ",
        JSON.parse(event.target.responseText)
      );
      onQuesSaveInServer();
    });
  });
}

//! save all ques in server
function saveAllQuesInServer(allQues) {
  let postObj = {
    data: JSON.stringify(allQues),
  };

  let postData = JSON.stringify(postObj);

  let request = new XMLHttpRequest();
  request.open("POST", "https://storage.codequotient.com/data/save");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(postData);
  request.addEventListener("load", function (event) {
    console.log(
      "Updated Set of Ques Saved in Server Successfully: ",
      JSON.parse(event.target.responseText)
    );
  });
}

//! save response in server
function saveResponseInServer(
  selectedQuestion,
  response,
  onResponseSaveInServer
) {
  //* get all qiestions first and push the updated qurstion and then store again in storage
  console.log("sel ques", selectedQuestion);
  getAllQuesFromServer(function (allQuesStoredInServer) {
    console.log("all ques prev", allQuesStoredInServer);

    let updatedQues = allQuesStoredInServer.map(function (ques) {
      if (ques.subject === selectedQuestion.subject) {
        ques.responses.push(response);
      }
      return ques;
    });

    console.log("all ques now", updatedQues);

    saveAllQuesInServer(updatedQues);
    onResponseSaveInServer();
  });
}

//! update ques in server
function updateQuesInServer(updatedQuestion) {
  getAllQuesFromServer(function (allQuesStoredInServer) {
    let revisedQuestions = allQuesStoredInServer.map(function (ques) {
      if (updatedQuestion.subject === ques.subject) {
        return updatedQuestion;
      }

      return ques;
    });

    saveAllQuesInServer(revisedQuestions);
  });
}

//! remove ques from server
function deleteQuesFromServer(selectedQuestion) {
  getAllQuesFromServer(function (allQuesStoredInServer) {
    let revisedQuestions = allQuesStoredInServer.filter(function (ques) {
      if (selectedQuestion.subject === ques.subject) {
        return false;
      }
      return true;
    });

    saveAllQuesInServer(revisedQuestions);
  });
}
