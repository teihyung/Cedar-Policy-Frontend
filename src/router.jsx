import { useRoutes } from "react-router-dom";
import Login from "./pages/login/login";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function Router() {
  return useRoutes([
    { path: "/login", element: <Login /> },
    {
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ path: "/", element: <Dashboard /> }],
    },
  ]);
}