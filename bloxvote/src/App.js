import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminAddElection from "./pages/AdminAddElection";
import AdminDashboard from "./pages/AdminDashboard";
import AdminElectionDetails from "./pages/AdminElectionDetails";
import DashboardVoter from "./pages/DashboardVoter";
import ElectionDetailsVoter from "./pages/ElectionDetailsVoter";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardVoter />}></Route>
        <Route
          path="/election/:electionID"
          element={<ElectionDetailsVoter />}
        ></Route>
        <Route
          path="/admin/election/add"
          element={<AdminAddElection />}
        ></Route>
        <Route path="/admin" element={<AdminDashboard />}></Route>
        <Route
          path="/admin/election/:electionID"
          element={<AdminElectionDetails />}
        ></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </Router>
  );
}
