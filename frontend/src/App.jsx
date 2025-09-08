import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}
