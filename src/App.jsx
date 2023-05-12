import "./App.css";
import "./i18n";
import store from "./Store";
import CustomAppShell from "./Components/CustomAppShell";
import { Provider } from "react-redux";
import { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "./Screens/SignIn";
import { SignUp } from "./Screens/SignUp";
import { NotFound } from "./Screens/NotFound";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { NotificationsProvider } from "@mantine/notifications";
import { IndoorMap } from "./Screens/IndoorMap";

function App() {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
 
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <Provider store={store}>
            <BrowserRouter basename="/connexa/platform">
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route exact path="/" element={<SignIn />} />
                <Route exact path="/signUp" element={<SignUp />} />

                <Route exact path="/indoorMap" element={<IndoorMap />} />

                <Route
                  path="/menu/*"
                  element={
                    <ProtectedRoute>
                      <CustomAppShell />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </Provider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
