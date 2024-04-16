let result = document.getElementById("result");
let searchBtn = document.getElementById('search-btn');
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener('click', () => {

    let userInp = document.getElementById('user-inp').value;
    if (userInp.length == 0) {
        result.innerHTML = `
        <h3>Enter Dish Name </h3>`;
    }
    else {
        fetch(url + userInp)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                let myMeal = data.meals[0];
                console.log(myMeal);
                console.log(myMeal.strMealThumb);
                console.log(myMeal.strMeal);
                console.log(myMeal.strArea);
                console.log(myMeal.strInstructions);
                let count = 1;
                let ingredients = [];
                for (let i in myMeal) {
                    let ingredient = '';
                    let measure = '';
                    if (i.startsWith('strIngredient') && myMeal[i]) {
                        ingredient = myMeal[i];
                        measure = myMeal[`strMeasure` + count];
                        count += 1;
                        ingredients.push(`${measure} ${ingredient}`);
                    }
                }
                console.log(ingredients);

                result.innerHTML = `
            <img src = ${myMeal.strMealThumb}> 
            <div class="details">
                <h2>${myMeal.strMeal}</h2>
                <h4>${myMeal.strArea}</h4>
            </div>
            
            <div id="ingredient-con">
    
            </div>
            <div id="recipe">
                <button id = "hide-recipe">X</button>
                <pre id = "instructions">${myMeal.strInstructions}</pre>
            </div>
            <button id = "show-recipe">View Recipe</button>
            `;
                let ingredientCon = document.getElementById('ingredient-con');
                let parent = document.createElement('ul');
                let recipe = document.getElementById('recipe');
                let hideRecipe = document.getElementById('hide-recipe');
                let showRecipe = document.getElementById('show-recipe');

                ingredients.forEach((i) => {
                    let child = document.createElement('li');
                    child.innerText = i;
                    parent.appendChild(child);
                    ingredientCon.appendChild(parent);

                });

                hideRecipe.addEventListener('click', () => {
                    recipe.style.display = 'none';
                });

                showRecipe.addEventListener('click', () => {
                    recipe.style.display = 'block';
                });

            }).catch(() => {
                result.innerHTML = `<h3>Type Correct Dish Name</h3>`
            });
    }

});

// Add an event listener to the input field for keyup event
document.getElementById("user-inp").addEventListener("keyup", function (event) {
    if (this.value.length > 2) {
        fetch(url + this.value)
            .then((response) => response.json())
            .then((data) => {
                let suggestions = data.meals.map((meal) => meal.strMeal);
                displaySuggestions(suggestions);
            })
            .catch(() => {
                console.error("Error fetching suggestions");
            });
    } else {
        clearSuggestions();
    }
});

// Function to display suggestions
function displaySuggestions(suggestions) {
    let suggestionContainer = document.getElementById("suggestions");
    suggestionContainer.innerHTML = "";
    document.getElementById("result").innerHTML = "";
    suggestions.forEach((suggestion) => {
        let suggestionElem = document.createElement("div");
        suggestionElem.textContent = suggestion;
        suggestionElem.style.cursor = "pointer";
        suggestionElem.style.marginTop = "5px";
        suggestionElem.style.padding = "8px";

        suggestionElem.addEventListener("mouseover", function () {
            suggestionElem.style.backgroundColor = "#116530";
            suggestionElem.style.color = "#fff";
            suggestionElem.style.borderRadius = "5px";
            
        });
        suggestionElem.addEventListener("mouseout", function () {
            suggestionElem.style.color = "black";
            suggestionElem.style.backgroundColor = "transparent";
        });


        suggestionElem.addEventListener("click", function () {
            // Set the value of the input field to the clicked suggestion
            document.getElementById("user-inp").value = suggestion;
            clearSuggestions();
        });
        suggestionContainer.prepend(suggestionElem);
    });
}

// Function to clear suggestions
function clearSuggestions() {
    document.getElementById("suggestions").innerHTML = "";
}
