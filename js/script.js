let contentArea = document.getElementById("contentArea");
let searchSection = document.getElementById("searchSection");
let submitButton;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.menu-toggle-icon').addEventListener('click', toggleNavigation);
    
    const navigationItems = document.querySelectorAll('.navigation-item');
    navigationItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            handleNavigationClick(section);
        });
    });
    
    fetchMealsByName("").then(() => {
        $(".primary-loader").fadeOut(500);
        $("body").css("overflow", "visible");
    });
});

function handleNavigationClick(section) {
    closeNavigation();
    
    switch(section) {
        case 'search':
            displaySearchInputs();
            break;
        case 'categories':
            fetchCategories();
            break;
        case 'area':
            fetchAreas();
            break;
        case 'ingredients':
            fetchIngredients();
            break;
        case 'contact':
            displayContactForm();
            break;
    }
}

function openNavigation() {
    $(".navigation-menu").animate({
        left: 0
    }, 500);

    $(".menu-toggle-icon").removeClass("fa-align-justify");
    $(".menu-toggle-icon").addClass("fa-x");

    const navigationItems = document.querySelectorAll('.navigation-item');
    for (let i = 0; i < navigationItems.length; i++) {
        $(navigationItems[i]).animate({
            top: 0
        }, (i + 5) * 100);
    }
}

function closeNavigation() {
    let boxWidth = $(".navigation-menu .navigation-panel").outerWidth();
    $(".navigation-menu").animate({
        left: -boxWidth
    }, 500);

    $(".menu-toggle-icon").addClass("fa-align-justify");
    $(".menu-toggle-icon").removeClass("fa-x");

    $(".navigation-item").animate({
        top: 300
    }, 500);
}

function toggleNavigation() {
    if ($(".navigation-menu").css("left") == "0px") {
        closeNavigation();
    } else {
        openNavigation();
    }
}

closeNavigation();

function displayRecipes(recipes) {
    let output = "";

    for (let i = 0; i < recipes.length; i++) {
        output += `
        <div class="col-md-3">
                <div class="recipe-card position-relative overflow-hidden rounded-2 clickable" data-meal-id="${recipes[i].idMeal}">
                    <img class="w-100" src="${recipes[i].strMealThumb}" alt="" srcset="">
                    <div class="recipe-overlay position-absolute d-flex align-items-center text-black p-2">
                        <h3>${recipes[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
    }

    contentArea.innerHTML = output;
    
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('click', function() {
            const mealId = this.getAttribute('data-meal-id');
            fetchRecipeDetails(mealId);
        });
    });
}

async function fetchCategories() {
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);
    searchSection.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();

    displayCategoryList(response.categories);
    $(".secondary-loader").fadeOut(300);
}

function displayCategoryList(categories) {
    let output = "";

    for (let i = 0; i < categories.length; i++) {
        output += `
        <div class="col-md-3">
                <div class="recipe-card position-relative overflow-hidden rounded-2 clickable" data-category="${categories[i].strCategory}">
                    <img class="w-100" src="${categories[i].strCategoryThumb}" alt="" srcset="">
                    <div class="recipe-overlay position-absolute text-center text-black p-2">
                        <h3>${categories[i].strCategory}</h3>
                        <p>${categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
    }

    contentArea.innerHTML = output;
    
    const categoryCards = document.querySelectorAll('.recipe-card[data-category]');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            fetchMealsByCategory(category);
        });
    });
}

async function fetchAreas() {
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);
    searchSection.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();

    displayAreaList(response.meals);
    $(".secondary-loader").fadeOut(300);
}

function displayAreaList(areas) {
    let output = "";

    for (let i = 0; i < areas.length; i++) {
        output += `
        <div class="col-md-3">
                <div class="area-card rounded-2 text-center clickable" data-area="${areas[i].strArea}">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${areas[i].strArea}</h3>
                </div>
        </div>
        `;
    }

    contentArea.innerHTML = output;
    
    const areaCards = document.querySelectorAll('.area-card');
    areaCards.forEach(card => {
        card.addEventListener('click', function() {
            const area = this.getAttribute('data-area');
            fetchMealsByArea(area);
        });
    });
}

async function fetchIngredients() {
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);
    searchSection.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();

    displayIngredientList(response.meals.slice(0, 20));
    $(".secondary-loader").fadeOut(300);
}

function displayIngredientList(ingredients) {
    let output = "";

    for (let i = 0; i < ingredients.length; i++) {
        output += `
        <div class="col-md-3">
                <div class="ingredient-card rounded-2 text-center clickable" data-ingredient="${ingredients[i].strIngredient}">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredients[i].strIngredient}</h3>
                        <p>${ingredients[i].strDescription?.split(" ").slice(0,20).join(" ") || ""}</p>
                </div>
        </div>
        `;
    }

    contentArea.innerHTML = output;
    
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    ingredientCards.forEach(card => {
        card.addEventListener('click', function() {
            const ingredient = this.getAttribute('data-ingredient');
            fetchMealsByIngredient(ingredient);
        });
    });
}

async function fetchMealsByCategory(category) {
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    displayRecipes(response.meals.slice(0, 20));
    $(".secondary-loader").fadeOut(300);
}

async function fetchMealsByArea(area) {
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();

    displayRecipes(response.meals.slice(0, 20));
    $(".secondary-loader").fadeOut(300);
}

async function fetchMealsByIngredient(ingredient) {
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();

    displayRecipes(response.meals.slice(0, 20));
    $(".secondary-loader").fadeOut(300);
}

async function fetchRecipeDetails(mealId) {
    closeNavigation();
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);

    searchSection.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    response = await response.json();

    displayRecipeDetails(response.meals[0]);
    $(".secondary-loader").fadeOut(300);
}

function displayRecipeDetails(recipe) {
    searchSection.innerHTML = "";

    let ingredientsList = ``;

    for (let i = 1; i <= 20; i++) {
        if (recipe[`strIngredient${i}`]) {
            ingredientsList += `<li class="alert alert-info m-2 p-1">${recipe[`strMeasure${i}`]} ${recipe[`strIngredient${i}`]}</li>`;
        }
    }

    let tags = recipe.strTags?.split(",") || [];
    let tagsOutput = '';
    
    for (let i = 0; i < tags.length; i++) {
        tagsOutput += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }

    let output = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${recipe.strMealThumb}"
                    alt="">
                    <h2>${recipe.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${recipe.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${recipe.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${recipe.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredientsList}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsOutput}
                </ul>

                <a target="_blank" href="${recipe.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${recipe.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

    contentArea.innerHTML = output;
}

function displaySearchInputs() {
    searchSection.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input id="nameSearchInput" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input id="letterSearchInput" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;
    
    contentArea.innerHTML = "";
    
    document.getElementById('nameSearchInput').addEventListener('keyup', function() {
        fetchMealsByName(this.value);
    });
    
    document.getElementById('letterSearchInput').addEventListener('keyup', function() {
        fetchMealsByFirstLetter(this.value);
    });
}

async function fetchMealsByName(searchTerm) {
    closeNavigation();
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    response = await response.json();

    response.meals ? displayRecipes(response.meals) : displayRecipes([]);
    $(".secondary-loader").fadeOut(300);
}

async function fetchMealsByFirstLetter(letter) {
    closeNavigation();
    contentArea.innerHTML = "";
    $(".secondary-loader").fadeIn(300);

    letter = letter || "a";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    response = await response.json();

    response.meals ? displayRecipes(response.meals) : displayRecipes([]);
    $(".secondary-loader").fadeOut(300);
}

function displayContactForm() {
    contentArea.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameField" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameError" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailField" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailError" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneField" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageField" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="passwordField" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="confirmPasswordField" type="password" class="form-control " placeholder="Repassword">
                <div id="confirmPasswordError" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitButton" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div>`;

    submitButton = document.getElementById("submitButton");

    setupFormValidation();
}

let nameFieldTouched = false;
let emailFieldTouched = false;
let phoneFieldTouched = false;
let ageFieldTouched = false;
let passwordFieldTouched = false;
let confirmPasswordFieldTouched = false;

function setupFormValidation() {
    nameFieldTouched = false;
    emailFieldTouched = false;
    phoneFieldTouched = false;
    ageFieldTouched = false;
    passwordFieldTouched = false;
    confirmPasswordFieldTouched = false;
    
    document.getElementById("nameField").addEventListener("focus", () => {
        nameFieldTouched = true;
    });
    document.getElementById("nameField").addEventListener("keyup", validateForm);

    document.getElementById("emailField").addEventListener("focus", () => {
        emailFieldTouched = true;
    });
    document.getElementById("emailField").addEventListener("keyup", validateForm);

    document.getElementById("phoneField").addEventListener("focus", () => {
        phoneFieldTouched = true;
    });
    document.getElementById("phoneField").addEventListener("keyup", validateForm);

    document.getElementById("ageField").addEventListener("focus", () => {
        ageFieldTouched = true;
    });
    document.getElementById("ageField").addEventListener("keyup", validateForm);

    document.getElementById("passwordField").addEventListener("focus", () => {
        passwordFieldTouched = true;
    });
    document.getElementById("passwordField").addEventListener("keyup", validateForm);

    document.getElementById("confirmPasswordField").addEventListener("focus", () => {
        confirmPasswordFieldTouched = true;
    });
    document.getElementById("confirmPasswordField").addEventListener("keyup", validateForm);
}

function validateForm() {
    if (nameFieldTouched) {
        if (validateName()) {
            document.getElementById("nameError").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("nameError").classList.replace("d-none", "d-block");
        }
    }
    
    if (emailFieldTouched) {
        if (validateEmail()) {
            document.getElementById("emailError").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("emailError").classList.replace("d-none", "d-block");
        }
    }

    if (phoneFieldTouched) {
        if (validatePhone()) {
            document.getElementById("phoneError").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("phoneError").classList.replace("d-none", "d-block");
        }
    }

    if (ageFieldTouched) {
        if (validateAge()) {
            document.getElementById("ageError").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("ageError").classList.replace("d-none", "d-block");
        }
    }

    if (passwordFieldTouched) {
        if (validatePassword()) {
            document.getElementById("passwordError").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("passwordError").classList.replace("d-none", "d-block");
        }
    }
    
    if (confirmPasswordFieldTouched) {
        if (validateConfirmPassword()) {
            document.getElementById("confirmPasswordError").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("confirmPasswordError").classList.replace("d-none", "d-block");
        }
    }

    if (validateName() &&
        validateEmail() &&
        validatePhone() &&
        validateAge() &&
        validatePassword() &&
        validateConfirmPassword()) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", true);
    }
}

function validateName() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameField").value));
}

function validateEmail() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailField").value));
}

function validatePhone() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneField").value));
}

function validateAge() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageField").value));
}

function validatePassword() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordField").value));
}

function validateConfirmPassword() {
    return document.getElementById("confirmPasswordField").value == document.getElementById("passwordField").value;
}
