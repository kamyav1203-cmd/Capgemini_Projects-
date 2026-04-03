import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

function Home() {
  const { text } = useContext(LanguageContext);

  return (
    <div className="container">
      <h1>{text.title}</h1>
      <p>{text.description}</p>
    </div>
  );
}

export default Home;