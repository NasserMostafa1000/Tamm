import React, { useEffect } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
const AboutPage = () => {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const isArabic = language === "العربية";
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const content = {
    title: isArabic ? "من نحن" : "About Us",
    welcome: isArabic
      ? "مرحبًا بك في منصتك الأولى للإعلانات المبوبة"
      : "Welcome to your #1 classifieds platform",
    description: isArabic
      ? "نحن منصة إلكترونية متخصصة في ربط البائعين بالمشترين بطريقة آمنة وسهلة وفعّالة."
      : "We are a digital platform connecting buyers and sellers safely, easily, and effectively.",
    visionTitle: isArabic ? "رؤيتنا" : "Our Vision",
    vision: isArabic
      ? "أن نكون المنصة الرائدة للإعلانات المبوبة في الشرق الأوسط."
      : "To be the leading classifieds platform in the Middle East.",
    missionTitle: isArabic ? "رسالتنا" : "Our Mission",
    mission: isArabic
      ? "توفير بيئة رقمية موثوقة تتيح لكل فرد فرصة الإعلان والوصول السهل للعملاء."
      : "To provide a trusted digital space for individuals to post ads and reach customers easily.",
    whatWeOfferTitle: isArabic ? "ماذا نقدم؟" : "What We Offer",
    whatWeOffer: isArabic
      ? [
          "أقسام متنوعة تشمل العقارات، السيارات، الوظائف، الإلكترونيات، والمزيد.",
          "واجهة استخدام سهلة مع لوحة تحكم مرنة.",
          "أدوات بحث وتصنيف متقدمة.",
          "دعم متعدد اللغات وخيارات حسب المدينة.",
        ]
      : [
          "Multiple categories: Real estate, cars, jobs, electronics, and more.",
          "User-friendly interface and flexible dashboard.",
          "Advanced search and filtering tools.",
          "Multilingual support and city-based browsing.",
        ],
    audienceTitle: isArabic ? "لمن هذه المنصة؟" : "Who is this for?",
    audience: isArabic
      ? "لكل من يريد بيع أو شراء منتجات أو خدمات بسهولة."
      : "For anyone wanting to buy or sell products or services easily.",
    whyUsTitle: isArabic ? "لماذا نحن؟" : "Why Choose Us?",
    whyUs: isArabic
      ? [
          "واجهة سهلة الاستخدام.",
          "دعم فني مستمر.",
          "مصداقية وشفافية.",
          "نظام تقييم للمستخدمين.",
          "إعلانات مميزة لجذب أكبر عدد من المشاهدات.",
        ]
      : [
          "User-friendly interface.",
          "Continuous support.",
          "Trust and transparency.",
          "User rating system.",
          "Featured ads to attract more views.",
        ],
    safetyTitle: isArabic ? "الأمان والخصوصية" : "Safety & Privacy",
    safety: isArabic
      ? "نحرص على سلامتك من خلال مراقبة المحتوى وتوفير أدوات الإبلاغ وحماية البيانات الشخصية."
      : "We prioritize your safety by moderating content, enabling reporting tools, and protecting your data.",
    joinUs: isArabic
      ? "انضم إلينا اليوم وابدأ رحلتك مع الإعلانات المبوبة!"
      : "Join us today and start your classifieds journey!",
  };

  return (
    <div
      className={`min-h-screen px-4 py-8 md:px-12 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {content.title}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-4 font-semibold"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {content.welcome}
          </motion.p>
          <motion.p
            className="text-lg max-w-3xl mx-auto"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {content.description}
          </motion.p>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeIn}
          className="mb-16 p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-400">
            {content.visionTitle}
          </h2>
          <p className="text-lg">{content.vision}</p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate={controls}
          className="mb-16 p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-400">
            {content.missionTitle}
          </h2>
          <p className="text-lg">{content.mission}</p>
        </motion.section>

        {/* What We Offer */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate={controls}
          className="mb-16 p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-400">
            {content.whatWeOfferTitle}
          </h2>
          <ul className="space-y-3">
            {content.whatWeOffer.map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-start"
                custom={idx}
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3"></span>
                <span className="text-lg">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Audience */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate={controls}
          className="mb-16 p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">
            {content.audienceTitle}
          </h2>
          <p className="text-lg">{content.audience}</p>
        </motion.section>

        {/* Why Us */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate={controls}
          className="mb-16 p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-pink-400">
            {content.whyUsTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.whyUs.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-3">
                    <span className="text-blue-400">{idx + 1}</span>
                  </div>
                  <h3 className="font-medium">{item}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Safety */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate={controls}
          className="mb-16 p-6 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-gray-200 border-opacity-10 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-red-400">
            {content.safetyTitle}
          </h2>
          <p className="text-lg">{content.safety}</p>
        </motion.section>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.p
            className="text-xl md:text-2xl font-semibold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            {content.joinUs}
          </motion.p>
          <motion.button
            className={`px-8 py-3 rounded-full font-medium text-lg ${
              isDark
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            } shadow-lg hover:shadow-xl transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={() => navigate("/login")}
          >
            {isArabic ? "إنضم الآن" : "Join Now"}
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
