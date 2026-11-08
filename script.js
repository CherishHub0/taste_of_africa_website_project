// Taste of Africa - script.js
// Features: dark mode, recipe filter, favorites, ingredient scaler,
// contact form check, newsletter

// ---------------------------------------------------------
// 1. DARK MODE
// ---------------------------------------------------------
var darkBtn = document.getElementById("dark-btn");

// when the page loads, check if the user chose dark mode before
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkBtn.textContent = "Light mode";
}

darkBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    darkBtn.textContent = "Light mode";
  } else {
    localStorage.setItem("theme", "light");
    darkBtn.textContent = "Dark mode";
  }
});

// ---------------------------------------------------------
// 2. FAVORITES (saved in localStorage)
// ---------------------------------------------------------

// get the saved favorites (a list of recipe ids), or an empty list
function getFavorites() {
  var saved = localStorage.getItem("favorites");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

var favButtons = document.querySelectorAll(".fav-btn");

// show the heart as red or white depending on if it is saved
function updateButton(button, isFavorite) {
  if (isFavorite) {
    button.classList.add("active");
    button.textContent = "❤️ Saved";
  } else {
    button.classList.remove("active");
    button.textContent = "🤍 Favorite";
  }
}

// when the page loads, go through every button and restore the saved ones
var favorites = getFavorites();
for (var i = 0; i < favButtons.length; i++) {
  var id = favButtons[i].dataset.id;
  updateButton(favButtons[i], favorites.includes(id));
}

// when a button is clicked, add or remove the recipe id
for (var j = 0; j < favButtons.length; j++) {
  favButtons[j].addEventListener("click", function () {
    var recipeId = this.dataset.id;
    var list = getFavorites();

    if (list.includes(recipeId)) {
      // already saved, so remove it
      list.splice(list.indexOf(recipeId), 1);
      updateButton(this, false);
    } else {
      // not saved yet, so add it
      list.push(recipeId);
      updateButton(this, true);
    }

    localStorage.setItem("favorites", JSON.stringify(list));
  });
}

// ---------------------------------------------------------
// 3. RECIPE FILTER (recipes page)
// ---------------------------------------------------------
var filterButtons = document.querySelectorAll(".filter-btn");
var recipeCards = document.querySelectorAll(".recipe-card");

for (var k = 0; k < filterButtons.length; k++) {
  filterButtons[k].addEventListener("click", function () {
    var region = this.dataset.region;
    var saved = getFavorites();

    // move the "active" look to the button that was clicked
    for (var a = 0; a < filterButtons.length; a++) {
      filterButtons[a].classList.remove("active");
    }
    this.classList.add("active");

    // loop through all cards and show or hide them
    var shown = 0;
    for (var b = 0; b < recipeCards.length; b++) {
      var card = recipeCards[b];
      var show = false;

      if (region === "all") {
        show = true;
      } else if (region === "favorites") {
        show = saved.includes(card.dataset.id);
      } else if (card.dataset.region === region) {
        show = true;
      }

      if (show) {
        card.classList.remove("hidden");
        shown++;
      } else {
        card.classList.add("hidden");
      }
    }

    // message when nothing matches
    var message = document.getElementById("empty-message");
    if (message) {
      if (shown === 0) {
        message.classList.remove("hidden");
      } else {
        message.classList.add("hidden");
      }
    }
  });
}

// ---------------------------------------------------------
// 4. INGREDIENT SCALER (recipe pages)
// ---------------------------------------------------------
var minusBtn = document.getElementById("minus");
var plusBtn = document.getElementById("plus");
var servingsText = document.getElementById("servings-text");

if (minusBtn && plusBtn) {
  var baseServings = 4;
  var servings = 4;
  var amounts = document.querySelectorAll(".amount");

  function updateAmounts() {
    servingsText.textContent = servings + " servings";

    for (var c = 0; c < amounts.length; c++) {
      var original = Number(amounts[c].dataset.amount);
      var newAmount = (original / baseServings) * servings;
      // round to 2 decimals (so we don't get 0.3333333)
      amounts[c].textContent = Math.round(newAmount * 100) / 100;
    }
  }

  minusBtn.addEventListener("click", function () {
    if (servings > 1) {
      servings = servings - 1;
      updateAmounts();
    }
  });

  plusBtn.addEventListener("click", function () {
    if (servings < 20) {
      servings = servings + 1;
      updateAmounts();
    }
  });
}

// ---------------------------------------------------------
// 5. CONTACT FORM
// ---------------------------------------------------------
var contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    // stop the form from sending/reloading the page
    event.preventDefault();

    var name = document.getElementById("name").value;
    var message = document.getElementById("message").value.trim();
    var errorText = document.getElementById("error-text");

    // the message must be MORE than 20 characters
    if (message.length <= 20) {
      errorText.textContent = "Your message must be more than 20 characters. You wrote " + message.length + ".";
      return;
    }

    // everything is fine: hide the form and show the thank you message
    errorText.textContent = "";
    contactForm.classList.add("hidden");

    var thanks = document.getElementById("thanks");
    thanks.textContent = "Thank you, " + name + "! We've received your message.";
    thanks.classList.remove("hidden");
  });
}

// ---------------------------------------------------------
// 6. NEWSLETTER (footer)
// ---------------------------------------------------------
var newsletterForm = document.getElementById("newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("newsletter-message").textContent = "Thanks for subscribing!";
    newsletterForm.reset();
  });
}
