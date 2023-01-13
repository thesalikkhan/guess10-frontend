import axios from "axios";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
const Guess10 = (props) => {
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/guess10");
        setCategory(response.data.category);
        setItems(response.data.items);
        setTotal(response.data.items.length);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userAnswers = inputValue.split(",");
    const duplicate = answers.find((answer) => answer.answer === inputValue);
    if (duplicate) {
      setError("You already submitted this answer");
      return;
    }
    try {
      const result = userAnswers.map((answer) => {
        const normalizeAnswer = answer.trim().toLowerCase();
        if (
          items.some((item) => item.toLowerCase().includes(normalizeAnswer))
        ) {
          setScore((prevScore) => prevScore + 1);
          return { answer: answer, correct: true };
        } else {
          return { answer: answer, correct: false };
        }
      });
      setAnswers([...answers, ...result]);
      setInputValue("");
      setError(null);
    } catch (error) {
      console.error(error);
    }
  };
  const handleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  return (
    <>
      <center>
        <h2>Guess10</h2>
        <nav>
          Guess the 10 best or worst something and see if you&apos;re correct.
          The lists are AI Generated.
        </nav>
      </center>
      <br />
      <hr />
      <br />
      <div className="guess10-container">
        {score === 10 && <Confetti />}
        <div className="question-container">
          <h3>{category}</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your answer"
            />{" "}
            &nbsp;
            <button type="submit">Submit</button>
            {score !== null && (
              <p>
                You scored {score} out of {total}
              </p>
            )}
          </form>
        </div>
        <div className="answers-container">
          <h2>Submitted Answers</h2>
          <ul>
            {answers.map((answer, index) => (
              <li key={index}>
                {answer.answer} - {answer.correct ? "Correct" : "Incorrect"}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="show-answers-container">
        <button onClick={handleShowAnswers}>
          {showAnswers ? "Hide answers" : "Show answers"}
        </button>
        {showAnswers && (
          <div className="items-container">
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Guess10;
