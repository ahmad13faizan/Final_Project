import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Register from '../components/Register';
import AdminDashboard from '../pages/AdminDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';
import ReadOnlyDashboard from '../pages/Read-OnlyDashboard';
import ProtectedRoute from '../components/ProtectedRoutes';
import Unauthorized from '../error/Unauthorized';
import Not_Found from '../error/Not_Found';
import '../styles/common.scss';
import Footer from "../components/footer/Footer";


const AppRoutes = () => {
  const location = useLocation();

  const userLoggedIn = localStorage.getItem("token") !== null;
  const showNavbar = userLoggedIn && /^\/(admin|customer|readonly|register)/.test(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
   
      

      <Routes>
        <Route path="/login" element={<Login />} />4
        <Route path="/" element={<Login />} />

        {/* Nested Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        

        <Route element={<ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]} />}>
          <Route path="/customer" element={<CustomerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ROLE_READ_ONLY"]} />}>
          <Route path="/readonly" element={<ReadOnlyDashboard />} />
        </Route>

        <Route path="/error" element={<Unauthorized />} />
        <Route path="*" element={<Not_Found />} />

      </Routes>
      <Footer/>
   
     
    </>
  );
};

export default AppRoutes;
