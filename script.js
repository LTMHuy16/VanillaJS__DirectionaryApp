const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volumeIcon = wrapper.querySelector(".word i"), 
removeIcon = wrapper.querySelector(".search .close-icon"),
synonymsList = wrapper.querySelector(".synonyms .list"),
infoText = wrapper.querySelector(".info-text");
let audio;

// Có thể dung addEventListener, bài này làm cách này cho nhớ kẻo quên !!!
searchInput.onkeyup = e => {
  if(e.key === "Enter" && e.target.value != "") {
    fetchApi(e.target.value);
  }
}

function fetchApi (word) {
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span> . . .`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
  .then(response => response.json())
  .then(result => data(result, word))
}

function data(result, word) {
  if(result.title) {
    wrapper.classList.remove("active");
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search again !!!`;
  } else {
    wrapper.classList.add("active");
    let definition = result[0].meanings[0].definitions[0],
    phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetic}/`;
    
    audio = new Audio("https:" + result[0].phonetics[0].audio);

    // insert content tag
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definition.definition;
    document.querySelector(".example span").innerText = definition.example;

    // delete all old span tag before add
    synonymsList.innerHTML = "";
    // hide synonyms if undefined and insert synonyms tag if not undefined
    if (definition.synonyms[0] == undefined) {
      synonymsList.parentElement.style.display = "none";
    } else {
      synonymsList.parentElement.style.display = "block";
      for(let i = 0; i < 5; i++) {
        let tag = `<span onclick=search("${definition.synonyms[i]}")>${definition.synonyms[i]},</span>`;
        synonymsList.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}

// Search synonyms tag when click
function search(word) {
  searchInput.value = word;
  fetchApi(word);
}

volumeIcon.addEventListener("click", function () {
  audio.play();
})

removeIcon.addEventListener("click", function () {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9a9a9a";
  infoText.innerHTML = "Type a word and press enter to get meaning, example, pronunciation and synonyms of that typed word.";
})
