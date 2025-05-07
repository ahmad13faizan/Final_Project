// components/AppRoutes.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Register from "../components/Register";
import MainDashboard from "../pages/MainDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ProtectedRoute from "../components/ProtectedRoutes";
import Unauthorized from "../error/Unauthorized";
import Not_Found from "../error/Not_Found";
import UserTable from "../pages/UserTable";
import Footer from "../components/footer/Footer";
import Onboarding from "../pages/admin/Onboarding";
import Onboarding2 from "../pages/admin/Onboarding2";
import Onboarding3 from "../pages/admin/Onboarding3";
import ThankYouPage from "../pages/admin/ThankYouPage";
import "../styles/common.scss";
import AWSDashboard from "../pages/AWSDashboard";
import Cost_Explorer from "../pages/Cost_Explorer";

const AppRoutes = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  const userLoggedIn = token !== null;

  // decide landing path based on role
  const defaultPath =
    role === "ROLE_ADMIN"     ? "/home" :
    role === "ROLE_CUSTOMER"  ? "/customer" :
    role === "ROLE_READ_ONLY" ? "/readonly" :
                                 "/login";

  const showNavbar =
    userLoggedIn &&
    /^\/(home|customer|readonly|register)/.test(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* if already logged in, redirect away from login */}
        <Route
          path="/login"
          element={
            userLoggedIn
              ? <Navigate to={defaultPath} replace state={{ from: location }} />
              : <Login />
          }
        />
        <Route
          path="/"
          element={
            userLoggedIn
              ? <Navigate to={defaultPath} replace state={{ from: location }} />
              : <Navigate to="/login" replace />
          }
        />

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
          <Route path="/readonly" element={<MainDashboard />}>
            <Route index element={<UserTable />} />
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
