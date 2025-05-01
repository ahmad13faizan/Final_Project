// components/AppRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Register from "../components/Register";
import MainDashboard from "../pages/MainDashboard";
import CustomerDashboard from "../pages/CustomerDashboard";
import ReadOnlyDashboard from "../pages/Read-OnlyDashboard";
import ProtectedRoute from "../components/ProtectedRoutes";
import Unauthorized from "../error/Unauthorized";
import Not_Found from "../error/Not_Found";
import UserTable from "../pages/UserTable";
import Footer from "../components/footer/Footer";
import Onboarding from "../components/admin_components/Onboarding";
import Onboarding2 from "../components/admin_components/Onboarding2";
import Onboarding3 from "../components/admin_components/Onboarding3";
import ThankYouPage from "./admin_components/ThankYouPage";
import "../styles/common.scss";
import AWSDashboard from "../components/admin_components/AWSDashboard";
import Cost_Explorer from "./admin_components/Cost_Explorer";

const AppRoutes = () => {
  const location = useLocation();
  const userLoggedIn = localStorage.getItem("token") !== null;
  const showNavbar =
    userLoggedIn &&
    /^\/(home|customer|readonly|register)/.test(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/home" element={<MainDashboard />}>
            <Route index element={<UserTable />} />
            <Route path="register" element={<Register />} />
            <Route path="edit/:id" element={<Register editUser={true} />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="onboarding2" element={<Onboarding2 />} />
            <Route path="onboarding3" element={<Onboarding3 />} />
            <Route path="thank-you" element={<ThankYouPage />} />
            <Route path="aws" element={<AWSDashboard />} />
            <Route path="cost" element={<Cost_Explorer />} />
          </Route>
        </Route>

        {/* Customer */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]} />}>
          <Route path="/customer" element={<MainDashboard />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="aws" element={<AWSDashboard />} />
          <Route path="cost" element={<Cost_Explorer />} />
          
          </Route>
        </Route>

        {/* Read Only */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_READ_ONLY"]} />}>
          <Route path="/readonly" element={<MainDashboard />} >
            <Route index  element={<UserTable />} />
            <Route path="aws" element={<AWSDashboard />} />
            <Route path="cost" element={<Cost_Explorer />} />
            
          </Route>

        </Route>

        <Route path="/error" element={<Unauthorized />} />
        <Route path="*" element={<Not_Found />} />
      </Routes>

      <Footer />
    </>
  );
};

export default AppRoutes;
