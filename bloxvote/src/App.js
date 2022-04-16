import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserContext";
import AdminAddElection from "./pages/AdminAddElection";
import AdminDashboard from "./pages/AdminDashboard";
import AdminElectionDetails from "./pages/AdminElectionDetails";
import DashboardVoter from "./pages/DashboardVoter";
import ElectionDetailsVoter from "./pages/ElectionDetailsVoter";
import ErrorPage from "./pages/ErrorPage";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  return (
    <UserProvider>
      <ToastContainer></ToastContainer>
      <Router>
        <Routes>
          <Route exact path="/" element={<DashboardVoter />}></Route>
          <Route
            exact
            path="/election/:electionID"
            element={<ElectionDetailsVoter />}
          ></Route>
          <Route exact path="/admin" element={<AdminDashboard />}></Route>
          <Route
            exact
            path="/admin/add/election"
            element={<AdminAddElection />}
          ></Route>
          <Route
            exact
            path="/admin/election/:electionID"
            element={<AdminElectionDetails />}
          ></Route>
          <Route exact path="/nomask" element={<ErrorPage />}></Route>
          <Route exact path="*" element={<PageNotFound />}></Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}
