import React, { useState, useEffect } from "react";
import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [firstWord, setFirstWord] = useState("");
  const [secondWord, setSecondWord] = useState("");
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(true); // Default to true for lowercase
  const [passwordLength, setPasswordLength] = useState(8);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    label: "Weak",
    percent: 0,
    barClass: "bg-danger",
  });

  const generatePassword = () => {
    let chars = "";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
  
    // If no checkboxes are selected, default to a mix of character types
    if (!includeSymbols && !includeNumbers && !includeUppercase && !includeLowercase) {
      chars = numbers + symbols + uppercase + lowercase;
    } else {
      if (includeSymbols) chars += symbols;
      if (includeNumbers) chars += numbers;
      if (includeUppercase) chars += uppercase;
      if (includeLowercase) chars += lowercase;
    }
  
    // Start with the base words if provided
    let base = firstWord + (secondWord ? secondWord : "");
    // Apply transformations based on selections
    if (includeUppercase) base = base.toUpperCase();
    else if (includeLowercase) base = base.toLowerCase();
  
    // If no word is provided, ensure the base starts empty
    base = base || "";
  
    let password = base;
    // Fill up to the desired length
    while (password.length < passwordLength) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
  
    // If the password is still empty (no chars selected and no base word), generate from all chars
    if (!password) {
      chars = numbers + symbols + uppercase + lowercase; // Ensure all character types are available
      for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
    }
  
    // Ensure the password does not exceed the desired length
    return password.slice(0, passwordLength);
  };
  
  

  const calculateStrength = (password) => {
    let score = 0;
    const length = password.length;
    const uniqueChars = new Set(password).size;

    // Adjust criteria for scoring as needed
    if (length >= 8) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;
    if (includeUppercase) score += 1;
    if (uniqueChars > 4) score += 1;

    // Adjust the strength, percent, and class based on the score
    let strength = {
      label: "Weak",
      emoji: "😢",
      barClass: "bg-danger",
      percent: 25,
    }; // Sad face for weak
    if (score >= 4)
      strength = {
        label: "Strong",
        emoji: "😎",
        barClass: "bg-success",
        percent: 100,
      };
    // Sunglasses face for strong
    else if (score >= 3)
      strength = {
        label: "Good",
        emoji: "😊",
        barClass: "bg-warning",
        percent: 75,
      };
    // Smiling face for good
    else if (score >= 2)
      strength = {
        label: "Moderate",
        emoji: "🤔",
        barClass: "bg-info",
        percent: 50,
      }; // Thinking face for moderate
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
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setPasswordStrength(calculateStrength(newPassword));
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
    <div className="col-12">
      <div className="col-6">
        <div className="mb-3 input-group-lg">
          <label htmlFor="formGroupExampleInput" className="form-label">
            First word
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput"
            value={firstWord}
            onChange={(e) => setFirstWord(e.target.value)}
            placeholder="Enter a word you like"
          />
        </div>

        <div className="mb-3 input-group-lg">
          {" "}
          {/* Added Bootstrap class for margin bottom */}
          <label htmlFor="" className="form-label">
            Second word (optional)
          </label>
          <input
            type="text"
            className="form-control "
            placeholder="Enter another word"
            value={secondWord}
            onChange={(e) => setSecondWord(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3 btn-group">
        {" "}
        {/* Use divs for consistent spacing */}
        <input
          className="btn-check"
          type="checkbox"
          checked={includeSymbols}
          onChange={() => setIncludeSymbols(!includeSymbols)}
          id="includeSymbols"
        />
        <label className="btn btn-outline-primary" htmlFor="includeSymbols">
          Symbols
        </label>
        <input
          className="btn-check"
          type="checkbox"
          checked={includeNumbers}
          onChange={() => setIncludeNumbers(!includeNumbers)}
          id="includeNumbers"
        />
        <label className="btn btn-outline-primary" htmlFor="includeNumbers">
          Numbers
        </label>
        <input
          className="btn-check"
          type="checkbox"
          checked={includeUppercase}
          onChange={() => setIncludeUppercase(!includeUppercase)}
          id="includeUppercase"
        />
        <label className="btn btn-outline-primary" htmlFor="includeUppercase">
          Uppercase Letters
        </label>
        <input
          className="btn-check"
          type="checkbox"
          checked={includeLowercase}
          onChange={() => setIncludeLowercase(!includeLowercase)}
          id="includeLowercase"
        />
        <label className="btn btn-outline-primary" htmlFor="includeLowercase">
          Lowercase Letters
        </label>
      </div>
      <div className="mb-3 col-6">
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
      <div className="col-12 d-flex">
        <div className="mb-3 col-5 input-group-lg">
          {" "}
          {/* Enclosed the input for consistency */}
          <input
            type="text"
            className="form-control"
            value={generatedPassword}
            readOnly
          />
        </div>
        <div className="col-auto ms-2" style={{ fontSize: "24px" }}>
          {passwordStrength.emoji}
        </div>
        <div className="col-2">
          <button
            onClick={copyToClipboard}
            className="btn btn-outline-secondary ms-2"
            title="Copy to Clipboard"
          >
            <i className="bi bi-clipboard"></i>
          </button>
          <button
            onClick={refreshPassword}
            className="btn btn-outline-secondary"
            style={{ marginLeft: "10px" }}
            title="Generate New Password"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
      <div className="progress col-5">
        <div
          className={`progress-bar progress-bar-striped ${passwordStrength.barClass}`}
          role="progressbar"
          style={{ width: `${passwordStrength.percent}%` }}
          aria-valuenow={passwordStrength.percent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {passwordStrength.emoji}
        </div>
      </div>
    </div>
  );
}

export default App;
