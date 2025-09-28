import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/main.css";
import { LanguageProvider } from "./Context/LangContext.jsx";
import { AuthProvider } from "./Context/TokenContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { LocationProvider } from "./Context/LocationProvider.jsx";
import { ToastContainer } from "react-toastify";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Lazy Loading للصفحات
const Login = lazy(() => import("./Pages/Login.jsx"));
const Home = lazy(() => import("./Pages/Home.jsx"));
const PostAd = lazy(() => import("./Pages/PostAd.jsx"));
const InsertingAttribute = lazy(() => import("./Pages/InsertingCategory.jsx"));
const SearchingWrapper = lazy(() =>
  import("./Components/SearchingWrapper.jsx")
);
const SearchingPage = lazy(() => import("./Pages/SearchingPage.jsx"));
const ListingDetails = lazy(() => import("./Pages/ListingDetails.jsx"));
const SubCategoriesSelector = lazy(() =>
  import("./Components/SubCategoriesFromHome.jsx")
);
const ChatPage = lazy(() => import("./Pages/ChatPage.jsx"));
const MessagesPage = lazy(() => import("./Pages/Messages.jsx"));
const Register = lazy(() => import("./Pages/Register.jsx"));
const RechargeCoins = lazy(() => import("./Pages/RechargeCoins.jsx"));
const UserProfile = lazy(() => import("./Pages/Profile.jsx"));
const AdVerfication = lazy(() => import("./Pages/AdVerfication.jsx"));
const MyAds = lazy(() => import("./Pages/MyAdsAndForAdminPagenation.jsx"));
const ListingReportsContainer = lazy(() =>
  import("./Pages/ListingReportVerfications.jsx")
);
const ClientsTable = lazy(() => import("./Pages/Clients.jsx"));
const MyFavorites = lazy(() => import("./Pages/MyFavorites.jsx"));
const SettingsPage = lazy(() => import("./Pages/SettingsPage.jsx"));
const AdminCoinsManager = lazy(() => import("./Pages/AdminCoinsManager.jsx"));
const AboutPage = lazy(() => import("./Pages/Aboutus.jsx"));
const ContactUsSection = lazy(() => import("./Pages/ContactUs.jsx"));
const ResetPasswordForm = lazy(() => import("./Pages/RecetPasswordFrom.jsx"));
const UpdateContactInfo = lazy(() => import("./Pages/UpdateContacts.jsx"));
const TermsAndPrivacy = lazy(() => import("./Pages/TermsAndPrivacy.jsx"));
const EditListing = lazy(() => import("./Pages/UpdateListing.jsx"));
const AdVerificationHistoryContainer = lazy(() =>
  import("./Pages/AdVerficationHistory.jsx")
);

const clientId =
  "711767028404-59t8c0804kcoomt50mfcfpiulcj2fdqi.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <LocationProvider>
            <Router>
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    Loading...
                  </div>
                }
              >
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
                  <Route
                    path="/AdVerficationHistory"
                    element={<AdVerificationHistoryContainer />}
                  />
                  <Route
                    path="/PrivacyAndTerms"
                    element={<TermsAndPrivacy />}
                  />
                  <Route path="/Register" element={<Register />} />
                  <Route path="/MyFavourits" element={<MyFavorites />} />
                  <Route path="/ViewMore" element={<SearchingPage />} />
                  <Route path="/Listing/:id" element={<ListingDetails />} />
                  <Route
                    path="/EditListing/:listingId"
                    element={<EditListing />}
                  />
                  <Route path="/Admin/Coins" element={<AdminCoinsManager />} />
                  <Route path="/Admin/Clients" element={<ClientsTable />} />
                  <Route path="/AboutUs" element={<AboutPage />} />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordForm />}
                  />
                  <Route
                    path="/RechargingCoins"
                    element={
                      <PayPalScriptProvider
                        options={{
                          clientId:
                            "AbaYFaxibJgq266zJBB_hy3PLXvpIMe-EZBMYv_6-S_VncjSAuKdwzVMA92I5KeRtvBEYSaWdNUFEYHG",
                          currency: "USD",
                        }}
                      >
                        <RechargeCoins />
                      </PayPalScriptProvider>
                    }
                  />
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
              </Suspense>
              <ToastContainer position="top-center" autoClose={4000} />
            </Router>
          </LocationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
