import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes"; // Import AppRoutes
import { TimeBlockProvider } from "./context/TimeBlockContext"; // Import TimeBlockProvider
import { TimerProvider } from "./context/TimerContext"; // Import TimerProvider
import Header from "./components/Header/Header"; // Import Header component

const App: React.FC = () => {
  return (
    <TimerProvider>
      <TimeBlockProvider>
        <div className="App">
          <BrowserRouter>
            <Header /> {/* Always render Header */}
            <AppRoutes />
          </BrowserRouter>
        </div>
      </TimeBlockProvider>
    </TimerProvider>
  );
};

export default App;