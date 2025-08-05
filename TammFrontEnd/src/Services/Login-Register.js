// LoginReisgteration.js
import { API_BASE_URL } from "../Utils/Constant.js";
import { jwtDecode } from "jwt-decode"; // تأكد من أن jwt-decode تعمل بشكل صحيح

export default async function LoginReisgteration(
  token,
  language,
  setUserToken
) {
  try {
    // فك التوكن
    const decoded = jwtDecode(token);
     console.log(token)
    if (!(decoded && decoded.email)) return false; // التحقق من صحة التوكن

    // إعداد بيانات المستخدم للإرسال إلى API
    const userData = {
      Lang: language === "العربية" ? "ar" : "en",
      FirstName: decoded.given_name || "",
      LastName: decoded.family_name || "",
      ImageUrl: decoded.picture || null,
      Nationality: null,
      DateOfBirth: null,
      Gender: null,
      Email: decoded.email,
      HashedPassword: null,
      LoginProviderName: "Google",
      RoleId: 2,
    };

    // إرسال البيانات إلى السيرفر لتسجيل المستخدم
    const response = await fetch(`${API_BASE_URL}Clients/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // التحقق من الاستجابة من السيرفر
    if (!response.ok) {
      console.error("API registration error:", await response.text());
      return false;
    }

    const data = await response.json(); // بيانات السيرفر

    // تحقق من وجود التوكن في الاستجابة
    if (data.token) {
      setUserToken(data.token); // تخزين التوكن في الـ context
      localStorage.setItem("userToken", data.token); // تخزين التوكن في الـ localStorage
      return true; // التوكن تم تخزينه بنجاح
    }

    return false;
  } catch (error) {
    console.error("Login registration failed:", error);
    return false;
  }
}
// Services/Register.js
// Services/Register.js
export async function registerClient(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}Clients/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      // نحاول نرجع رسالة الخطأ بوضوح من السيرفر
      const errorMessage =
        result?.error ||
        result?.message ||
        result?.title ||
        "Registration failed.";
      throw new Error(errorMessage);
    }

    return result; // رجع البيانات (زي التوكن)
  } catch (error) {
    // نرمي الخطأ برسالته النصية للمستخدم
    throw new Error(error.message || "Registration failed.");
  }
}
export async function manualLogin({ email, password, lang }) {
  const response = await fetch(`${API_BASE_URL}Clients/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, lang }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data.token;
}
