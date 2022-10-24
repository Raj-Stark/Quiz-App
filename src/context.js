import axios from "axios";
import React, { useState, useContext, useEffect } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const tempURL =
  "https://opentdb.com/api.php?amount=10&category=22&difficulty=medium";

const url = "";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);

  const [loading, setLoading] = useState(false);

  const [questions, setQuestion] = useState([]);

  const [index, setIndex] = useState(0);

  const [correct, setCorrect] = useState(0);

  const [error, setError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuestion = async (url) => {
    setLoading(true);
    setWaiting(false);

    const response = await axios(url).catch((e) => console.log(e));

    if (response) {
      const data = response.data.results;

      if (data.length > 0) {
        setQuestion(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      } else {
        setWaiting();
        setError(true);
      }
    } else {
      setWaiting(true);
    }
  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;

      if (index > questions.length - 1) {
        openModal();
        return 0;
      } else {
        return index;
      }
    });
  };

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((old) => old + 1);
    }

    nextQuestion();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setWaiting(true);
    setCorrect(0);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchQuestion(tempURL);
  }, []);

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
