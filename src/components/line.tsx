import { useState } from "react";

interface LineProps {
  onSubmitToggle: (hideBtn: boolean) => any;
  solution: string;
}

function Line({ solution, onSubmitToggle }: LineProps) {
  const [currentGuess, setCurrentGuess] = useState("");
  const inputs = [null, null, null, null, null];
  const evaluateGuess = (letterInput: string) => {
    console.log(letterInput);
    if (!letterInput.match("^[a-zA-Z]{1}$")) {
      return;
    }
  };

  return (
    <div className="rounded mx-md p-4 border-gray-100 flex gap-2">
      {inputs.map(() => {
        return (
          <div className="bg-white rounded mx-md p-2 border-gray-100 shadow-sm align-middle text-center">
            <input
              type="text"
              className="w-12 text-center align-middle focus-within:outline-none uppercase"
              maxLength={1}
              onKeyDown={(event: any) => evaluateGuess(event.key)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Line;
