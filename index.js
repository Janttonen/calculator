const calcs = document.querySelectorAll("table");
const calculators = new Map();

calcs.forEach((calc, i) => {
  const displayU = calc.getElementsByClassName("display"); // upper
  const displayL = calc.getElementsByClassName("userInput"); // lower
  calculators.set(i, {
    displays: { displayU: displayU, displayL: displayL, calcDone: 0 },
    table: calc,
  });
});

// event listeners
calculators.forEach((calc) => {
  calc.table.addEventListener("click", (e) => {
    if (e.target.type == "button") {
      operator(e.target.value, calc.displays);
    }
  });

  calc.table.addEventListener("keypress", (e) => {
    if (e.key.match(/[0-9\.\-\/\+=*C]/)) {
      operator(e.key, calc.displays);
    } else if (e.key == "Enter") {
      operator("=");
    }
  });
});

const operator = (buttonValue, displays) => {
  if (buttonValue == "C") {
    clearDisplay(displays);
  } else if (buttonValue == "CE") {
    eraseFromDisplay(displays);
    return;
  } else if (buttonValue == "=") {
    calculate(displays);
    return;
  } else {
    append(buttonValue, displays);
  }

  if (displays.calcDone == 1) {
    changeCalcDone(0, displays);
  }
};

// append to calculation
const append = (value, displays) => {
  let input = displays.displayL[0].value;
  let upper = displays.displayU[0].value;

  // dont add multiple operators
  if (
    value != "." &&
    value != "+/-" &&
    isNaN(value) &&
    (!input || isNaN(input.slice(-1)))
  )
    return;

  // input cannot be longer than 15 characters
  if (input.length > 15 && calcDone == 0) {
    alert("You cannot add more than 15 numbers");
    return;
  }

  // empty textfield if user has allready calculated something
  if (displays.calcDone == 1) {
    if (!isNaN(input)) {
      input = "";
    }
    upper = "";
  }

  // check different inputs
  if (isNaN(value)) {
    if (value == ".") {
      if (!input) {
        input = `0${value}`;
      } else if (!input.includes(".")) {
        input += `${value}`;
      }
    } else if (value == "+/-") {
      if (input.startsWith("-")) {
        input = input.slice(1, input.length);
      } else {
        input = `-${input}`;
      }
    } else {
      upper += `${input}${value}`;
      input = "";
    }
  } else {
    input += `${value}`;
  }
  displays.displayU[0].value = upper;
  displays.displayL[0].value = input;
};

// if user uses equals button
const changeCalcDone = (value, displays) => {
  displays.calcDone = value;

  if (displays.calcDone == 1) {
    displays.displayL[0].style.color = "rgb(14, 166, 67)";
  } else {
    displays.displayL[0].style.color = "rgb(255, 255, 255)";
  }
};

const clearDisplay = (displays) => {
  displays.displayU[0].value = "";
  displays.displayL[0].value = "";
};

const eraseFromDisplay = (displays) => {
  if (calcDone == 1) return;
  displays.displayL[0].value = displays.displayL[0].value.slice(0, -1);
};

const calculate = (displays) => {
  try {
    let input = displays.displayL[0].value;
    let upper = displays.displayU[0].value;
    let lastChar = upper.slice(-1);

    if (!upper) return;

    // append possible numbers to calculation
    if (input && isNaN(lastChar)) {
      upper += input;
    } else if (!input && isNaN(lastChar)) {
      upper = upper.slice(0, -1);
    }

    const calculation = math.evaluate(upper);

    input = (calculation * 100) / 100;

    displays.displayL[0].value = input;
    displays.displayU[0].value = upper;
    changeCalcDone(1, displays);
  } catch (error) {
    alert("Something went wrong");
    console.log("Error", error);
  }
};
