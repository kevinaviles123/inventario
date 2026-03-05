import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import LoadingSpinner from "./components/Common/LoadingSpinner";

// Lazy load pages para mejor rendimiento
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Movements = lazy(() => import("./pages/Movements"));
const Reports = lazy(() => import("./pages/Reports"));
const Offline = lazy(() => import("./pages/Offline"));
const Alerts = lazy(() => import("./pages/Alerts"));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/offline" element={<Offline />} />
          
          <Route
            path="/"
            element={
              user ? <Layout /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="movements" element={<Movements />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;