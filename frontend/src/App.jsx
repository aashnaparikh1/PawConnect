import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import AdoptionForm from "./pages/AdoptionForm";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SeePets from "./pages/SeePets";
import AboutPet from "./pages/AboutPet";
import AboutTeam from "./pages/AboutTeam";

export default function App() {
  return (
    <>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/pets" element={<SeePets />}></Route>
        <Route path="/adoptionForm" element={<AdoptionForm />}></Route>
        <Route path = "/aboutPet" element={<AboutPet/>}></Route>
        <Route path = "/aboutTeam" element={<AboutTeam />}></Route>
      </Routes>
      </BrowserRouter>
      {/* <AboutPet/> */}
    </>
  );
}
