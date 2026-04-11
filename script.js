// capturing the main elements from the page 
const formEl = document.getElementById("searchForm"); 
const inputEl = document.getElementById("searchInputBox"); 
const errorEl = document.getElementById("errorBanner"); 
const wordEl = document.getElementById("displayWord"); 
const phoneticEl = document.getElementById("phoneticText"); 
const audioEl = document.getElementById("pronunciationAudio"); 
const defsList = document.getElementById("definitions"); 
const synonymEl = document.getElementById("synonymOutput"); 

// Form submit event listener to handle dictornary search action
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = inputEl.value.trim();

  // validaion to check for user input
  if (!query) {
    errorEl.textContent = "Field is Empty. Type a word to search.";
    clearOutput();
    return;
  }

  // reseting state before fetching
  errorEl.textContent = "";
  clearOutput();

  // fetching data from dictionary API
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Word not found.");
      }
      return res.json();
    })
    .then((data) => {
      // take the first result
      renderWord(data[0]);
    })
    .catch((err) => {
      errorEl.textContent = err.message;
    });
});

// Page update with API data
function renderWord(entry) {
  wordEl.textContent = entry.word || "";

  // phonetic text
  const phoneticObj = entry.phonetics.find(p => p.text);
  phoneticEl.textContent = phoneticObj ? phoneticObj.text : "No phonetic info";

  // pronounciation audio
  const audioObj = entry.phonetics.find(p => p.audio);
  if (audioObj && audioObj.audio) {
    audioEl.src = audioObj.audio;
    audioEl.style.display = "block";
  } else {
    audioEl.style.display = "none";
  }

  // definitions
  defsList.innerHTML = "";
  entry.meanings.forEach((meaning) => {
    meaning.definitions.forEach((def) => {
      const li = document.createElement("li");
      li.textContent = `${meaning.partOfSpeech}: ${def.definition}`;
      defsList.appendChild(li);
    });
  });

  // synonyms
  const syns = entry.meanings[0]?.synonyms || [];
  synonymEl.textContent = syns.length > 0 ? "Synonyms: " + syns.join(", ") : "No synonyms found";
}

// to reset page
function clearOutput() {
  wordEl.textContent = "";
  phoneticEl.textContent = "";
  defsList.innerHTML = "";
  synonymEl.textContent = "";
  audioEl.style.display = "none";
}