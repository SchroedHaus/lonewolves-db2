import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/SignUp";
import Success from "./pages/Success";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRouter";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SignUp /> },
      { path: "/signup", element: <SignUp /> },
      {
        path: "/success",
        element: (
          <PrivateRoute>
            <Success />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        ),
      },
      { path: "/signin", element: <SignIn /> },
      { path: "*", element: <SignUp /> },
    ],
  },
]);