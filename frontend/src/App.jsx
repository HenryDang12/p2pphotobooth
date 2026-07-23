import React from "react";
import CameraSwitcher from "./components/CameraSwitcher";

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          PhotoBooth DCK
        </h1>
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
          <CameraSwitcher />
        </div>
      </div>
    </div>
  );
}

export default App;
