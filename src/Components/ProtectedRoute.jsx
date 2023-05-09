import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth.value);

  if (!user.token) {
    return <Navigate to="/" />;
  }
  return children;
};
