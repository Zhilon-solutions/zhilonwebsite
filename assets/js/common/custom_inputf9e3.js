// Validation rules mapped by class name
const validationRules = {
  "only-numbers": /^[0-9.]$/, // Numbers and period
  "only-alphabets": /^[a-zA-Z ._]$/, // Alphabets, space, period
  "only-alphabet-numbers": /^[a-zA-Z0-9 .]$/, // Alphabets, numbers, space, period
  "only-alphabet-symbols": /^[a-zA-Z\-_'. ]$/, // Alphabets, hyphen, apostrophe, period, space
  "only-alphabet-numbers-symbols": /^[a-zA-Z0-9\-_'. &]$/, // Alphabets, numbers, hyphen, apostrophe, period, space, ampersand
  "only-zip-code": /^[a-zA-Z0-9\-./ ]$/, // Alphanumeric, hyphen, period, slash, space
  "only-alphabet-unicode": /^[\p{L}\s\-'‘’`.&]$/u, // Unicode letters, space, hyphen, apostrophe, quotes, period, ampersand
  "only-integers": /^[0-9]$/, // Integers only
  "only-pricing": /^\d*(\.\d{0,2})?$/, // Numbers, period up to 2 decimal places
};

// Full-string validation for "only-alphabet-unicode" (for paste or final check)
const fullStringRules = {
  "only-alphabet-unicode":
    /^(?!.*(['‘’`.&-])\1)(?!.*\s{2,})(?!.*['‘’`.&-]{2,})[\p{L}\s\-'‘’`.&]*$/u,
};

// Function to validate and clean input on the fly
function validateInput(event) {
  const input = event.target;
  const className = [...input.classList].find((cls) => validationRules[cls]);
  if (!className) return;

  const regex = validationRules[className];
  const fullRegex = fullStringRules[className] || regex;
  const oldValue = input.value;
  let newValue;

  if (className === "only-pricing") {
    newValue = oldValue.replace(/[^0-9.]/g, "");

    const firstDot = newValue.indexOf(".");
    if (firstDot !== -1) {
      const beforeDot = newValue.substring(0, firstDot + 1);
      const afterDot = newValue
        .substring(firstDot + 1)
        .replace(/\./g, "")
        .slice(0, 2);
      newValue = beforeDot + afterDot;
    }

    if (fullRegex && !fullRegex.test(newValue)) {
      newValue = newValue.match(/^\d*(\.\d{0,2})?/)[0] || "";
    }
  } else {

    newValue = oldValue
      .replace(/\s{2,}/g, " ")
      .split("")
      .filter((char) => regex.test(char))
      .join("");
  }

  if (newValue !== oldValue) {
    input.value = newValue;
  }

  if (newValue !== oldValue || !fullRegex.test(newValue)) {
    input.value = newValue;
  }
}

// Function to clean pasted text
function cleanPastedInput(event) {
  const input = event.target;
  const className = [...input.classList].find((cls) => validationRules[cls]);
  if (!className) return;

  event.preventDefault();
  const regex = validationRules[className];
  const pastedText = (event.clipboardData || window.clipboardData).getData(
    "text"
  );

  const sanitizedText = pastedText
    .replace(/\s{2,}/g, " ")
    .split("")
    .filter((char) => regex.test(char))
    .join("");
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  input.setRangeText(sanitizedText, start, end, "end");

  input.dispatchEvent(new Event("input", { bubbles: true }));
}

// Attach input and paste handlers
function attachInputHandlers() {
  Object.keys(validationRules).forEach((className) => {
    const inputs = document.querySelectorAll(`.${className}`);
    inputs.forEach((input) => {
      input.addEventListener("input", validateInput);

      input.addEventListener("paste", cleanPastedInput);
    });
  });
}

function toLowerCaseSlug(input) {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-_.]/g, "");
}

function toUpperCaseSlug(input) {
  return input
    .toUpperCase()
    .replace(/ /g, "-")
    .replace(/[^A-Z0-9-_.]/g, "");
}

// Attaching after slug formatting
const attachSlugHandlers = () => {
  document.querySelectorAll(".lowercase-slug").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = toLowerCaseSlug(input.value);
    });
  });

  document.querySelectorAll(".uppercase-slug").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = toUpperCaseSlug(input.value);
    });
  });
};

// Initializing event handlers
function initValidation() {
  attachInputHandlers();
  attachSlugHandlers();
}

document.addEventListener("DOMContentLoaded", initValidation);
