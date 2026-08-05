import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Router from "./router";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}