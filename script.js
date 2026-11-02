// ===== 1. STATE: variables that remember what the player did =====
var playerName = "";
var step = 1;               // 1 = path, 2 = wolf, 3 = ending
var onPath = true;          // did the player stay on the path?
var pickedFlowers = false;  // did the player pick flowers?
var sharedCookie = false;   // did the player share a cookie with the wolf?
var toldSecret = false;     // did the player tell the wolf where Grandma lives?
var kindness = 0;           // goes up when the player is kind
var endingsFound = [];      // remembers which endings have been seen


// ===== 2. Grab elements from the page (DOM) =====
var nameScreen = document.getElementById("name-screen");
var nameInput = document.getElementById("name-input");
var startBtn = document.getElementById("start-btn");
var game = document.getElementById("game");
var sceneImage = document.getElementById("scene-image");
var sceneTitle = document.getElementById("scene-title");
var sceneText = document.getElementById("scene-text");
var choicesBox = document.getElementById("choices");
var restartBtn = document.getElementById("restart-btn");


// ===== 3. Helper functions =====
function updateStats() {
  document.getElementById("stat-name").textContent = playerName;

  // Show one heart for each point of kindness
  var hearts = "";
  for (var i = 0; i < kindness; i++) {
    hearts = hearts + "\u2764\uFE0F";
  }
  if (kindness === 0) {
    hearts = "none yet";
  }
  document.getElementById("stat-kindness").textContent = hearts;

  if (onPath) {
    document.getElementById("stat-path").textContent = "on the path";
  } else {
    document.getElementById("stat-path").textContent = "in the flowers";
  }

  document.getElementById("stat-endings").textContent = endingsFound.length + " / 3";
}

function clearChoices() {
  choicesBox.innerHTML = "";
}

function addChoice(label, action) {
  var button = document.createElement("button");
  button.textContent = label;
  button.addEventListener("click", action);
  choicesBox.appendChild(button);
}


// ===== 4. Scene 1: the path =====
function showPathScene() {
  document.body.className = "mood-play";
  sceneImage.src = "images/girl.svg";
  sceneImage.alt = "Little Red Riding Hood walking down a sunny path with a basket";
  sceneTitle.textContent = "Scene 1: The Path";
  sceneText.textContent = "Hi, " + playerName + "! You are taking cookies to Grandma's cottage. " +
    "The path splits: one way is the safe path, and the other leads through a field of pretty flowers.";

  clearChoices();
  addChoice("Stay on the path", function () {
    onPath = true;
    step = 2;
    showScene();
  });
  addChoice("Pick flowers for Grandma", function () {
    onPath = false;
    pickedFlowers = true;
    kindness = kindness + 1;
    step = 2;
    showScene();
  });
}


// ===== 5. Scene 2: the wolf (the text depends on the earlier choice) =====
function showWolfScene() {
  sceneImage.src = "images/wolf.svg";
  sceneImage.alt = "A cute gray wolf with big golden eyes in a dark forest";
  sceneTitle.textContent = "Scene 2: A Stranger";

  if (pickedFlowers) {
    sceneText.textContent = "A wolf peeks out from the trees. \"What pretty flowers, " +
      playerName + "! Where are you going?\"";
  } else {
    sceneText.textContent = "A wolf steps onto the path. \"Good thing you stayed on the path, " +
      playerName + "! Where are you going?\"";
  }

  clearChoices();
  addChoice("Tell him where Grandma lives", function () {
    toldSecret = true;
    step = 3;
    showScene();
  });
  addChoice("Share a cookie with him", function () {
    sharedCookie = true;
    kindness = kindness + 1;
    step = 3;
    showScene();
  });
  addChoice("Politely say goodbye and keep walking", function () {
    step = 3;
    showScene();
  });
}


// ===== 6. Scene 3: the ending (decided with if / else if / else) =====
function showEnding() {
  var title = "";
  var text = "";
  var image = "images/cottage.svg";
  var mood = "";
  var endingNumber = 0;

  if (toldSecret) {
    endingNumber = 1;
    title = "Ending 1: The Warning";
    mood = "mood-danger";
    text = "You told the wolf where Grandma lives. When you reach the cottage, " +
      playerName + ", the door is already wide open... Never share secrets with strangers!";
    if (pickedFlowers) {
      text = text + " Your pretty flowers drop to the ground.";
    }
  } else if (sharedCookie) {
    endingNumber = 2;
    title = "Ending 2: A New Friend";
    mood = "mood-friend";
    image = "images/wolf.svg";
    text = "The wolf was so surprised by your kindness that he forgot to be scary. " +
      "He walks you to the cottage, and Grandma invites him in for soup.";
    if (pickedFlowers) {
      text = text + " She loves your flowers too!";
    }
  } else {
    endingNumber = 3;
    title = "Ending 3: Safe and Smart";
    mood = "mood-safe";
    if (onPath) {
      text = "You kept your secret and stayed on the path. You reach Grandma's cottage right on time, and she gives you a big hug.";
    } else {
      text = "You kept your secret, but the flowers made you a little late. Grandma is so happy to see you anyway!";
    }
  }

  // Remember this ending if it is new
  if (endingsFound.indexOf(endingNumber) === -1) {
    endingsFound.push(endingNumber);
  }

  document.body.className = mood;
  sceneImage.src = image;
  sceneImage.alt = title;
  sceneTitle.textContent = title;
  sceneText.textContent = text;

  clearChoices();
  restartBtn.classList.remove("hidden");
}


// ===== 7. Decide which scene to show, based on the current step =====
function showScene() {
  if (step === 1) {
    showPathScene();
  } else if (step === 2) {
    showWolfScene();
  } else {
    showEnding();
  }
  updateStats();
}


// ===== 8. Start and restart =====
function startGame() {
  playerName = nameInput.value.trim();
  if (playerName === "") {
    playerName = "Little Red";   // default if the box is empty
  }
  nameScreen.classList.add("hidden");
  game.classList.remove("hidden");
  step = 1;
  showScene();
}

function restartGame() {
  // Reset the story state (but keep the name and the endings found)
  step = 1;
  onPath = true;
  pickedFlowers = false;
  sharedCookie = false;
  toldSecret = false;
  kindness = 0;
  restartBtn.classList.add("hidden");
  showScene();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
nameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    startGame();
  }
});
