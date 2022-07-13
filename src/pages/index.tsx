import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Line from "../components/line";
import wordsArray from "../words.js";

function Home() {
  const [solution, setSolution] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    setSolution(wordsArray[Math.floor(Math.random() * wordsArray.length) + 1]);
  }, []);
  console.log(solution);

  const onSubmitToggle = (hideBtn: boolean) => {
    setCanSubmit(hideBtn);
  }

  return (
    <div className="flex flex-col max-w-screen-md items-center m-auto p-4 text-5xl text-slate-700">
      <h1>Wordle!</h1>
      <hr className="p-4" />
      <Line key="word_1" solution={solution} onSubmitToggle={onSubmitToggle}></Line>
      <Line key="word_2" solution={solution} onSubmitToggle={onSubmitToggle}></Line>
      <Line key="word_3" solution={solution} onSubmitToggle={onSubmitToggle}></Line>
      <Line key="word_4" solution={solution} onSubmitToggle={onSubmitToggle}></Line>
      <Line key="word_5" solution={solution} onSubmitToggle={onSubmitToggle}></Line>
      <hr className="p-4" />
      <button className="uppercase p-4 text-white bg-blue-500 rounded" style={canSubmit ? { display:'block'} : {display : 'none'}}>Submit</button>
    </div>
  );
}

export default Home;
