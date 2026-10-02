const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentNumber = "";
let previousNumber = "";
let operation = null;
let shouldResetScreen = false;


// Display number
function updateDisplay() {

    if (currentNumber === "") {
        currentDisplay.textContent = "0";
    } else {
        currentDisplay.textContent = currentNumber;
    }

    if (operation !== null && previousNumber !== "") {

        let symbol = operation;

        if (operation === "*") {
            symbol = "×";
        }

        if (operation === "/") {
            symbol = "÷";
        }

        if (operation === "-") {
            symbol = "−";
        }

        previousDisplay.textContent =
            `${previousNumber} ${symbol}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// Add number
function appendNumber(number) {

    if (shouldResetScreen) {
        currentNumber = "";
        shouldResetScreen = false;
    }

    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (currentNumber === "0" && number !== ".") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }

    updateDisplay();
}


// Select operation
function chooseOperation(selectedOperation) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    if (currentNumber === "" && previousNumber !== "") {
        operation = selectedOperation;
        updateDisplay();
        return;
    }

    if (previousNumber !== "") {
        calculate();
    }

    previousNumber = currentNumber;
    currentNumber = "";
    operation = selectedOperation;

    updateDisplay();
}


// Calculate result
function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operation === null
    ) {
        return;
    }

    const previous = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);

    let result;

    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operation = null;

                updateDisplay();

                return;
            }

            result = previous / current;
            break;

        case "%":
            result = previous % current;
            break;

        default:
            return;
    }

    currentNumber = roundResult(result);

    previousNumber = "";
    operation = null;

    shouldResetScreen = true;

    updateDisplay();
}


// Round long decimal results
function roundResult(number) {

    return Math.round((number + Number.EPSILON) * 100000000) / 100000000;
}


// Clear calculator
function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operation = null;
    shouldResetScreen = false;

    updateDisplay();
}


// Delete last number
function deleteNumber() {

    if (
        currentNumber === "" ||
        currentNumber === "Error"
    ) {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}


// Number button events
numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


// Operator button events
operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


// Action buttons
actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

        if (action === "calculate") {
            calculate();
        }

    });

});


// Keyboard support
document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        appendNumber(key);
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        chooseOperation(key);
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "Escape") {
        clearCalculator();
    }

});


// Initial display
updateDisplay();