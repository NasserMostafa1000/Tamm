import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCoins,
  FaMoneyBillWave,
  FaShoppingCart,
  FaGem,
  FaChartLine,
} from "react-icons/fa";
import { RiCoinsFill } from "react-icons/ri";
import * as signalR from "@microsoft/signalr";
import { GiCash } from "react-icons/gi";
import { getCoinRate, getAllCoinPackages } from "../Services/AdminCoinsManager";
import { useLanguage } from "../Context/LangContext";
import LoadingSpinner from "../Loader/LoadingSpinner";
import { Helmet } from "react-helmet";
import { ServerPath, SiteNameAR, SiteNameEN } from "../Utils/Constant";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function RechargeCoins() {
  const { language } = useLanguage();
  const [priceHistory, setPriceHistory] = useState([]);
  const [offers, setOffers] = useState([]);
  const [customCoins, setCustomCoins] = useState("");
  const [coinRate, setCoinRate] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [rate, allOffers] = await Promise.all([
        getCoinRate(),
        getAllCoinPackages(),
      ]);
      setCoinRate(rate);
      setOffers(allOffers);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setCustomCoins(value);
      setSelectedOffer(null);
      if (coinRate) {
        setTotalCost(Number(value) * coinRate);
      }
    }
  };

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer.coinId);
    setCustomCoins(offer.coinsAmount);
    setTotalCost(offer.coinPrice);
  };
  useEffect(() => {
    if (customCoins && coinRate) {
      setTotalCost(Number(customCoins) * coinRate);
    } else {
      setTotalCost(0);
    }
  }, [customCoins, coinRate]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${ServerPath}coinHub`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        return connection.invoke("JoinShippingGroup");
      })
      .catch((error) => console.error("SignalR connection error:", error));

    connection.on("ReceiveUpdatedPrices", (data) => {
      console.log("تم تحديث سعر العملة:", data.coinRate);
      setCoinRate(data.coinRate);

      setPriceHistory((prev) => {
        const updated = [...prev, data.coinRate];
        return updated.length > 20 ? updated.slice(1) : updated;
      });
    });

    return () => {
      if (connection.state === "Connected") {
        connection.invoke("LeaveShippingGroup").catch(() => {});
        connection.stop().catch(() => {});
      }
    };
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
  };
  const coinStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${
      language === "العربية" ? `عملة ${SiteNameAR}` : `${SiteNameEN} Coin`
    }`,
    description:
      language === "العربية"
        ? `سعر عملة ${SiteNameAR} الحالي هو ${coinRate} درهم إماراتي. اشحن رصيدك بسهولة عبر الموقع.`
        : `The current rate for ${SiteNameEN} coins is ${coinRate} AED. Recharge your balance easily through the platform.`,
    brand: {
      "@type": "Brand",
      name: language === "العربية" ? SiteNameAR : SiteNameEN,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "AED",
      price: coinRate || "0",
      availability: "https://schema.org/InStock",
      url: window.location.href,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-xl mx-auto rounded-2xl shadow-lg bg-white dark:bg-gray-800 font-sans"
    >
      <Helmet>
        <title>
          {language === "العربية"
            ? `شحن عملات ${SiteNameAR} - السعر الحالي: ${coinRate} درهم`
            : `Recharge ${SiteNameEN} Coins - Current Rate: ${coinRate} AED`}
        </title>
        <meta
          name="description"
          content={
            language === "العربية"
              ? `اشحن عملات ${SiteNameAR} الآن. السعر الحالي هو ${coinRate} درهم.`
              : `Recharge your ${SiteNameEN} coins now. Current rate is ${coinRate} AED.`
          }
        />
        <script type="application/ld+json">
          {JSON.stringify(coinStructuredData)}
        </script>
      </Helmet>

      {/* Header with animated coins */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <RiCoinsFill className="text-4xl text-yellow-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            {language === "العربية"
              ? `شحن عملات ${SiteNameAR}`
              : `Recharge ${SiteNameEN} Coins`}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {language === "العربية"
            ? `قم بشحن رصيدك من عملات ${SiteNameAR} واستمتع بمزايا حصرية داخل التطبيق`
            : `Recharge your ${SiteNameEN} coins and enjoy exclusive app features`}
        </p>
      </motion.div>

      {loading && (
        <LoadingSpinner
          text={
            language === "العربية"
              ? "جاري تحميل البيانات..."
              : "Loading data..."
          }
        />
      )}

      {!loading && (
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {/* Current Rate Section */}
            {coinRate && (
              <motion.div
                variants={cardVariants}
                className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {language === "العربية"
                        ? "السعر الحالي للعملة"
                        : "Current Coin Rate"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {coinRate}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === "العربية" ? "درهم/كوين" : "AED/Coin"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price History Chart */}
            {priceHistory.length > 1 && (
              <motion.div
                variants={cardVariants}
                className="mb-6 bg-white dark:bg-gray-700 p-4 rounded-xl shadow"
              >
                <h4 className="text-center font-semibold mb-2 flex items-center justify-center gap-2">
                  <FaChartLine />
                  {language === "العربية"
                    ? "تغير سعر العملة"
                    : "Coin Price Trend"}
                </h4>
                <div style={{ height: 200 }}>
                  <Line
                    data={{
                      labels: priceHistory.map((_, i) => i + 1),
                      datasets: [
                        {
                          label:
                            language === "العربية" ? "سعر العملة" : "Coin Rate",
                          data: priceHistory,
                          fill: false,
                          borderColor: "#3B82F6",
                          backgroundColor: "#3B82F6",
                          tension: 0.4,
                          pointRadius: 3,
                          pointBackgroundColor: priceHistory.map(
                            (price, idx, arr) => {
                              if (idx === 0) return "gray";
                              return price > arr[idx - 1]
                                ? "#10B981"
                                : price < arr[idx - 1]
                                ? "#EF4444"
                                : "gray";
                            }
                          ),
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: { duration: 300 },
                      scales: {
                        y: {
                          beginAtZero: false,
                          grid: {
                            color: "#E5E7EB",
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.parsed.y.toFixed(2)} AED/Coin`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Offers Section */}
            <motion.div variants={cardVariants} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FaGem className="text-blue-500" />
                {language === "العربية"
                  ? "اختر أحد الباقات"
                  : "Choose a Package"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {language === "العربية"
                  ? "احصل على مكافآت إضافية عند شراء الباقات الكبيرة"
                  : "Get bonus rewards when purchasing larger packages"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offers.map((offer, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <button
                      onClick={() => handleOfferClick(offer)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex flex-col items-center relative overflow-hidden ${
                        selectedOffer === offer.coinId
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      {selectedOffer === offer.coinId && (
                        <motion.div
                          className="absolute inset-0 bg-blue-500/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                      <div className="flex items-center gap-2 text-lg font-bold text-yellow-600 dark:text-yellow-400 z-10">
                        <FaCoins />
                        {offer.coinsAmount}{" "}
                        {language === "العربية" ? "كوين" : "Coins"}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-1 z-10">
                        {language === "العربية"
                          ? `${offer.coinPrice} درهم إماراتي`
                          : `${offer.coinPrice} AED`}
                      </div>
                      {index % 2 === 0 && (
                        <div className="absolute -right-6 -top-6 text-yellow-400/20 dark:text-yellow-600/20 z-0">
                          <RiCoinsFill className="text-6xl" />
                        </div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Custom Amount Section */}
            <motion.div variants={cardVariants} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FaMoneyBillWave className="text-green-500" />
                {language === "العربية" ? "كمية مخصصة" : "Custom Amount"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {language === "العربية"
                  ? `أدخل أي كمية تريدها من عملات ${SiteNameAR}`
                  : `Enter any amount of ${SiteNameEN} coins you need`}
              </p>

              <motion.div className="relative" whileHover={{ scale: 1.01 }}>
                <input
                  type="number"
                  value={customCoins}
                  onChange={handleCustomInputChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                  placeholder={
                    language === "العربية"
                      ? "أدخل عدد الكوينز"
                      : "Enter coins amount"
                  }
                />
                <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                  <FaCoins />
                </div>
              </motion.div>
            </motion.div>

            {/* Total Cost Section */}
            {customCoins && coinRate && (
              <motion.div
                variants={cardVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-inner"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {language === "العربية"
                      ? "التكلفة الإجمالية"
                      : "Total Cost"}
                  </span>
                  <div className="flex items-center gap-2">
                    <GiCash className="text-green-500 text-xl" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {totalCost.toFixed(2)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      AED
                    </span>
                  </div>
                </div>
                <motion.div
                  className="mt-2 text-sm text-blue-600 dark:text-blue-400"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {language === "العربية"
                    ? "شحن فوري بعد تأكيد الدفع"
                    : "Instant recharge after payment confirmation"}
                </motion.div>
              </motion.div>
            )}

            {/* Payment Button */}
            <motion.div variants={cardVariants}>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`w-full py-4 px-6 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  !customCoins
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                }`}
                disabled={!customCoins}
              >
                <FaShoppingCart className="animate-bounce" />
                {language === "العربية"
                  ? "المتابعة للدفع"
                  : "Proceed to Payment"}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="ml-1"
                >
                  {language === "العربية" ? "➔" : "→"}
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              variants={cardVariants}
              className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              <p>
                {language === "العربية"
                  ? `عملات ${SiteNameAR} صالحة مدي الحياة`
                  : `${SiteNameEN} coins are valid forever`}
              </p>
              <p className="mt-1">
                {language === "العربية"
                  ? "أسعار خاصة للكميات الكبيرة - تواصل مع الدعم"
                  : "Bulk discounts available - contact support"}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
