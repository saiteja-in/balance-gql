import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Background from "./components/background.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri:import.meta.env.VITE_NODE_ENV === "production" ? "http://localhost:4000/graphql":"/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Background>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Background>
    </BrowserRouter>
  </StrictMode>
);
