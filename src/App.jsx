import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Body from "./components/Body";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <Body />
    </div>
  );
}

export default App;