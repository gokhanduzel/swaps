import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import CreateItemPage from "./pages/CreateItemPage";
import ItemsPage from "./pages/ItemsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { persistor } from "./app/store";
import ProtectedRoute from "./components/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import TokenRefresher from "./components/TokenRefresher";
import useInactivityTimeout from "./hooks/useInactivityTimeout";

function App() {

  // useInactivityTimeout();
  
  return (
    <PersistGate loading={null} persistor={persistor}>
      <TokenRefresher />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/createitem"
            element={
              <ProtectedRoute>
                <CreateItemPage />
              </ProtectedRoute>
            }
          />
          <Route path="/swaps" element={<ItemsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </PersistGate>
  );
}

export default App;
