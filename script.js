const inputSlider = document.querySelector("input[type=range]");
const lengthDisplay = document.querySelector("[lengthDisplay]");
const passwordDisplay = document.querySelector("input[passwordDisplay]");
const copybtn = document.querySelector(".copyBtn")
const copyMsg = document.querySelector("[copyMessage]")
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');
const indicator = document.querySelector(".indicator");
const generateButton = document.querySelector("#generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount= 0;

handleSlider();
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomLowercase() {
    return String.fromCharCode(generateRandom(97, 123));
}

function generateRandomUppercase() {
    return String.fromCharCode(generateRandom(65, 91));
}

function generateRandomNumber() {
    return generateRandom(1, 10);
}

function generateRandomSymbol() {
    let index = generateRandom(0, symbol.length);
    return symbol.charAt(index);
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNumber = true;
    if (symbols.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

async function copyContent() {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";

    copyMsg.classList.add("active");
    setTimeout('click', function() {
        copyMsg.classList.remove("active");
    },2000);
}

copybtn.addEventListener("click" , () =>  {
    if(passwordDisplay.value)
    copyContent();
});
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
    }
    handleSlider();
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

generateButton.addEventListener('click', () => {
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Remove Previous Password
    password = "";

    let funArr = [];

    if (uppercase.checked) funArr.push(generateRandomUppercase);
    if (lowercase.checked) funArr.push(generateRandomLowercase);
    if (numbers.checked) funArr.push(generateRandomNumber);
    if (symbols.checked) funArr.push(generateRandomSymbol);

    // Compulsory Addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }


    // Additional addition
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = generateRandom(0, funArr.length);
        password += funArr[randIndex]();
    }

    passwordDisplay.value = password;
    calcStrength();
});