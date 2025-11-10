import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import SeePets from "./pages/SeePets";
import PetDetail from "./pages/PetDetail";
import AdoptionApplication from "./pages/AdoptionApplication";
import MyApplications from "./pages/MyApplications";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import ResourceDirectory from "./pages/ResourceDirectory";
import AddResource from "./pages/AddResource";
import ResourceDetail from "./pages/ResourceDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import MyPets from "./pages/MyPets";
import PetProfileDetail from "./pages/PetProfileDetail";
import AddHealthLog from "./pages/AddHealthLog";
import Reminders from "./pages/Reminders";
import AddReminder from "./pages/AddReminder";
import AboutTeam from "./pages/AboutTeam";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Pet Adoption Routes */}
        <Route path="/pets" element={<SeePets />} />
        <Route path="/pet/:id" element={<PetDetail />} />
        <Route path="/adopt/:id" element={<AdoptionApplication />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/favorites" element={<Favorites />} />
        
        {/* Resource Directory Routes */}
        <Route path="/resources" element={<ResourceDirectory />} />
        <Route path="/resources/add" element={<AddResource />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        
        {/* Events Routes */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        {/* Pet Profiles Routes */}
        <Route path="/my-pets" element={<MyPets />} />
        <Route path="/pet-profile/:id" element={<PetProfileDetail />} />
        
        {/* Health Logs Routes */}
        <Route path="/health-logs/add" element={<AddHealthLog />} />
        
        {/* Reminders Routes */}
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/reminders/add" element={<AddReminder />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Other Routes */}
        <Route path="/aboutTeam" element={<AboutTeam />} />
      </Routes>
    </BrowserRouter>
  );
}
