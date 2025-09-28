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
    LoginProviderName: "google Propz",
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
  عقارات: { icon: "FaHome", ar: "عقارات", en: "Real Estate" },
  سيارات: { icon: "FaCar", ar: "سيارات", en: "Cars" },
  "أدوات كهربائية وسباكة": {
    icon: "FaTools",
    ar: "أدوات كهربائية وسباكة",
    en: "Electrical & Plumbing Tools",
  },
  اثاث: { icon: "FaCouch", ar: "اثاث", en: "Furniture" },
  الكترونيات: { icon: "FaTv", ar: "الكترونيات", en: "Electronics" },
  الموظفين: { icon: "FaUserTie", ar: "الموظفين", en: "Employees" },
  "سيارات للايجار": {
    icon: "FaCarSide",
    ar: "سيارات للايجار",
    en: "Cars for Rent",
  },
  هواتف: { icon: "FaMobileAlt", ar: "هواتف", en: "Mobile Phones" },
  "وظائف شاغره": { icon: "FaBriefcase", ar: "وظائف شاغره", en: "Jobs" },
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
export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateUserUUID() {
  const cookieName = "user_uuid";

  // جلب UUID من الكوكيز
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});

  if (cookies[cookieName]) {
    return cookies[cookieName]; // موجود فعلاً
  } else {
    const newUUID = generateUUID();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10); // 10 سنين
    document.cookie = `${cookieName}=${newUUID}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    return newUUID;
  }
}

export async function addOrUpdateUserSearch(userUUID, listingId) {
  const response = await fetch(
    `${API_BASE_URL}SearchingExpections/AddOrUpdateUserSearch?userUUID=${userUUID}&ListingId=${listingId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add or update user search");
  }

  return true;
}

export async function getUserLastCategory(userUUID) {
  const response = await fetch(
    `${API_BASE_URL}SearchingExpections/GetUserLastCategory?userUUID=${userUUID}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user last category");
  }

  return await response.json();
}
export const SiteNameEN = "Propz";
export const SiteNameAR = "بروبز";
export const API_BASE_URL =
  "https://salamatraveluae-001-site1.qtempurl.com/api/";
export const ServerPath = "https://salamatraveluae-001-site1.qtempurl.com/";

//export const API_BASE_URL = "https://localhost:7244/api/";
//export const ServerPath = "https://localhost:7244/";
