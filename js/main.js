// Init SpeechSynth API
const synth = window.speechSynthesis;

// Set year
document.querySelector("#year").textContent = new Date().getFullYear();

// DOM ELements
const textForm = document.querySelector("form"),
  textInput = document.querySelector("#text-input"),
  voiceSelect = document.querySelector("#voice-select"),
  rate = document.querySelector("#rate"),
  rateValue = document.querySelector("#rate-value"),
  pitch = document.querySelector("#pitch"),
  pitchValue = document.querySelector("#pitch-value"),
  body = document.querySelector("body");

// Init Voices Array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create Option Element
    const option = document.createElement("option");
    // Fill the option with voice and language
    option.textContent = `${voice.name} (${voice.lang})`;

    // Set needed option attribute
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);

    // Append Option
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error("Already Speaking...");
    return;
  }

  if (textInput.value !== "") {
    // Add background animation
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";
    body.style.backgroundPosition = "20% 20%";

    // Get Speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = e => {
      body.style.background = "#141414";
      console.log("Done Speaking...");
    };

    // Speak Error
    speakText.onerror = e => {
      console.error("Something went wrong");
    };

    // Selected Voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // Speak
    synth.speak(speakText);
  }
};

// Event listeners

// Text form submit
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate Value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// Pitch Value change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener("change", e => speak());
