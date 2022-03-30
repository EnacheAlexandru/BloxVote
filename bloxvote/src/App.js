import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminAddElection from "./pages/AdminAddElection";
import DashboardVoter from "./pages/DashboardVoter";
import ElectionDetailsVoter from "./pages/ElectionDetailsVoter";

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
        {/* <Route path="*"></Route> */}
      </Routes>
    </Router>
  );
}
