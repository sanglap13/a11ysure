import React from "react";

export default function App() {
  return (
    <div>
      <h1>Main Title</h1>
      <h3>Skipped Heading Level</h3>

      <img src="/logo.png" />

      <div onClick={() => alert("Clicked!")}>Click Me</div>

      <form>
        <input type="text" placeholder="Enter name" />
        <button>Submit</button>
      </form>

      <a href="#">Click here</a>

      <div style={{ color: "#aaa", backgroundColor: "#fff" }}>
        Low contrast text
      </div>
    </div>
  );
}
