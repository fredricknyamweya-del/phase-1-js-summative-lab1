const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const word = input.value.trim();

  if (word === "") {
    errorMessage.textContent = "Please enter a word.";
    return;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then(data => {
      displayData(data[0]);
      errorMessage.textContent = "";
    })
    .catch(error => {
      errorMessage.textContent = error.message;
      result.innerHTML = "";
    });
});