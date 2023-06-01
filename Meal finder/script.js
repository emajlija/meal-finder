const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  resultHeading = document.querySelector(".result-heading"),
  mealsEl = document.getElementById("meals"),
  singleMeal = document.getElementById("single-meal");

//search meal-fetch from API
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  singleMeal.innerHTML = "";

  //get search term
  const term = search.value;
  //console.log(term);

  //check for empty\script.js
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((result) => result.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h1>Search results for '${term}':</h1>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search result. Try again :)</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
          <div class="meal">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
          <div class="meal-info" data-mealID="${meal.idMeal}">
          <h3>${meal.strMeal}</h3>
          </div>
          </div>
          `
            )
            .join("");
        }
      });
    //clear search
    search.value = "";
  } else {
    alert("Enter a meal!");
  }
}

//fetch meal by id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

//fetch random meal
function randomMeal() {
  //clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
  </ul>
  </div>
  </div>
  `;
}

//event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = findParentWithClass(e.target, "meal-info");
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealID");
    getMealById(mealId);
  }
});
// Find parent element with a specific class
function findParentWithClass(element, className) {
  let parent = element.parentElement;
  while (parent) {
    if (parent.classList.contains(className)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}
