// javascript
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext.jsx";
// import "primeicons/primeicons.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChakraProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </ChakraProvider>
  </BrowserRouter>
);

