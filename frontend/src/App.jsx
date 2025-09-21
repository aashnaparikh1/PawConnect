import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SeePets from "./pages/SeePets";
import AboutPet from "./pages/AboutPet";

export default function App() {
  return (
    <>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/pets" element={<SeePets />}></Route>
      </Routes>
      </BrowserRouter>
      <AboutPet/>
    </>
  );
}
