import React from "react";

function Contact() {
  return (
    <div style={styles.container}>
      <h1>Contact Page</h1>
      <p>You can reach us at:</p>
      <p>Email: support@example.com</p>
      <p>Phone: +91 98765 43210</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    background: "#d4edda"
  }
};

export default Contact;