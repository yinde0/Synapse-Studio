/*
 * This project incorporates speech recognition using p5.speech.js and pose detection using ml5.js.
 * 
 * p5.speech.js:
 * Source: https://editor.p5js.org/ziyu/sketches/rJCJtGTMx
 * Developed by Ziyu and contributors at IDM NYU.
 * Learn more at: https://idmnyu.github.io/p5.js-speech/
 * 
 * ml5.js:
 * A friendly machine learning library for the web.
 * Official website: https://ml5js.org/
 * ml5.js GitHub repository: https://github.com/ml5js/ml5-library
 */

let video;
let bodyPose;
let poses = [];
let connections;

let myRec = new p5.SpeechRec(); // Speech recognition object
let myVoice = new p5.Speech(); // Speech synthesis object

myRec.continuous = true; // Enable continuous recognition
let recognizedTexts = []; // Array to store recognized speech text snippets
let textPositions = []; // Array to store positions for each text
let targetPositions = []; // Array for target positions near the wrist
let transitionSpeeds = []; // Speed of movement for each text
let textColors = []; //Array to store colors for each text
let textAlphas = []; // Array to store opacity for each text
let textScales = []; // Array to store scale factors for pulsing effect

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);

  // Initialize video capture and hide the HTML element
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);

  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
  
  // Set up speech recognition and start listening
  myRec.onResult = showResult;
  myRec.start();

  // Provide an initial spoken prompt
  myVoice.speak("say something");
}

function draw() {
  // Draw the webcam video as the background
  image(video, 0, 0, width, height);

  // Draw the skeleton connections
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];

      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(255, 0, 0);
        strokeWeight(2);
        // line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }

  // Find right wrist position
  let rightWristPos = null;
  if (poses.length > 0) {
    let pose = poses[0];
    let rightWrist = pose.keypoints.find(kp => kp.name === "right_wrist");
    if (rightWrist && rightWrist.confidence > 0.1) {
      rightWristPos = createVector(rightWrist.x, rightWrist.y);
    }
  }

  // Smoothly move text positions towards their individual target positions
  for (let i = recognizedTexts.length - 1; i >= 0; i--) {
    let transitionSpeed = transitionSpeeds[i];
    let textData = recognizedTexts[i];

    textPositions[i].x += (targetPositions[i].x - textPositions[i].x) * transitionSpeed;
    textPositions[i].y += (targetPositions[i].y - textPositions[i].y) * transitionSpeed;
    
    
    // Oscillate position around the target
    let oscillation = sin(frameCount * 0.05 + i) * 10; // Oscillate horizontally by 10 pixels
    let posX = textPositions[i].x + oscillation;

    // Apply fading effect
    if (textData.displayTime < 2000) {
      textAlphas[i] = map(textData.displayTime, 0, 2000, 0, 255); // Fade in
    } else if (textData.displayTime > 3000) {
      textAlphas[i] = map(textData.displayTime, 3000, 5000, 255, 0); // Fade out
    }

    // Apply pulsing effect
    textScales[i] = 1 + 0.1 * sin(frameCount * 0.1 + i); // Slightly scale up and down

    // Draw each text with its animations
    push();
    translate(posX, textPositions[i].y);
    scale(textScales[i]); // Apply pulsing
    fill(textColors[i], textAlphas[i]); // Apply color and fading
    textSize(18);
    textAlign(CENTER, CENTER);
    text(textData.text, 0, 0);
    pop();

    

    // // Display each text at its position
    // fill(textColors[i]);   //initially just 255
    // textSize(20);
    // textAlign(CENTER, CENTER);
    // text(textData.text, textPositions[i].x, textPositions[i].y);
    
    // Update display time and check if it should be removed
    textData.displayTime += deltaTime; // Increment by frame duration
    if (textData.displayTime > 5000) { // 5000 ms = 5 seconds
      // Remove text data if display time exceeds threshold
      recognizedTexts.splice(i, 1);
      textPositions.splice(i, 1);
      targetPositions.splice(i, 1);
      transitionSpeeds.splice(i, 1);
      textColors.splice(i,1);
      textAlphas.splice(i, 1);
      textScales.splice(i, 1);
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  poses = results;
}

// Callback function for speech recognition results
function showResult() {
  if (myRec.resultValue === true) {
    let newText = myRec.resultString; // Store the recognized speech
    recognizedTexts.push({ text: newText, displayTime: 0 }); // Add new text to array with displayTime

    // Initialize the position and target for the new text
    textPositions.push(createVector(random(width), random(height)));

    // Set the initial target to the current wrist position or center if not available
    if (poses.length > 0) {
      let pose = poses[0];
      let rightWrist = pose.keypoints.find(kp => kp.name === "right_wrist");
      if (rightWrist && rightWrist.confidence > 0.1) {
        targetPositions.push(createVector(rightWrist.x, rightWrist.y));
      } else {
        targetPositions.push(createVector(width / 2, height / 2)); // Center as a fallback
      }
    } else {
      targetPositions.push(createVector(width / 2, height / 2)); // Center as a fallback
    }

    transitionSpeeds.push(random(0.02, 0.05)); // Assign a random transition speed
    
    //Generate a random color for this text
    let randomColor = color(random(255), random(255), random(255));
    textColors.push(randomColor);
    textAlphas.push(0); // Start with 0 opacity for fade-in effect
    textScales.push(1); // Start with default scale
    
    console.log(newText);
  }
}