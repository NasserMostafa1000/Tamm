import { useLanguage } from "../Context/LangContext";
export default function AppleButton() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  return (
    <div>
      {/* زر تسجيل الدخول بأبل */}
      <button
        className="w-full max-w-xs bg-black text-white flex items-center justify-center gap-2 py-2 px-4 rounded-xl shadow hover:bg-gray-900 transition mb-4"
        onClick={() =>
          alert(isArabic ? "تسجيل الدخول بأبل" : "Sign in with Apple")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16.365 1.43c0 1.14-.47 2.22-1.28 3.06-.88.89-2.14 1.58-3.42 1.48-.15-1.17.37-2.37 1.22-3.22.84-.88 2.26-1.52 3.48-1.54zm5.02 17.78c-.44 1.01-.97 1.97-1.58 2.88-.54.8-1.12 1.59-1.94 1.61-.74.02-.98-.5-2.06-.5-1.09 0-1.35.49-2.07.51-.84.02-1.48-.87-2.02-1.67-1.1-1.59-1.95-4.49-.81-6.45.55-.98 1.54-1.61 2.64-1.63 1.04-.02 2.03.7 2.67.7.65 0 1.87-.86 3.17-.73.54.02 2.05.22 3.03 1.67-.08.05-1.8 1.06-1.89 3.38-.05 1.14.39 2.26.65 2.62z" />
        </svg>
        {isArabic ? "تسجيل الدخول Apple" : "Sign in with Apple"}
      </button>
    </div>
  );
}
