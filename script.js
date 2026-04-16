// capturing the main elements from the page 
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInputBox");
const errorBanner = document.getElementById("errorBanner");
const wordDisplay = document.getElementById("displayWord");
const phoneticDisplay = document.getElementById("phoneticText");
const audioPlayer = document.getElementById("pronunciationAudio");
const definitionsList = document.getElementById("definitions");
const synonymDisplay = document.getElementById("synonymOutput");

// Form submit event listner to handle dictornary search action
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchWord = input.value.trim();

  // validaion to check for user input
 if (!searchWord) {
    errorBanner.textContent = "Please type a word to search.";
    resetPage();
    return;
  }

  // reseting state before fetching
errorBanner.textContent = "";
  resetPage();

  // fetching data from dictionary API
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Sorry, that word wasn't found.");
      }
      return response.json();
    })
    .then((data) => {
      // Show the first result
      updatePage(data[0]);
    })
    .catch((error) => {
      errorBanner.textContent = error.message;
    });
});

// Page update with API data
function updatePage(entry) {
  wordDisplay.textContent = entry.word || "";

  // texts in phonetics. 
  const phonetic = entry.phonetics.find(p => p.text);
  phoneticDisplay.textContent = phonetic ? phonetic.text : "No phonetic info available";

  // pronounciation of audio's 
 const audio = entry.phonetics.find(p => p.audio);
  if (audio && audio.audio) {
    audioPlayer.src = audio.audio;
    audioPlayer.style.display = "block";
  } else {
    audioPlayer.style.display = "none";
  }

  // definitions
  definitionsList.innerHTML = "";
  entry.meanings.forEach((meaning) => {
    meaning.definitions.forEach((def) => {
      const item = document.createElement("li");
      item.textContent = `${meaning.partOfSpeech}: ${def.definition}`;
      definitionsList.appendChild(item);
    });
  });

  // synonyms
 const synonyms = entry.meanings[0]?.synonyms || [];
  synonymDisplay.textContent = synonyms.length > 0 
    ? "Synonyms: " + synonyms.join(", ") 
    : "No synonyms found";
}
//page resetting function to clear the search result and messages of error
function resetPage() {
  wordDisplay.textContent = "";
  phoneticDisplay.textContent = "";
  definitionsList.innerHTML = "";
  synonymDisplay.textContent = "";
  audioPlayer.style.display = "none";
}