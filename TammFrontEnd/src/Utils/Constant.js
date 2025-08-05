import { jwtDecode } from "jwt-decode";
import { Howl } from "howler";

export default function DecodedTokenAndReturnCurrentClientInfoInfo(token) {
  const decoded = jwtDecode(token);

  return {
    Lang: decoded.locale || "en",
    FirstName: decoded.given_name || "",
    LastName: decoded.family_name || "",
    ImageUrl: decoded.picture || null,
    Nationality: null,
    DateOfBirth: null,
    Gender: null,
    Email: decoded.email || "",
    HashedPassword: null,
    LoginProviderName: "google",
    RoleId: 0,
  };
}

export function GetCurrentUserRoleName(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null; // حسب كيف مخزن الدور في التوكن
  } catch {
    return null;
  }
}
export function GetCurrentUserId(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.userId || decoded.nameID || null; // حسب كيف مخزن الدور في التوكن
  } catch {
    return null;
  }
}
export function GetImageUrl(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.ImageUrl || null; // حسب كيف مخزن الدور في التوكن
  } catch {
    return null;
  }
}
export const categoryMap = {
  "Real Estate": { ar: "عقارات", en: "Real Estate", icon: "FaHome" },
  عقارات: { ar: "عقارات", en: "Real Estate", icon: "FaHome" },

  Cars: { ar: "سيارات", en: "Cars", icon: "FaCar" },
  سيارات: { ar: "سيارات", en: "Cars", icon: "FaCar" },

  employees: { ar: "الموظفين", en: "employees", icon: "FaUserTie" },
  الموظفين: { ar: "الموظفين", en: "employees", icon: "FaUserTie" },

  Vacancies: { ar: "وظائف شاغرة", en: "Vacancies", icon: "FaBriefcase" },
  "وظائف شاغره": { ar: "وظائف شاغرة", en: "Vacancies", icon: "FaBriefcase" },

  Phones: { ar: "هواتف", en: "Phones", icon: "FaMobileAlt" },
  هواتف: { ar: "هواتف", en: "Phones", icon: "FaMobileAlt" },
};
export const playNotificationSound = (path) => {
  const sound = new Howl({
    src: [`/ProjectSounds/${path}`],
    volume: 1.0,
    html5: true,
    onplayerror: function (id, error) {
      console.error("❌ خطأ في تشغيل الصوت:", error);
      sound.once("unlock", () => {
        sound.play();
      });
    },
  });

  sound.play();
};

export const SiteNameEN = "TAMM";
export const SiteNameAR = "تم";
export const API_BASE_URL = "https://tammuae-001-site1.qtempurl.com/api/";
export const ServerPath = "https://tammuae-001-site1.qtempurl.com/";

//export const API_BASE_URL = "https://localhost:7244/api/";
//export const ServerPath = "https://localhost:7244/";
