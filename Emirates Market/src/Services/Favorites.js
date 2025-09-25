import { API_BASE_URL } from "../Utils/Constant.js";

import { getOrCreateUserUUID } from "../Utils/Constant";

export async function addToFavorites(listingId, token) {
  if (!token) {
    throw new Error("No token provided");
  }

  // 1️⃣ إضافة الإعلان للمفضلة
  const response = await fetch(
    `${API_BASE_URL}Favorites/Add?listingId=${listingId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add to favorites");
  }

  // 2️⃣ تحديث سجل البحث (For You)
  try {
    const userUUID = getOrCreateUserUUID();
    await fetch(
      `${API_BASE_URL}SearchingExpections/AddOrUpdateUserSearch?userUUID=${userUUID}&ListingId=${listingId}`,
      { method: "POST" }
    );
  } catch (err) {
    console.error("Failed to update user search:", err);
  }

  return true;
}
