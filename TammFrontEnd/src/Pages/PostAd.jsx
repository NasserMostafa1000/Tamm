import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/main.css";
import CategoriesSelector from "../Components/ParentCategoriesSelector";
import StepFiveListingDetails from "../Components/AddListingStep";
import SubCategoriesSelector from "../Components/SubCategoriesSelector";
import CitySelector from "../Components/CitySelector";
import CityPlaceSelector from "../Components/CityPlaceSelector";
import SuccessMessageBox from "../Components/SuccessMessageBox.jsx";
import { useLanguage } from "../Context/LangContext";
import {
  addListingAddress,
  addListing,
  addListingAttributes,
  uploadListingImages,
  getUserCoins,
} from "../Services/PostAd.js";
import LoadingSpinner from "../Loader/LoadingSpinner.jsx";
import { jwtDecode } from "jwt-decode";
import SideInfoText from "../Components/SideInfoText.jsx";
import { GetCurrentUserId, playNotificationSound } from "../Utils/Constant.js";
import { useNavigate } from "react-router-dom";
import { FaCoins, FaArrowRight, FaArrowLeft, FaUpload } from "react-icons/fa";
import { getAdPrice } from "../Services/AdminCoinsManager.js";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";

export default function PostAd() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const darkMode = mode === "dark";
  const [coins, setCoins] = useState(null);
  const [step, setStep] = useState(1);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const totalSteps = 5;
  const [parentCategoryName, setParentCategoryName] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [selectedCity, setSelectedCity] = useState({ id: null, name: "" });
  const [selectedPlace, setSelectedPlace] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [CityPlaceId, setCityPlaceId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [PriceForAd, setPriceForAd] = useState();
  const navigate = useNavigate();
  const [loadingLabel, setLoadingLabel] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleNext = () => {
    if (step === 1 && parentCategoryId) setStep(2);
    else if (step === 2 && subCategoryId) setStep(3);
    else if (step === 3 && selectedCity.id) setStep(4);
    else if (step === 4 && selectedPlace) setStep(5);
    else {
      toast.warning(
        language === "العربية"
          ? "الرجاء إكمال الحقول المطلوبة"
          : "Please complete the required fields",
        { position: "top-center" }
      );
    }
  };

  useEffect(() => {
    getAdPrice(GetCurrentUserId(localStorage.getItem("userToken")))
      .then((res) => setPriceForAd(res))
      .catch(() => setPriceForAd(0));
  }, []);

  useEffect(() => {
    getUserCoins(GetCurrentUserId(localStorage.getItem("userToken")))
      .then((res) => setCoins(res.coins))
      .catch(() => setCoins(0));
  }, []);

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleParentCategorySelect = (id, name) => {
    setParentCategoryId(id);
    setParentCategoryName(name);
    setSubCategoryId("");
  };

  const getStepDescription = () => {
    const steps = {
      1:
        language === "العربية"
          ? "اختر القسم الرئيسي للإعلان"
          : "Select the main category",
      2:
        language === "العربية"
          ? "اختر القسم الفرعي المناسب"
          : "Select the subcategory",
      3: language === "العربية" ? "اختر المدينة" : "Select the city",
      4:
        language === "العربية"
          ? "اختر المكان داخل المدينة"
          : "Select the place in the city",
      5:
        language === "العربية"
          ? "أضف صور الإعلان وأكد نشره"
          : "Upload images and confirm your ad",
    };
    return `${
      language === "العربية"
        ? `خطوة ${step} من ${totalSteps}: ${steps[step]}`
        : `Step ${step} of ${totalSteps}: ${steps[step]}`
    }`;
  };

  const StepIndicator = () => {
    const steps = [1, 2, 3, 4, 5];
    return (
      <div className="flex items-center justify-center mb-8 select-none">
        {steps.map((s, idx) => (
          <div key={s} className="flex flex-col items-center">
            <div className="relative">
              <div
                className={`rounded-full w-10 h-10 flex items-center justify-center font-medium text-lg transition-all duration-300
                  ${
                    s === step
                      ? darkMode
                        ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : s < step
                      ? darkMode
                        ? "bg-green-900 text-green-200 border-2 border-green-700"
                        : "bg-green-100 text-green-600 border-2 border-green-300"
                      : darkMode
                      ? "bg-gray-700 border-2 border-gray-500 text-gray-300"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
              >
                {s}
                {s < step && (
                  <svg
                    className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </div>
            </div>

            <span
              className={`text-xs mt-2 font-medium ${
                s === step
                  ? darkMode
                    ? "text-indigo-300"
                    : "text-blue-600"
                  : s < step
                  ? darkMode
                    ? "text-green-300"
                    : "text-green-600"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {language === "العربية" ? `خطوة ${s}` : `Step ${s}`}
            </span>

            {idx !== steps.length - 1 && (
              <div
                className={`h-1 w-12 mx-1 rounded-full relative top-5
                ${
                  s < step
                    ? darkMode
                      ? "bg-gradient-to-r from-green-800 to-green-700"
                      : "bg-gradient-to-r from-green-200 to-green-100"
                    : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const showInsufficientBalanceToast = () => {
    toast.error(
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-2">
          <FaCoins className="text-yellow-500 text-xl" />
          <span className="font-bold">
            {language === "العربية"
              ? "الرصيد غير كافي"
              : "Insufficient balance"}
          </span>
        </div>
        <button
          onClick={() => navigate("/RechargingCoins")}
          className={`px-3 py-1 rounded text-sm transition ${
            darkMode
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {language === "العربية" ? "شحن الآن" : "Recharge Now"}
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        className: darkMode ? "dark:bg-gray-800 dark:text-white" : "",
      }
    );
  };

  const PostTheAd = async () => {
    if (Number(coins) < Number(PriceForAd)) {
      showInsufficientBalanceToast();
      playNotificationSound("/failed.mp3");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingLabel(
        language === "العربية" ? "جارٍ إضافة العنوان..." : "Adding address..."
      );

      const listingAddressId = await addListingAddress({
        cityPlaceId: CityPlaceId,
      });

      setLoadingLabel(
        language === "العربية"
          ? "جلب بيانات المستخدم الحالي"
          : "Fetch current user data"
      );

      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const personId = Number(decoded.sub);

      const listingData = {
        personId,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        price,
        listingAddressId,
        subCategoryId,
      };

      setLoadingLabel(
        language === "العربية" ? "جارٍ إضافة الإعلان..." : "Creating the ad..."
      );
      const createdListingId = await addListing(listingData);

      const fullAttributes = attributeValues.map((attr) => ({
        AttributeId: attr.attributeId,
        Value: attr.value,
        ListingId: createdListingId,
      }));

      setLoadingLabel(
        language === "العربية" ? "جارٍ حفظ التفاصيل..." : "Saving details..."
      );
      await addListingAttributes(fullAttributes);

      if (selectedImages.length > 0) {
        setLoadingLabel(
          language === "العربية" ? "جارٍ رفع الصور..." : "Uploading images..."
        );
        await uploadListingImages(createdListingId, selectedImages);
      }

      const message =
        language === "العربية"
          ? "✅ تم إنشاء الإعلان بنجاح!\nسيتم مراجعته من قبل فريق الدعم الفني والموافقة عليه قريبًا إن كان يفي بالشروط والخصوصية لدينا."
          : "✅ Ad created successfully!\nIt will be reviewed by the support team and approved soon if it meets our privacy and policy terms.";

      playNotificationSound("/successed.mp3");
      setSuccessMessage(message);

      setTimeout(() => {
        setStep(1);
        setParentCategoryId("");
        setSubCategoryId("");
        setSelectedCity({ id: null, name: "" });
        setSelectedPlace("");
        setTitleEn("");
        setTitleAr("");
        setDescriptionEn("");
        setDescriptionAr("");
        setPrice("");
        setSelectedImages([]);
        setAttributeValues([]);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("❌ Error posting ad:", error);
      toast.error(
        language === "العربية"
          ? "حدث خطأ أثناء نشر الإعلان"
          : "Error posting ad",
        { className: darkMode ? "dark:bg-gray-800 dark:text-white" : "" }
      );
    } finally {
      setIsLoading(false);
      setLoadingLabel("");
    }
  };

  // مكون زر السابق
  const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center border ${
        darkMode
          ? "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200"
          : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
      } shadow-sm hover:shadow-md`}
    >
      {language === "العربية" ? (
        <>
          <FaArrowLeft className="text-sm transform -translate-y-px" />
          <span>السابق</span>
        </>
      ) : (
        <>
          <FaArrowLeft className="text-sm transform -translate-y-px" />
          <span>Back</span>
        </>
      )}
    </button>
  );

  // مكون زر التالي
  const NextButton = ({ onClick, disabled, selected }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
        disabled
          ? darkMode
            ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : darkMode
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-95"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white active:scale-95"
      } ${darkMode ? "border-gray-600" : "border"} shadow-sm hover:shadow-md`}
    >
      {language === "العربية" ? (
        <>
          <span>التالي</span>
          <FaArrowRight className="text-sm transform -translate-y-px" />
        </>
      ) : (
        <>
          <span>Next</span>
          <FaArrowRight className="text-sm transform -translate-y-px" />
        </>
      )}
    </button>
  );

  // مكون زر النشر
  const PostButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 min-w-[150px] ${
        darkMode
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-95"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white active:scale-95"
      } shadow-md hover:shadow-lg`}
    >
      <FaUpload className="text-sm transform -translate-y-px" />
      {language === "العربية" ? "نشر الإعلان" : "Post Ad"}
    </button>
  );

  return (
    <div
      className={`relative max-w-3xl mx-auto p-4 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* بطاقة العملات */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        onClick={() => navigate("/RechargingCoins")}
        className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg shadow cursor-pointer border z-50 transition-colors ${
          darkMode
            ? "bg-yellow-900 border-yellow-700"
            : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <FaCoins
          className={`text-xl ${
            darkMode ? "text-yellow-400" : "text-yellow-500"
          }`}
        />
        <span
          className={`font-bold ${
            darkMode ? "text-yellow-100" : "text-gray-800"
          }`}
        >
          {coins !== null ? coins : "..."}
        </span>
        <span
          className={`text-xs ${
            darkMode ? "text-yellow-300" : "text-yellow-600"
          }`}
        >
          {language === "العربية" ? "عملات" : "Coins"}
        </span>
      </motion.div>

      {/* شريط التقدم والوصف */}
      <div className="mt-16 mb-8">
        <StepIndicator />
        <p
          className={`text-center text-lg font-medium mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {getStepDescription()}
        </p>
      </div>

      {/* العنوان الرئيسي */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-2xl md:text-3xl font-bold text-center mb-8 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {language === "العربية" ? "نشر إعلان جديد" : "Post a New Ad"}
        <div
          className={`w-24 h-1 mx-auto mt-2 rounded-full ${
            darkMode ? "bg-indigo-500" : "bg-blue-500"
          }`}
        ></div>
      </motion.h1>

      {/* رسالة التحميل أو النجاح */}
      {isLoading && <LoadingSpinner label={loadingLabel} />}
      {successMessage && <SuccessMessageBox message={successMessage} />}

      {/* المحتوى الرئيسي */}
      <div
        className={`rounded-xl shadow-md p-6 mb-8 transition-colors ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {step === 1 && (
          <div className="space-y-6">
            <CategoriesSelector onCategorySelect={handleParentCategorySelect} />
            <div className="flex justify-end">
              <NextButton
                onClick={handleNext}
                disabled={!parentCategoryId}
                selected={!!parentCategoryId}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <SubCategoriesSelector
              parentCategoryId={parentCategoryId}
              parentCategoryName={parentCategoryName}
              onSubCategorySelect={setSubCategoryId}
            />
            <div className="flex justify-between gap-4">
              <BackButton onClick={handlePrev} />
              <NextButton
                onClick={handleNext}
                disabled={!subCategoryId}
                selected={!!subCategoryId}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <CitySelector onCitySelect={setSelectedCity} />
            <div className="flex justify-between gap-4">
              <BackButton onClick={handlePrev} />
              <NextButton
                onClick={handleNext}
                disabled={!selectedCity.id}
                selected={!!selectedCity.id}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <CityPlaceSelector
              cityId={selectedCity.id}
              cityName={selectedCity.name}
              onPlaceSelect={setSelectedPlace}
              setCityPlaceId={setCityPlaceId}
            />
            <div className="flex justify-between gap-4">
              <BackButton onClick={handlePrev} />
              <NextButton
                onClick={handleNext}
                disabled={!selectedPlace}
                selected={!!selectedPlace}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              {language === "العربية" ? "تفاصيل الإعلان" : "Ad Details"}
            </h2>

            <StepFiveListingDetails
              setTitleEn={setTitleEn}
              setTitleAr={setTitleAr}
              setDescriptionEn={setDescriptionEn}
              setDescriptionAr={setDescriptionAr}
              setPrice={setPrice}
              SelectedImages={selectedImages}
              SetSelectedImages={setSelectedImages}
              subCategoryId={subCategoryId}
              setAttributeValues={setAttributeValues}
              parentCategoryId={parentCategoryId}
              parentCategoryName={parentCategoryName}
            />

            <div className="flex justify-between gap-4 pt-4">
              <BackButton onClick={handlePrev} />
              <PostButton onClick={PostTheAd} />
            </div>
          </div>
        )}
      </div>

      {/* معلومات إضافية للشاشات الكبيرة */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-64 p-4">
        <SideInfoText language={language} />
      </div>
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 p-4">
        <SideInfoText
          language={language === "العربية" ? "english" : "arabic"}
        />
      </div>
    </div>
  );
}
