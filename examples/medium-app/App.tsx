import React from "react";

export default function App() {
  return (
    <main>
      <h1>Main Title</h1>
      <h2>Subheading</h2>

      <img src="/logo.png" alt="Company logo" />

      <button onClick={() => alert("Clicked!")}>Click Me</button>

      <form>
        <label>
          Name:
          <input type="text" />
        </label>

        <button type="submit">Submit</button>
      </form>

      <a href="#">Click here</a>

      <div style={{ color: "#ccc", backgroundColor: "#fff" }}>
        Slight contrast issue
      </div>
    </main>
  );
}
