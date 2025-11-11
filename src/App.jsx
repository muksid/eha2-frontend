// Import Dependencies
import { RouterProvider } from "react-router";

// Local Imports
// import { AuthProvider } from "app/contexts/auth/Provider";
import { BreakpointProvider } from "app/contexts/breakpoint/Provider";
import { LocaleProvider } from "app/contexts/locale/Provider";
import { SidebarProvider } from "app/contexts/sidebar/Provider";
import { ThemeProvider } from "app/contexts/theme/Provider";
import router from "app/router/router";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchAuthUser} from "./store/authSlice.js";

// ----------------------------------------------------------------------

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthUser());
  }, [dispatch]);

  return (
      <ThemeProvider>
        <LocaleProvider>
          <BreakpointProvider>
            <SidebarProvider>
              <RouterProvider router={router} />
            </SidebarProvider>
          </BreakpointProvider>
        </LocaleProvider>
      </ThemeProvider>
  );
}

export default App;
