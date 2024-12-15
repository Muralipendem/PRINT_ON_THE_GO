import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import MapComponent from "./pages/home/map";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="md:p-4 lg:p-4  h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <>
                 <Home />
                 
              </>
            ) : (
              <Navigate to={"/login"} />
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
          element={authUser ? <MapComponent /> :<Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
