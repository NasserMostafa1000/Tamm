import React, { useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";
import Footer from "../Components/Footer";

const TermsAndPrivacy = () => {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const isArabic = language === "العربية";
  const [activeTab, setActiveTab] = useState("terms");

  const termsTitle = isArabic ? "الشروط والأحكام" : "Terms and Conditions";
  const privacyTitle = isArabic ? "سياسة الخصوصية" : "Privacy Policy";

  const textStyle = `leading-relaxed ${
    isDark ? "text-gray-200" : "text-gray-800"
  }`;

  const tabStyle = `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
    isDark
      ? "text-gray-300 hover:bg-gray-700"
      : "text-gray-700 hover:bg-gray-100"
  }`;

  const activeTabStyle = `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
    isDark
      ? "bg-gray-700 text-white shadow-lg"
      : "bg-white text-gray-900 shadow-md"
  }`;

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-8 min-h-screen ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isArabic ? "الشروط والسياسات" : "Terms & Policies"}
        </h1>

        <div className="flex flex-col w-full">
          {/* Tab Buttons */}
          <div
            className={`flex mb-6 p-1 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex-1 text-center ${
                activeTab === "terms" ? activeTabStyle : tabStyle
              }`}
            >
              {termsTitle}
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex-1 text-center ${
                activeTab === "privacy" ? activeTabStyle : tabStyle
              }`}
            >
              {privacyTitle}
            </button>
          </div>

          {/* Tab Content */}
          <div className="relative">
            {/* Terms Content */}
            <motion.div
              className={`p-6 rounded-xl ${
                isDark ? "bg-gray-800/50" : "bg-white"
              } shadow-lg ${textStyle}`}
              initial={{ opacity: 0, x: activeTab === "terms" ? -20 : 20 }}
              animate={{
                opacity: activeTab === "terms" ? 1 : 0,
                x: activeTab === "terms" ? 0 : isArabic ? 20 : -20,
                display: activeTab === "terms" ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">{termsTitle}</h2>
              <ul className="space-y-4 pl-5">
                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-red-500">
                  <strong className="font-semibold">
                    {isArabic
                      ? "المسؤولية القانونية:"
                      : "Legal Responsibility:"}
                  </strong>{" "}
                  {isArabic
                    ? "أنت المسؤول الوحيد عن محتوى إعلاناتك. أي انتهاك للقوانين المحلية أو الدولية سيؤدي إلى حظر حسابك وإبلاغ السلطات المختصة."
                    : "You are solely responsible for your ad content. Any violation of local or international laws will result in account suspension and reporting to authorities."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-red-500">
                  <strong className="font-semibold">
                    {isArabic
                      ? "المعاملات المالية:"
                      : "Financial Transactions:"}
                  </strong>{" "}
                  {isArabic
                    ? "جميع المدفوعات نهائية وغير قابلة للاسترداد. أسعار العملات داخل المنصة قابلة للتغيير دون إشعار مسبق."
                    : "All payments are final and non-refundable. Virtual currency exchange rates may change without prior notice."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-red-500">
                  <strong className="font-semibold">
                    {isArabic ? "المحتوى المحظور:" : "Prohibited Content:"}
                  </strong>{" "}
                  {isArabic
                    ? "يحظر نشر إعلانات عن: مواد مخدرة، أسلحة، منتجات مسروقة، محتوى جنسي، أو أي محتوى ينتهك حقوق الملكية الفكرية. المخالفة تؤدي إلى حظر فوري."
                    : "Prohibited ads include: drugs, weapons, stolen goods, adult content, or any content violating intellectual property rights. Violation results in immediate ban."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-blue-500">
                  <strong className="font-semibold">
                    {isArabic ? "نظام الشات الداخلي:" : "Internal Chat System:"}
                  </strong>{" "}
                  {isArabic
                    ? "يتم تسجيل جميع المحادثات لأغراض أمنية. يحظر استخدام الشات لأي غرض غير التفاوض على الصفقات التجارية. أي إساءة أو احتيال سيؤدي إلى حظر الحساب."
                    : "All chats are logged for security purposes. Using chat for any purpose other than business negotiation is prohibited. Any abuse or fraud will result in account ban."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-blue-500">
                  <strong className="font-semibold">
                    {isArabic ? "حظر الحسابات:" : "Account Suspension:"}
                  </strong>{" "}
                  {isArabic
                    ? "نحتفظ بالحق في حظر أي حساب ينتهك الشروط دون سابق إنذار أو تعويض. الحسابات المحظورة تفقد جميع أرصدتها وعملياتها دون حق استرداد."
                    : "We reserve the right to ban any violating account without warning or compensation. Banned accounts lose all balances and transactions without refund."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-purple-500">
                  <strong className="font-semibold">
                    {isArabic
                      ? "التعديلات على الشروط:"
                      : "Terms Modifications:"}
                  </strong>{" "}
                  {isArabic
                    ? "قد نعدل هذه الشروط في أي وقت، ويستمر استخدامك للمنصة بعد التعديل يعني موافقتك على الشروط الجديدة."
                    : "We may modify these terms at any time, and your continued use of the platform after changes constitutes acceptance of the new terms."}
                </li>
              </ul>
            </motion.div>

            {/* Privacy Content */}
            <motion.div
              className={`p-6 rounded-xl ${
                isDark ? "bg-gray-800/50" : "bg-white"
              } shadow-lg ${textStyle}`}
              initial={{ opacity: 0, x: activeTab === "privacy" ? -20 : 20 }}
              animate={{
                opacity: activeTab === "privacy" ? 1 : 0,
                x: activeTab === "privacy" ? 0 : isArabic ? 20 : -20,
                display: activeTab === "privacy" ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">{privacyTitle}</h2>
              <ul className="space-y-4 pl-5">
                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-red-500">
                  <strong className="font-semibold">
                    {isArabic ? "جمع البيانات:" : "Data Collection:"}
                  </strong>{" "}
                  {isArabic
                    ? "نجمع ونخزن: معلومات الهوية، سجل المعاملات المالية، محتوى الإعلانات، سجل المحادثات، وعناوين IP لأغراض أمنية وقانونية."
                    : "We collect and store: identity information, financial transaction records, ad content, chat logs, and IP addresses for security and legal purposes."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-red-500">
                  <strong className="font-semibold">
                    {isArabic ? "استخدام البيانات:" : "Data Usage:"}
                  </strong>{" "}
                  {isArabic
                    ? "قد نستخدم بياناتك للتحقق من الهوية، منع الاحتيال، التحقيق في الشكاوى، أو الامتثال للطلبات القانونية. لا توجد خصوصية مطلقة في نظام الشات الداخلي."
                    : "We may use your data for identity verification, fraud prevention, complaint investigation, or legal compliance. There is no absolute privacy in the internal chat system."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-blue-500">
                  <strong className="font-semibold">
                    {isArabic ? "حماية البيانات:" : "Data Protection:"}
                  </strong>{" "}
                  {isArabic
                    ? "نحن نستخدم تشفيرًا قويًا، لكن لا يمكننا ضمان أمان مطلق. أنت تتحمل مسؤولية حماية بيانات تسجيل الدخول الخاصة بك."
                    : "We use strong encryption, but cannot guarantee absolute security. You are responsible for protecting your login credentials."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-blue-500">
                  <strong className="font-semibold">
                    {isArabic ? "البيانات المالية:" : "Financial Data:"}
                  </strong>{" "}
                  {isArabic
                    ? "جميع المعاملات المالية تخضع للتسجيل والمراجعة. نحتفظ بسجل كامل لجميع عمليات الشراء والتحويلات لمدة 7 سنوات على الأقل."
                    : "All financial transactions are recorded and audited. We maintain complete records of all purchases and transfers for at least 7 years."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-purple-500">
                  <strong className="font-semibold">
                    {isArabic ? "مشاركة البيانات:" : "Data Sharing:"}
                  </strong>{" "}
                  {isArabic
                    ? "قد نشارك بياناتك مع: السلطات القانونية عند الطلب، شركات التحقق من الهوية، أو في حالة التحقيق في انتهاك خطير للشروط."
                    : "We may share your data with: legal authorities upon request, identity verification services, or when investigating serious terms violations."}
                </li>

                <li className="relative pl-6 before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-purple-500">
                  <strong className="font-semibold">
                    {isArabic ? "حقوق المستخدم:" : "User Rights:"}
                  </strong>{" "}
                  {isArabic
                    ? "يمكنك طلب حذف البيانات المالية أو سجلات المحادثات المتعلقة بمعاملات تجارية."
                    : "You can request deletion of financial data or chat logs related to business transactions."}
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default TermsAndPrivacy;
