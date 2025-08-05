import { API_BASE_URL } from "../Utils/Constant.js";

export async function addToFavorites(listingId, token) {
  if (!token) {
    throw new Error("No token provided");
  }

  const response = await fetch(
    `${API_BASE_URL}Favorites/Add?listingId=${listingId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // جرب قراءة رسالة الخطأ من الرد
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add to favorites");
  }

  const data = await response.json();
  return data;
}
