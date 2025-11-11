import { Navigate, useOutlet } from "react-router";
import { useSelector } from "react-redux";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

export default function GhostGuard() {
  const outlet = useOutlet();
  const { isAuthenticated, status, loginError } = useSelector((state) => state.auth);

  const urlParam = new URLSearchParams(window.location.search).get(REDIRECT_URL_KEY);
  const redirectUrl = urlParam && urlParam !== "null" ? urlParam : null;

  if (isAuthenticated && status === 'succeeded' && !loginError) {
    return <Navigate to={redirectUrl || HOME_PATH} replace />;
  }

  return <>{outlet}</>;
}
