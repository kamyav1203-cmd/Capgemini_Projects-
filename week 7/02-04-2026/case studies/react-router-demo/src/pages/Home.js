import React from "react";

function Home() {
  return (
    <div style={styles.container}>
      <h1>Home Page</h1>
      <p>Welcome to our React Router Demo Application.</p>
      <p>This is the homepage where users land first.</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    background: "#f0f8ff"
  }
};

export default Home;