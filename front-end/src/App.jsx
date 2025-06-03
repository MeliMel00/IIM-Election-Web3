import React from "react";
import Register from "./components/Register";
import RegisteredList from "./components/RegisteredList";
import Vote from "./components/Vote";
import Results from "./components/Results";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <Register />
      <Vote />
      <RegisteredList />
      <Results />
      <AdminPanel />
    </div>
  );
}

export default App;
