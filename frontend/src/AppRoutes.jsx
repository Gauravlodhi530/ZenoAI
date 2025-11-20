import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/welcome"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />}
        />
  
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/" : "/register"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
