# Dynamic Speech Recognition and Pose-Following Text Animation

This project is an interactive visual experience that combines real-time speech recognition and body pose detection to create animated text. When a user speaks, the recognized words appear as animated text on the screen, following the user’s right wrist. Each text snippet has its own unique animations, including pulsing, fading, and oscillating effects, creating a lively and engaging display.

**Features**

* Real-time Speech Recognition: Captures and displays spoken words as text.
* Pose Detection: Tracks body pose to make text follow the user’s right wrist.
* Text Animations:
  -  Fading: Text fades in when it appears and fades out after a few seconds.
  -  Pulsing: Text gently scales up and down, creating a pulsing effect.
  -  Oscillating: Text oscillates horizontally around its target position, giving a floating effect.
* Dynamic Colors: Each text snippet appears in a unique, randomly generated color.

**Technologies Used**

* `p5.js`: A JavaScript library for creative coding.
* `ml5.js`: A machine learning library for the web, used here for real-time pose detection.
* `p5.speech.js`: A speech library for p5.js, providing speech recognition and synthesis capabilities.

**Installation and Setup**

1. Clone this repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```
2. Open the project:

Open `index.html` in a browser to run the project. Ensure you have a working webcam and microphone.
Ensure your environment has a stable internet connection to load ml5.js, p5.js, and p5.speech.js libraries through CDN.

