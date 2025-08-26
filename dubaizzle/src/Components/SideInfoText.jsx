import React, { useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { motion } from "framer-motion";
import TammLogo from "../Layouts/TammLogo";
import { SiteNameAR, SiteNameEN } from "../Utils/Constant";

export default function SideInfoText() {
  const { Language } = useLanguage();

  const [pauseArabic, setPauseArabic] = useState(false);
  const [pauseEnglish, setPauseEnglish] = useState(false);

  const arabicTexts = [
    `مرحبًا بك في ${SiteNameAR} – وجهتك الذكية لعالم الإعلانات المجانية في الإمارات!

نحن في ${SiteNameAR} نؤمن أن البيع والشراء يجب أن يكونا بسيطين، سريعين، ومتاحين للجميع. من هنا جاءت فكرتنا: منصة إلكترونية تربط الأفراد والشركات في بيئة موثوقة وآمنة، تتيح لك نشر إعلانك مجانًا خلال دقائق، والوصول إلى آلاف المستخدمين النشطين يوميًا.

سواء كنت فردًا تبحث عن مشتري لسيارتك أو عقارك، أو شركة تقدم خدمات متخصصة، أو حتى شابًا يبحث عن وظيفة، فـ ${SiteNameAR} هو المكان المناسب لك. نحن لا نكتفي بتوفير أقسام للإعلانات العامة، بل نوفر تجربة منظمة وموجهة، تبدأ من اختيار القسم الصحيح، مرورًا بإدخال بيانات الإعلان، وصولًا إلى التواصل المباشر بينك وبين المهتمين.

ما الذي يميزنا؟
- واجهة استخدام ثنائية اللغة (العربية والإنجليزية) مصممة لتناسب الجميع.
- تصنيفات دقيقة تغطي كافة المجالات: عقارات، سيارات، وظائف، خدمات، إلكترونيات، والمزيد.
- إمكانية التواصل الفوري من خلال الشات المباشر داخل الموقع.
- دعم نظام المفضلة لحفظ الإعلانات المميزة والرجوع إليها لاحقًا.
- إمكانية الإبلاغ عن الإعلانات المخالفة للحفاظ على بيئة نظيفة وآمنة.
- نظام تقييم وتحسين مستمر يعتمد على تفاعلكم وملاحظاتكم.

نحن لا نبيع فقط منتجات، بل نبني مجتمعًا من الثقة والشفافية. نعمل باستمرار على تحديث المنصة، تحسين سرعتها، وتقديم مزايا جديدة مثل التنبيهات، الإشعارات، الإعلانات المميزة، وغيرها من الخصائص التي تسهّل عليك الوصول لما تريد بأقل مجهود.

انضم اليوم إلى آلاف المستخدمين في ${SiteNameAR} وكن جزءًا من مجتمع نشط يتطور يومًا بعد يوم. سواء كنت بائعًا، مشتريًا، مزوّد خدمة، أو حتى مستكشفًا للعروض – منصتنا ترحب بك وتدعمك في كل خطوة.

لا تنتظر، ابدأ الآن، واعرض إعلانك الأول خلال دقائق فقط. ${SiteNameAR} – حيث تبدأ كل فرصة.`,
  ];

  const englishTexts = [
    `Welcome to ${SiteNameEN} – your smart gateway to free classifieds in the UAE!

At ${SiteNameEN}, we believe that buying, selling, and connecting should be simple, fast, and accessible to everyone. That’s why we built a powerful yet easy-to-use platform that allows individuals and businesses to post free ads and reach thousands of active users every day.

Whether you're a private seller listing your car or apartment, a company promoting your services, or a job seeker exploring new opportunities — ${SiteNameEN} is built for you. Our platform doesn't just allow you to post an ad; it guides you through a complete and structured experience, from choosing the right category, entering your ad details, to communicating directly with interested buyers or sellers.

Why choose us?
- A fully bilingual interface (Arabic & English) that’s intuitive and user-friendly.
- Smartly organized categories covering everything from real estate, cars, jobs, electronics, services, and much more.
- Built-in instant chat to communicate safely and easily with other users.
- A favorites system that helps you save listings and track items you care about.
- Reporting and moderation tools to keep the platform clean and secure.
- A commitment to regular improvement based on your feedback.

We don’t just provide a place to post ads — we’re building a trusted community. Our team works continuously to improve speed, usability, and feature sets like alerts, premium listings, smart filters, and notification systems to help you achieve your goals quickly and efficiently.

Join thousands of users already on ${SiteNameEN} and experience a dynamic, modern way to buy, sell, and connect. Whether you’re here to advertise, search, explore, or simply browse — you’re welcome, supported, and empowered.

Don’t wait — create your free ad in minutes and discover the smarter way to connect. ${SiteNameEN} — where every opportunity begins.`,
  ];

  const createVariants = (isPaused) => ({
    animate: {
      y: isPaused ? "0%" : ["100%", "-100%"],
      transition: {
        y: {
          repeat: isPaused ? 0 : Infinity,
          duration: 45,
          ease: "linear",
        },
      },
    },
  });

  const boxStyle = (textColor, bgColor, direction) => ({
    color: textColor,
    backgroundColor: bgColor,
    direction,
    padding: "1.5rem",
    overflow: "hidden",
    fontSize: "1rem",
    fontWeight: "600",
    lineHeight: "1.75rem",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  });

  return (
    <div className="fixed inset-0 hidden lg:flex pointer-events-none">
      {/* Arabic text right */}
      <div
        className="w-1/4"
        style={boxStyle("#facc15", "rgba(0, 0, 0, 0.4)", "rtl")}
        onMouseEnter={() => setPauseArabic(true)}
        onMouseLeave={() => setPauseArabic(false)}
      >
        <motion.div
          variants={createVariants(pauseArabic)}
          animate="animate"
          className="space-y-6"
        >
          <TammLogo />
          {arabicTexts.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
          <TammLogo />
        </motion.div>
      </div>

      <div className="w-1/2" />

      {/* English text left */}
      <div
        className="w-1/4"
        style={boxStyle("#60d7f9", "rgba(0, 0, 0, 0.4)", "ltr")}
        onMouseEnter={() => setPauseEnglish(true)}
        onMouseLeave={() => setPauseEnglish(false)}
      >
        <motion.div
          variants={createVariants(pauseEnglish)}
          animate="animate"
          className="space-y-6"
        >
          <TammLogo />
          {englishTexts.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
          <TammLogo />
        </motion.div>
      </div>
    </div>
  );
}
