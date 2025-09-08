import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}
