const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const word = input.value.trim();

  if (word === "") {
    errorMessage.textContent = "Please enter a word.";
    result.innerHTML = "";
    return;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Word not found");
      }
      return res.json();
    })
    .then(data => {
      displayData(data[0]);
      errorMessage.textContent = "";
    })
    .catch(err => {
      errorMessage.textContent = err.message;
      result.innerHTML = "";
    });
});

function displayData(data) {

  document.getElementById("word").textContent = data.word;

  const phonetic = data.phonetics.find(p => p.text);
  document.getElementById("phonetic").textContent =
    phonetic ? phonetic.text : "No pronunciation available";

  const audio = document.getElementById("audio");
  const audioData = data.phonetics.find(p => p.audio);

  if (audioData) {
    audio.src = audioData.audio;
    audio.style.display = "block";
  } else {
    audio.style.display = "none";
  }

  const definitionsDiv = document.getElementById("definitions");
  definitionsDiv.innerHTML = "";

  data.meanings.forEach(meaning => {
    meaning.definitions.forEach(def => {
      const p = document.createElement("p");
      p.textContent = `${meaning.partOfSpeech}: ${def.definition}`;
      definitionsDiv.appendChild(p);
    });
  });

  const synonyms = data.meanings[0].synonyms || [];
  document.getElementById("synonyms").textContent =
    synonyms.length > 0
      ? "Synonyms: " + synonyms.join(", ")
      : "No synonyms available";

  result.classList.add("highlight");
}