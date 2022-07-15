import { useState, useEffect } from "react";

import "tailwindcss/tailwind.css";

import Confetti from "react-dom-confetti";
import Line from "../components/line";
import wordsArray from "../words.js";

function Home() {
  const [solution, setSolution] = useState("");
  const [guess, setGuess] = useState<any>([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [activeLine, setActiveLine] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameState, setGameState] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [validateConfig, setValidateConfig] = useState<any>([
    [null],
    [null],
    [null],
    [null],
    [null],
    [null],
  ]);

  const [keyboard, setKeyboard] = useState([
    { letter: "A", validation: "" },
    { letter: "B", validation: "" },
    { letter: "C", validation: "" },
    { letter: "D", validation: "" },
    { letter: "E", validation: "" },
    { letter: "F", validation: "" },
    { letter: "G", validation: "" },
    { letter: "H", validation: "" },
    { letter: "I", validation: "" },
    { letter: "J", validation: "" },
    { letter: "K", validation: "" },
    { letter: "L", validation: "" },
    { letter: "M", validation: "" },
    { letter: "N", validation: "" },
    { letter: "O", validation: "" },
    { letter: "P", validation: "" },
    { letter: "Q", validation: "" },
    { letter: "R", validation: "" },
    { letter: "S", validation: "" },
    { letter: "T", validation: "" },
    { letter: "U", validation: "" },
    { letter: "V", validation: "" },
    { letter: "W", validation: "" },
    { letter: "X", validation: "" },
    { letter: "Y", validation: "" },
    { letter: "Z", validation: "" },
  ]);

  useEffect(() => {
    setSolution(wordsArray[Math.floor(Math.random() * wordsArray.length) + 1]);
  }, []);

  useEffect(() => {
    // move focus to next line
    let nextLineInput = document.getElementById(
      "line_" + activeLine + "_letter_0"
    );
    //console.log(nextLineInput);
    if (nextLineInput) {
      nextLineInput.focus();
    }
  }, [activeLine]);

  //console.log(solution);

  const onSubmitToggle = (hideBtn: boolean, submitGuess?: Array<[]>) => {
    setCanSubmit(hideBtn);
    if (submitGuess) {
      setGuess(submitGuess);
    }
  };

  const onError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  function checkWord(word: string) {
    return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
      .then((res) => res.json())
      .then((res) => {
        //console.log(res);

        if (res[0] !== undefined) {
          if (res[0].hasOwnProperty("word")) {
            //console.log("YES");
            return true;
          }
        }

        if (res.title == "No Definition Found") {
          console.log("NO");
          return false;
        }
      });
  }

  const refreshPage = () => {
    window.location.reload();
  };

  const confettiConfig = {
    duration: 2000,
  };

  async function evaluateGuess() {
    let validation: any[] = [];
    let guessString = guess.join("");

    // check dictionary
    let isWord = await checkWord(guessString);
    //console.log(isWord);

    if (!isWord) {
      onError("That's not a word!");
      return;
    }
    if (!wordsArray.includes(guessString)) {
      onError("That word isn't in our database, sorry!");
      return;
    }

    for (let i = 0; i < solution.length; i++) {
      let isCorrect = "incorrect";
      if (solution.includes(guess[i])) {
        isCorrect = "almost";
      }

      if (solution[i] == guess[i]) {
        isCorrect = "correct";
      }

      let alphabet = keyboard;
      let filteredLetter = alphabet.find((obj) => {
        return obj.letter == guess[i];
      });

      if (filteredLetter) {
        if (filteredLetter.validation != "correct") {
          filteredLetter.validation = isCorrect;
        }
      }
      setKeyboard(alphabet);

      validation.push(isCorrect);
    }
    let currentConfig: any[] = validateConfig;
    let lineIndex: number = activeLine;
    currentConfig[lineIndex] = validation;

    setValidateConfig(currentConfig);
    setActiveLine(activeLine + 1);
    setCanSubmit(false);

    if (solution == guessString) {
      setGameState("WON");
      setConfetti(true);

      // disable all inputs
      setActiveLine(-1);

      return;
    }

    if (solution !== guessString && activeLine > 4) {
      setGameState("LOST");
      return;
    }
  }

  return (
    <div className="flex flex-col max-w-screen-md items-center p-4 text-5xl text-slate-700 m-auto">
      <hr className="p-1" />
      <h1>Wordle!</h1>
      <hr className="p-1" />
      {validateConfig.map((config: [], index: number) => {
        let isLineActive = false;
        if (index == activeLine) {
          isLineActive = true;
        }
        return (
          <Line
            key={"line_+" + index}
            validation={config}
            onSubmitToggle={onSubmitToggle}
            evaluateGuess={evaluateGuess}
            isLineActive={isLineActive}
            lineIndex={index}
          ></Line>
        );
      })}

      <hr className="p-1" />
      <div className="flex max-w-xs flex-wrap justify-center">
        {keyboard.map(
          (abc: { letter: string; validation: string }, index: number) => {
            return (
              <div
                key={abc.letter + "__" + index}
                className={
                  "bg-white rounded text-center text-lg w-6 m-1 shadow-md shadow-slate-400 " +
                  abc.validation
                }
              >
                {abc.letter}
              </div>
            );
          }
        )}
      </div>
      <hr className="p-1" />
      <Confetti config={confettiConfig} active={confetti} />
      <button
        onClick={evaluateGuess}
        className="uppercase p-1 text-white bg-blue-500 rounded"
        style={canSubmit ? { display: "block" } : { display: "none" }}
      >
        Submit
      </button>
      <div
        className="p-4"
        style={gameState == "LOST" ? { display: "block" } : { display: "none" }}
      >
        <p className="text-center">Bad luck!</p>
        <p>The solution was:</p>
        <p className="text-center">{solution}</p>
      </div>
      <div
        className="p-4"
        style={gameState == "WON" ? { display: "block" } : { display: "none" }}
      >
        <p className="text-center">You won!</p>
      </div>
      <button
        onClick={refreshPage}
        className="uppercase p-4 text-white bg-green-500 rounded"
        style={gameState == "" ? { display: "none" } : { display: "block" }}
      >
        New word
      </button>
      <div className="p-4 text-red-500 text-center">{errorMessage}</div>
    </div>
  );
}

export default Home;
