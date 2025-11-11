import { Navigate, useLocation, useOutlet } from "react-router";
import { useSelector } from "react-redux";
import { GHOST_ENTRY_PATH, REDIRECT_URL_KEY } from "../constants/app.constant";

export default function AuthGuard() {
    const outlet = useOutlet();
    const { isAuthenticated, status } = useSelector((state) => state.auth);
    const location = useLocation();

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-dark-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={`${GHOST_ENTRY_PATH}?${REDIRECT_URL_KEY}=${location.pathname}`}
                replace
            />
        );
    }

    return <>{outlet}</>;
}
