import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/main.css";
import { LanguageProvider } from "./Context/LangContext.jsx";
import { AuthProvider } from "./Context/TokenContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import PostAd from "./Pages/PostAd.jsx";
import InsertingAttribute from "./Pages/InsertingCategory.jsx";
import SearchingWrapper from "./Components/SearchingWrapper.jsx";
import SearchingPage from "./Pages/SearchingPage.jsx";
import { LocationProvider } from "./Context/LocationProvider.jsx";
import ListingDetails from "./Pages/ListingDetails.jsx";
import SubCategoriesSelector from "./Components/SubCategoriesFromHome.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import MessagesPage from "./Pages/Messages.jsx";
import Register from "./Pages/Register.jsx";
import RechargeCoins from "./Pages/RechargeCoins.jsx";
import { ToastContainer } from "react-toastify";
import UserProfile from "./Pages/Profile.jsx";
import AdVerfication from "./Pages/AdVerfication.jsx";
import MyAds from "./Pages/MyAdsAndForAdminPagenation.jsx";
import ListingReportsContainer from "./Pages/ListingReportVerfications.jsx";
import ClientsTable from "./Pages/Clients.jsx";
import MyFavorites from "./Pages/MyFavorites.jsx";
import SettingsPage from "./Pages/SettingsPage.jsx";
import AdminCoinsManager from "./Pages/AdminCoinsManager.jsx";
import AboutPage from "./Pages/Aboutus.jsx";
import ContactUsSection from "./Pages/ContactUs.jsx";
import UpdateContactInfo from "./Pages/UpdateContacts.jsx";
import TermsAndPrivacy from "./Pages/TermsAndPrivacy.jsx";

const clientId =
  "711767028404-59t8c0804kcoomt50mfcfpiulcj2fdqi.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <LocationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/PostAd" element={<PostAd />} />
                <Route
                  path="/Admin/AddNewCategory"
                  element={<InsertingAttribute />}
                />
                <Route path="/Searching" element={<SearchingWrapper />} />
                <Route path="/Profile" element={<UserProfile />} />
                <Route path="/MyAds" element={<MyAds />} />
                <Route path="/ContactUs" element={<ContactUsSection />} />
                <Route
                  path="/Admin/UpdateContacts"
                  element={<UpdateContactInfo />}
                />
                <Route path="/Settings" element={<SettingsPage />} />
                <Route path="/PrivacyAndTerms" element={<TermsAndPrivacy />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/MyFavourits" element={<MyFavorites />} />
                <Route path="/ViewMore" element={<SearchingPage />} />
                <Route path="/Listing/:id" element={<ListingDetails />} />
                <Route path="/Admin/Coins" element={<AdminCoinsManager />} />
                <Route path="/Admin/Clients" element={<ClientsTable />} />
                <Route path="/AboutUs" element={<AboutPage />} />
                <Route path="/RechargingCoins" element={<RechargeCoins />} />
                <Route
                  path="Admin/ListingReports"
                  element={<ListingReportsContainer />}
                />
                <Route
                  path="/Admin/AdVerification"
                  element={<AdVerfication />}
                />
                <Route path="/Messages" element={<MessagesPage />} />
                <Route
                  path="/SubCategories"
                  element={<SubCategoriesSelector />}
                />
              </Routes>
              <ToastContainer position="top-center" autoClose={4000} />
            </Router>
          </LocationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
