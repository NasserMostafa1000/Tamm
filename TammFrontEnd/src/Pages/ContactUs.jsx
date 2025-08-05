import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { getContactUs } from "../Services/AdminContact";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";

const ContactUsSection = () => {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const isArabic = language === "العربية";

  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactUs();
        setContact(data);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const contactItems = [
    {
      name: "Email",
      value: contact?.email,
      link: contact?.email ? `mailto:${contact.email}` : null,
      image: "/ProjectsImages/Gmail.png",
      color: "bg-red-100 dark:bg-red-900/30",
      hoverColor: "hover:bg-red-200 dark:hover:bg-red-800/50",
      iconAnimation: { rotate: [0, -10, 10, 0] },
    },
    {
      name: "Phone",
      value: contact?.phone,
      link: contact?.phone ? `tel:${contact.phone}` : null,
      image: "/ProjectsImages/Call.png",
      color: "bg-green-100 dark:bg-green-900/30",
      hoverColor: "hover:bg-green-200 dark:hover:bg-green-800/50",
      iconAnimation: { scale: [1, 1.1, 1] },
    },
    {
      name: "WhatsApp",
      value: contact?.whatsApp,
      link: contact?.whatsApp
        ? `https://wa.me/${contact.whatsApp.replace(/\D/g, "")}`
        : null,
      image: "/ProjectsImages/Whatsapp.png",
      color: "bg-emerald-100 dark:bg-emerald-900/30",
      hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-800/50",
      iconAnimation: { y: [0, -5, 0] },
    },
    {
      name: "Instagram",
      value: contact?.instagram,
      link: contact?.instagram,
      image: "/ProjectsImages/insta.png",
      color: "bg-pink-100 dark:bg-pink-900/30",
      hoverColor: "hover:bg-pink-200 dark:hover:bg-pink-800/50",
      iconAnimation: {
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 },
      },
    },
    {
      name: "Facebook",
      value: contact?.facebook,
      link: contact?.facebook,
      image: "/ProjectsImages/Facebook.png",
      color: "bg-blue-100 dark:bg-blue-900/30",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
      iconAnimation: {
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.7 },
      },
    },
    {
      name: "X",
      value: contact?.twitter,
      link: contact?.twitter,
      image: "/ProjectsImages/X.png",
      color: "bg-black/10 dark:bg-white/10",
      hoverColor: "hover:bg-black/20 dark:hover:bg-white/20",
      iconAnimation: {
        rotate: [0, 360],
        transition: { duration: 0.8 },
      },
    },
    {
      name: "Telegram",
      value: contact?.telegram,
      link: contact?.telegram,
      image: "/ProjectsImages/Tele.png",
      color: "bg-blue-100 dark:bg-blue-900/30",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
      iconAnimation: {
        y: [0, -3, 0],
        transition: { repeat: Infinity, duration: 1.5 },
      },
    },
    {
      name: "Youtube",
      value: contact?.youtube,
      link: contact?.youtube,
      image: "/ProjectsImages/youtube.jpeg",
      color: "bg-red-100 dark:bg-red-900/30",
      hoverColor: "hover:bg-red-200 dark:hover:bg-red-800/50",
      iconAnimation: {
        scale: [1, 0.9, 1],
        transition: { duration: 0.6 },
      },
    },
  ];

  const filteredItems = contactItems.filter(
    (item) => item.value && item.value.trim() !== ""
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "backOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ letterSpacing: "0.5rem" }}
            animate={{ letterSpacing: "0.1rem" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {isArabic ? "تواصل معنا" : "Contact Us"}
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {isArabic
              ? "نحن هنا لمساعدتك! اختر الطريقة التي تفضلها للتواصل مع فريقنا."
              : "We're here to help! Choose your preferred way to contact our team."}
          </motion.p>
        </motion.div>

        {/* Contact Methods Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-20"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  },
                  scale: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.2,
                  },
                }}
                className="inline-block mb-6"
              >
                <div className="w-16 h-16 border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full"></div>
              </motion.div>
              <motion.p
                className="text-lg"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                {isArabic
                  ? "جاري تحميل معلومات الاتصال..."
                  : "Loading contact information..."}
              </motion.p>
            </motion.div>
          ) : filteredItems.length > 0 ? (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-6 rounded-2xl ${
                    item.color
                  } ${item.hoverColor} backdrop-blur-sm border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
                  variants={itemVariants}
                  whileHover="hover"
                >
                  {/* Animated background element */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 dark:to-black/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  <motion.div
                    className="w-16 h-16 mb-4 flex items-center justify-center"
                    animate={item.iconAnimation}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </motion.div>
                  <h3 className="font-medium text-lg mb-1 z-10">{item.name}</h3>
                  <p className="text-sm opacity-80 break-all text-center z-10">
                    {item.value}
                  </p>
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-lg">
                {isArabic
                  ? "لا توجد معلومات اتصال متاحة حالياً"
                  : "No contact information available at the moment"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Contact Info */}
        {contact?.address && (
          <motion.div
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
            whileHover={{
              scale: 1.02,
              boxShadow: isDark
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <motion.h3
              className="text-xl font-bold mb-4 text-center flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {isArabic ? "عنواننا" : "Our Address"}
            </motion.h3>
            <motion.p
              className="text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {contact.address}
            </motion.p>
          </motion.div>
        )}

        {/* Working Hours */}
        {contact?.workingHours && (
          <motion.div
            className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "backOut" }}
            whileHover={{
              scale: 1.02,
              boxShadow: isDark
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <motion.h3
              className="text-xl font-bold mb-4 text-center flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {isArabic ? "ساعات العمل" : "Working Hours"}
            </motion.h3>
            <motion.p
              className="text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {contact.workingHours}
            </motion.p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsSection;
