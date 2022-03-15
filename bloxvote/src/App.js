import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardVoter from "./pages/DashboardVoter";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardVoter />} />
      </Routes>
    </Router>
  );
}
