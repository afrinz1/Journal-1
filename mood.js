// mood.js
// Handles mood box popup logic and quotes

const moodQuotes = {
  Happy: [
    "Happiness is not by chance, but by choice.",
    "The purpose of our lives is to be happy.",
    "Happiness is a direction, not a place.",
    "For every minute you are angry you lose sixty seconds of happiness."
  ],
  Sad: [
    "Tears come from the heart and not from the brain.",
    "Sadness flies away on the wings of time.",
    "Every human walks around with a certain kind of sadness."
  ],
  Angry: [
    "For every minute you remain angry, you give up sixty seconds of peace of mind.",
    "Anger is one letter short of danger.",
    "Speak when you are angry and you will make the best speech you will ever regret."
  ],
  Tired: [
    "Rest when you're weary. Refresh and renew yourself.",
    "Fatigue is the best pillow.",
    "Sometimes the most productive thing you can do is rest."
  ],
  Excited: [
    "The excitement of learning separates youth from old age.",
    "Excitement is the more practical synonym for happiness.",
    "Enthusiasm moves the world."
  ],
  Stressed: [
    "It's not stress that kills us, it is our reaction to it.",
    "Give your stress wings and let it fly away.",
    "The greatest weapon against stress is our ability to choose one thought over another."
  ],
  Calm: [
    "Calm mind brings inner strength and self-confidence.",
    "The nearer a man comes to a calm mind, the closer he is to strength.",
    "Keep calm and carry on."
  ]
};

function showMoodPopup(mood) {
  // Remove existing popup if any
  const existing = document.getElementById('mood-popup');
  if (existing) existing.remove();

  // Pick a random quote
  const quotes = moodQuotes[mood] || ["No quote available."];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'mood-popup';
  popup.className = 'mood-popup';
  popup.innerHTML = `<div class="mood-popup-content"><span class="mood-popup-mood">${mood}</span><p>${quote}</p><button class="mood-popup-close">Close</button></div>`;
  document.body.appendChild(popup);

  // Close handler
  popup.querySelector('.mood-popup-close').onclick = () => popup.remove();
  // Remove on outside click
  popup.onclick = (e) => { if (e.target === popup) popup.remove(); };
}

window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.mood-box').forEach(box => {
    box.addEventListener('click', function() {
      showMoodPopup(this.textContent.trim());
    });
  });
});
