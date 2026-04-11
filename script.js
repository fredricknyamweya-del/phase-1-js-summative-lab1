// Select elements from the DOM
const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");

// Event listener for form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const word = input.value.trim();

  // Handle empty input
  if (word === "") {
    errorMessage.textContent = "Please enter a word.";
    result.innerHTML = "";
    return;
  }

  // Fetch data from dictionary API
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Word not found. Please try another word.");
      }
      return response.json();
    })
    .then(function (data) {
      displayData(data[0]);
      errorMessage.textContent = "";
    })
    .catch(function (error) {
      errorMessage.textContent = error.message;
      result.innerHTML = "";
    });
});


// Function to display fetched data on the page
function displayData(data) {
  // Display word
  document.getElementById("word").textContent = data.word;

  // Display pronunciation (fallback if missing)
  const phoneticText = data.phonetics.find(function (p) {
  return p.text;
});

document.getElementById("phonetic").textContent =
  phoneticText ? phoneticText.text : "No pronunciation available";

  // Handle audio
  const audio = document.getElementById("audio");
  const audioSource = data.phonetics.find(function (p) {
    return p.audio;
  });

  if (audioSource) {
    audio.src = audioSource.audio;
    audio.style.display = "block";
  } else {
    audio.style.display = "none";
  }

  // Display definitions
  const definitionsDiv = document.getElementById("definitions");
  definitionsDiv.innerHTML = "";

  data.meanings.forEach(function (meaning) {
    meaning.definitions.forEach(function (def) {
      const p = document.createElement("p");
      p.textContent = `${meaning.partOfSpeech}: ${def.definition}`;
      definitionsDiv.appendChild(p);
    });
  });

  // Display synonyms
  const synonyms = data.meanings[0].synonyms || [];
  document.getElementById("synonyms").textContent =
    synonyms.length > 0
      ? "Synonyms: " + synonyms.join(", ")
      : "No synonyms available";

  // Add highlight effect
  result.classList.add("highlight");
}