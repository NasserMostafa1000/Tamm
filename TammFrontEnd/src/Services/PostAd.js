// src/Services/fetchCategories.js
import { API_BASE_URL } from "../Utils/Constant";

// فانكشن بترجع الكاتيجوريز كـ Array
const fetchCategories = async (language) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}Categories/Parents?lang=${
        language === "العربية" ? "ar" : "en"
      }`
    );
    const data = await response.json();

    if (response.ok) {
      return data.data; // الكاتيجوريز بس
    } else {
      console.error(data.message || "Failed to load categories.");
      return []; // عودة Array فاضية في حالة الخطأ
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // عودة Array فاضية في حالة الاستثناء
  }
};

export default fetchCategories;
// Services/fetchCities.js
export async function fetchCities(lang) {
  const response = await fetch(
    `${API_BASE_URL}Cities?lang=${lang === "العربية" ? "ar" : "en"}`
  );
  if (!response.ok) throw new Error("Failed to fetch cities");
  return await response.json();
}

// Services/fetchCityPlaces.js
export async function fetchCityPlaces(lang, cityName) {
  const response = await fetch(
    `${API_BASE_URL}CityPlaces/GetAll?lang=${
      lang === "العربية" ? "ar" : "en"
    }&cityName=${cityName}`
  );
  const result = await response.json();
  return result.data || [];
}

/**
 * دالة لإضافة مكان جديد لمدينة محددة
 * @param {Object} params
 * @param {number} params.cityId
 * @param {string} params.placeNameAr
 * @param {string} params.placeNameEn
 * @returns {Object} { success, data, error }
 */
export async function addNewPlace({ cityId, placeNameAr, placeNameEn }) {
  try {
    const res = await fetch(`${API_BASE_URL}CityPlaces/Add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cityId,
        placeNameAr,
        placeNameEn,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, error: result?.error || "Unknown error" };
    }

    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message || "Request failed" };
  }
}
export async function addListingAddress({
  cityPlaceId,
  longitude = null,
  latitude = null,
  moreDetailsEn = null,
  moreDetailsAr = null,
}) {
  try {
    const res = await fetch(`${API_BASE_URL}ListingsAddresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cityPlaceId,
        longitude,
        latitude,
        moreDetailsEn,
        moreDetailsAr,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, error: result?.error || "Unknown error" };
    }

    // Assuming the result contains listingAddressId
    return result.listingAddressId;
  } catch (err) {
    return { success: false, error: err.message || "Request failed" };
  }
}

/**
 * دالة لجلب الأقسام الفرعية (Subcategories) بناءً على اسم القسم الأب
 * @param {string} language - "العربية" أو "English"
 * @param {string} parentCategoryName - اسم القسم الأب باللغة المطلوبة
 * @returns {Promise<Array>} - ترجع مصفوفة الأقسام الفرعية أو مصفوفة فارغة عند الخطأ
 */
export async function fetchSubCategories(language, parentCategoryName) {
  try {
    const langParam = language === "العربية" ? "ar" : "en";
    const response = await fetch(
      `${API_BASE_URL}Categories/Subs?lang=${langParam}&parentName=${encodeURIComponent(
        parentCategoryName
      )}`
    );

    if (!response.ok) {
      const err = await response.json();
      console.error(
        "Failed to fetch subcategories:",
        err.message || "Unknown error"
      );
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}
export async function addListing(listingData) {
  try {
    const token = localStorage.getItem("userToken");

    const res = await fetch(`${API_BASE_URL}Listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error || "Failed to add listing");
    }

    if (!result || !result.listingId) {
      throw new Error("ListingId not returned from server");
    }

    return result.listingId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadListingImages(listingId, files) {
  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append("imageFile", file);

      const res = await fetch(
        `${API_BASE_URL}Listings/UploadAdImage?ListingId=${listingId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      await res.json(); // لو عايز تخزن أو تطبع نتيجة كل صورة
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
}

export async function fetchAttributesByCategory(subCategoryId, lang) {
  try {
    const response = await fetch(
      `${API_BASE_URL}Attributes/GetAttributesByCategory?categoryId=${subCategoryId}&lang=${lang}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch attributes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return [];
  }
}
export async function addListingAttributes(attributesList) {
  try {
    const res = await fetch(`${API_BASE_URL}Attributes/AddListingAttribute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attributesList),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error("Failed to add listing attributes: " + error);
    }

    return true; // تم الإرسال بنجاح
  } catch (error) {
    console.error("Error adding listing attributes:", error);
    return false;
  }
}
export const addSubCategory = async ({
  parentCategoryId,
  categoryNameEn,
  categoryNameAr,
}) => {
  const response = await fetch(`${API_BASE_URL}Categories/AddSubCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parentCategoryId,
      categoryNameEn,
      categoryNameAr,
    }),
  });

  if (!response.ok) {
    throw new Error("فشل في إضافة القسم الفرعي");
  }

  const data = await response.json();
  return data;
};
export const addParentCategory = async ({ categoryNameEn, categoryNameAr }) => {
  const response = await fetch(`${API_BASE_URL}Categories/AddParentCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`, // 👈 إرسال التوكن هنا
    },
    body: JSON.stringify({
      categoryNameEn,
      categoryNameAr,
    }),
  });

  if (!response.ok) {
    throw new Error("فشل في إضافة القسم الفرعي");
  }

  const data = await response.json();
  return data;
};
export const getUserCoins = async (userId) => {
  try {
    const token = localStorage.getItem("userToken"); // أو حسب مكان حفظك للتوكن

    const response = await fetch(
      `${API_BASE_URL}Coins/GetCoinsForUser/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coins");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw error;
  }
};
