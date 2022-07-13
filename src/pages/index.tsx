import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Line from "../components/line";
import wordsArray from "../words.js";

function Home() {
  const [solution, setSolution] = useState("");
  const [guess, setGuess] = useState<any>([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [activeLine, setActiveLine] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameState, setGameState] = useState("");
  const [validateConfig, setValidateConfig] = useState<any>([
    [null],
    [null],
    [null],
    [null],
    [null],
  ]);

  useEffect(() => {
    setSolution(wordsArray[Math.floor(Math.random() * wordsArray.length) + 1]);
  }, []);

  console.log(solution);

  const onSubmitToggle = (hideBtn: boolean, submitGuess?: Array<[]>) => {
    setCanSubmit(hideBtn);
    if (submitGuess) {
      setGuess(submitGuess);
    }
  };

  const onError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {setErrorMessage('')}, 2000);
  };

  const checkWord = (word: string) => {
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+word)
    .then(res =>res.json())
    .then(res => {
      if (res.title == 'No Definitions Found') {
        onError("That's not a word!");
      }
      return
    })
  };

  const evaluateGuess = () => {
    let validation: any[] = [];
    let guessString = guess.join("");

    if (!wordsArray.includes(guessString)) {
      checkWord(guessString);
      return
    }

    for (let i = 0; i < solution.length; i++) {
      let isCorrect = "incorrect";
      if (solution.includes(guess[i])) {
        isCorrect = "almost";
      }

      if (solution[i] == guess[i]) {
        isCorrect = "correct";
      }
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
      return
    }

    if (solution !== guessString && activeLine > 3 ) {
      setGameState("LOST");
      return
    }
  };

  return (
    <div className="flex flex-col max-w-screen-md items-center m-auto p-4 text-5xl text-slate-700">
      <hr className="p-4" />
      <h1>Wordle!</h1>
      <hr className="p-4" />
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
            isLineActive={isLineActive}
          ></Line>
        );
      })}

      <hr className="p-4" />
      <button
        onClick={evaluateGuess}
        className="uppercase p-4 text-white bg-blue-500 rounded"
        style={canSubmit ? { display: "block" } : { display: "none" }}
      >
        Submit
      </button>
      <div className="p-4" style={gameState == "LOST" ? {display: "block"} : {display: "none"}}>
        <p className="text-center">Bad luck!</p>
        <p>The solution was:</p>
        <p className="text-center">{solution}</p>
      </div>
      <div className="p-4" style={gameState == "WON" ? {display: "block"} : {display: "none"}}>
        <p className="text-center">You won!</p>
      </div>
      <div className="p-4 text-red-500">
        {errorMessage}
      </div>
    </div>
  );
}

export default Home;
