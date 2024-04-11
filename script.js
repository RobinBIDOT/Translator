/**
 * Sélection des éléments du DOM nécessaires pour l'application de traduction.
 */
const fromText = document.querySelector(".from-text"); // Zone de texte pour l'entrée de l'utilisateur.
const toText = document.querySelector(".to-text"); // Zone de texte pour la sortie traduite.
const exchangeIcon = document.querySelector(".exchange"); // Icône pour échanger les langues.
const selectTag = document.querySelectorAll("select"); // Sélecteurs de langue.
const icons = document.querySelectorAll(".row i"); // Icônes pour des fonctionnalités supplémentaires.
const translateBtn = document.querySelector("button"); // Bouton pour lancer la traduction.

/**
 * Remplit les sélecteurs de langue avec des options basées sur un objet 'countries'.
 */
selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    // Sélectionne par défaut le français pour la langue source et l'anglais pour la cible.
    let selected = id === 0 ? (country_code === "fr-FR" ? "selected" : "") : (country_code === "en-GB" ? "selected" : "");
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

/**
 * Événement pour échanger les langues et le texte entre les zones de texte.
 */
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
      tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

/**
 * Efface la zone de texte de sortie si la zone de texte d'entrée est vide.
 */
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

/**
 * Fonctionnalité de traduction lors du clic sur le bouton.
 */
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
      translateFrom = selectTag[0].value,
      translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach(data => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

/**
 * Gère les clics sur les icônes pour copier le texte ou le lire à haute voix.
 */
icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      // Copie le texte dans le presse-papier.
      if (target.id === "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      // Lit le texte à haute voix.
      let utterance;
      if (target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
