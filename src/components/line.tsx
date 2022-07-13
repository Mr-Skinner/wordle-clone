import { useState } from "react";

interface LineProps {
  onSubmitToggle: (hideBtn: boolean, submitGuess?: any[]) => any;
  validation: any[];
  isLineActive: boolean;
  lineIndex: number;
}

function Line({ onSubmitToggle, validation, isLineActive, lineIndex }: LineProps) {
  const [currentGuess, setCurrentGuess] = useState<any>([null, null, null, null, null]);
  const [lineIsActive, setLineActive] = useState<boolean>(isLineActive ? true : false);

  const OnLetterInput = (letterInput: string, letterIndex: string) => {
    let guesses = currentGuess;
    let realIndex: number = parseInt(letterIndex.split("_")[3]);

    if (letterInput == "") {
      // remove any current letter guess at that index
      guesses[realIndex] = null;
      onSubmitToggle(false);
    }

    if (!letterInput.match("^[a-zA-Z]{1}$")) {
      return;
    }

    guesses[realIndex] = letterInput.toUpperCase();
    setCurrentGuess(guesses);

    //console.log(guesses);
    if (!guesses.includes(null) && guesses.length == 5) {
      // we're ready to submit!
      onSubmitToggle(true, currentGuess);
    } else {
      onSubmitToggle(false);
      // move to next input if available
      if (realIndex < 4) {
        let nextInput = document.getElementById("line_" + lineIndex + "_letter_" + (realIndex + 1));
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  return (
    <div className="rounded mx-md p-4 border-gray-100 flex gap-2">
      {currentGuess.map((letter: string, index: number) => {
        return (
          <div
            key={index}
            className={
              "bg-white rounded mx-md p-2 border-gray-100 shadow-sm align-middle text-center " +
              validation[index]
            }
          >
            <input
              id={"line_" + lineIndex + "_letter_" + index}
              type="text"
              disabled={isLineActive ? false : true}
              className={
                "w-12 text-center align-middle focus-within:outline-none uppercase bg-transparent"
              }
              maxLength={1}
              size={1}
              onInput={(event: any) =>
                OnLetterInput(event.target.value, event.target.id)
              }
            />
          </div>
        );
      })}
    </div>
  );
}

export default Line;
