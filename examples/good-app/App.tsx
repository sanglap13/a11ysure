import React from "react";

export default function App() {
  return (
    <main>
      <header>
        <h1>Welcome to A11yScore Demo</h1>
        <h2>Accessible React Example</h2>
      </header>

      <section>
        <img src="/logo.png" alt="A11yScore company logo" />

        <button
          type="button"
          aria-label="Open welcome alert"
          onClick={() => alert("Welcome!")}
        >
          Open Alert
        </button>
      </section>

      <section>
        <form>
          <div>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" aria-describedby="nameHelp" />
            <small id="nameHelp">Please enter your full name.</small>
          </div>

          <button type="submit">Submit Form</button>
        </form>
      </section>

      <footer>
        <a href="/about">Learn more about our accessibility standards</a>
      </footer>
    </main>
  );
}
