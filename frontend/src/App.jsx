import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import MapComponent from "./pages/home/map";
import { Orders } from "./pages/home/orders";
import MaplibreUe from "./pages/home/map";
import MaplibreComponent from "./pages/home/map";
import Dashboard from "./pages/dashboard/Dashboard";
import MessagesHome from "./pages/home/Home";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="h-screen flex items-center bg-white justify-center">
      <Routes>
      <Route path="/home" element={<Home />} />
        <Route
          path="/"
          element={
            authUser ? (
              <>
                 <Dashboard />
                 
              </>
            ) : (
              <Navigate to={"/home"} />
            )
          }
        />

       
       
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/map"
          element={authUser ? <MaplibreComponent /> :<Navigate to="/" />}
        />
        <Route
          path="/orders"
          element={authUser ? <Orders /> :<Navigate to="/" />}
        />
         <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="/chat" element={<MessagesHome />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
