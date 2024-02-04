import React, { useState, useEffect } from "react";
import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Tooltip } from "bootstrap";

function App() {
  const [firstWord, setFirstWord] = useState("");
  const [secondWord, setSecondWord] = useState("");
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(true); // Default to true for lowercase
  const [passwordLength, setPasswordLength] = useState(10);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    label: "There's nothing here",
    emoji: "🦗",
    class: "bg-meh",
  });

  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));

  const generatePassword = () => {
    if (
      !includeSymbols &&
      !includeNumbers &&
      !includeUppercase &&
      !includeLowercase &&
      !firstWord &&
      !secondWord
    ) {
      return "";
    }

    let chars = "";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";

    // Add selected character types to the pool
    if (includeSymbols) chars += symbols;
    if (includeNumbers) chars += numbers;
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;

    // Default chars if none selected
    if (!chars) chars = numbers + symbols + uppercase + lowercase;

    // Function to get a random character from the available characters
    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

    // Initialize the password with the base word(s), ensuring case as per selection
    let base = firstWord + (secondWord ? secondWord : "");
    if (includeUppercase)
      base = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    if (!includeUppercase && includeLowercase) base = base.toLowerCase();

    // Ensure base is not longer than the desired password length
    base = base.slice(0, passwordLength);

    // Calculate random characters to prepend and append
    let prependChars = "";
    let appendChars = "";
    const randomCharsCount = passwordLength - base.length;
    for (let i = 0; i < randomCharsCount; i++) {
      if (Math.random() < 0.5) {
        prependChars += getRandomChar(); // Prepend random character
      } else {
        appendChars += getRandomChar(); // Append random character
      }
    }

    // Concatenate the random characters and the base word
    let password = prependChars + base + appendChars;

    // Ensure the password does not exceed the desired length
    if (password.length > passwordLength) {
      password = password.substring(0, passwordLength);
    }

    return password;
  };

  const calculateStrength = (password) => {
    let score = 0;

    // Regular expressions to check for presence of various character types
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const length = password.length;

    // Adjust criteria for scoring based on actual content
    if (length >= 10) score += 1; // Length criterion
    if (hasNumbers) score += 1; // Numbers
    if (hasSymbols) score += 1; // Symbols
    if (hasUppercase || hasLowercase) score += 1; // Uppercase letters

    // Adjust the strength, percent, and class based on the score
    let strength = {
      label: "There's nothing here",
      emoji: "🦗",
      class: "bg-empty",
    };
    if (score >= 4)
      strength = {
        label: "Strong AF",
        emoji: "😎",
        class: "bg-excellent",
      };
    else if (score >= 3)
      strength = {
        label: "Good, but could be better",
        emoji: "😊",
        class: "bg-good",
      };
    else if (score >= 2)
      strength = {
        label: "Questionable",
        emoji: "🤔",
        class: "bg-meh",
      };
    else if (score >=1)
    strength = {
        label: "$#!@ password...",
        emoji: "💩",
        class: "bg-awful"
    } 
    return strength;
  };

  useEffect(() => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setPasswordStrength(calculateStrength(newPassword));
  }, [
    firstWord,
    secondWord,
    includeSymbols,
    includeNumbers,
    includeUppercase,
    includeLowercase,
    passwordLength,
  ]);

  const generateAndSetPassword = () => {
    if (
      !includeSymbols &&
      !includeNumbers &&
      !includeUppercase &&
      !includeLowercase &&
      !firstWord &&
      !secondWord
    ) {
      // If no character types are selected and both words are empty, set password to empty and update strength accordingly
      setGeneratedPassword("");
      setPasswordStrength({
        label: "There's nothing here",
        emoji: "🦗",
        class: "bg-meh",
        percent: 0, // Assuming you want to show some kind of progress or lack thereof
      });
    } else {
      // Proceed with password generation and strength calculation if above conditions are not met
      const newPassword = generatePassword();
      setGeneratedPassword(newPassword);
      setPasswordStrength(calculateStrength(newPassword));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword).then(
      () => {
        alert("Password copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy password: ", err);
      }
    );
  };

  const refreshPassword = () => {
    generateAndSetPassword();
  };

  return (
    <div className="container custom-container">
      <div className="row pt-5 justify-content-center align-items-center">
        <div className="col-12">
          <div className={`preview-container ${passwordStrength.class}`}>
            <div className="input-group password-preview-input-group">
              <input
                type="text"
                id="generatedPassword"
                className="password-preview-input"
                value={generatedPassword}
                readOnly
              />
              <button
                onClick={copyToClipboard}
                className="px-3 custom-button"
                title="Copy"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <i className="bi bi-clipboard custom-icon"></i>
              </button>
              <button
                onClick={refreshPassword}
                className="custom-button"
                title="Generate"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <i className="bi bi-arrow-clockwise custom-icon"></i>
              </button>
            </div>
            <div className="d-flex">
              <div className="ms-2 me-1 emoji">{passwordStrength.emoji}</div>
              <div className="strength-label">{passwordStrength.label}</div>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-center password-form">
            <div className="col-9 mb-3 input-group-lg pt-5">
              <label htmlFor="firstWord" className="form-label">
                First word
              </label>
              <input
                type="text"
                className="form-control"
                id="firstWord"
                value={firstWord}
                onChange={(e) => setFirstWord(e.target.value)}
                placeholder="Enter a word you like"
              />
            </div>

            <div className="col-9 mb-3 input-group-lg">
              {" "}
              {/* Added Bootstrap class for margin bottom */}
              <label htmlFor="secondWord" className="form-label">
                Second word (optional)
              </label>
              <input
                type="text"
                className="form-control"
                id="secondWord"
                placeholder="Enter another word"
                value={secondWord}
                onChange={(e) => setSecondWord(e.target.value)}
              />
            </div>
            <div className="col-9 mb-3 btn-group d-flex">
              {" "}
              {/* Use divs for consistent spacing */}
              <input
                className="btn-check"
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                id="includeSymbols"
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="includeSymbols"
              >
                Symbols
              </label>
              <input
                className="btn-check"
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                id="includeNumbers"
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="includeNumbers"
              >
                Numbers
              </label>
              <input
                className="btn-check"
                type="checkbox"
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
                id="includeUppercase"
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="includeUppercase"
              >
                Uppercase Letters
              </label>
              <input
                className="btn-check"
                type="checkbox"
                checked={includeLowercase}
                onChange={() => setIncludeLowercase(!includeLowercase)}
                id="includeLowercase"
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="includeLowercase"
              >
                Lowercase Letters
              </label>
            </div>

            <div className="col-9 mb-3">
              {" "}
              {/* Adjusted for consistent spacing */}
              <label htmlFor="passwordLength">
                Password Length: {passwordLength}
              </label>
              <input
                type="range"
                className="form-range" // Updated class for Bootstrap 5
                id="passwordLength"
                min="1"
                max="20"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
