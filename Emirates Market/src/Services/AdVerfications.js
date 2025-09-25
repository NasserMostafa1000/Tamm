import { API_BASE_URL } from "../Utils/Constant";
export async function getUnapprovedListings(token) {
  try {
    const res = await fetch(`${API_BASE_URL}Listings/GetUnapprovedListings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "No Un Approved Listing founded");
    }

    const data = await res.json();
    return data; // قائمة الإعلانات غير المقبولة
  } catch (error) {
    console.error("Error fetching unapproved listings:", error);
    throw error;
  }
}
export async function approveListing(listingId, token, lang = "en") {
  const res = await fetch(
    `${API_BASE_URL}Listings/Approve?listingId=${listingId}&lang=${lang}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseText = await res.text(); // ← ناخد الرد سواء ناجح أو لأ

  if (!res.ok) {
    throw new Error(responseText); // ← نرمي الرسالة اللي جاية من السيرفر نفسها
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export async function rejectListing(listingId, token, lang = "en") {
  const res = await fetch(
    `${API_BASE_URL}Listings/Reject?listingId=${listingId}&lang=${lang}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to reject listing");
  return await res.json();
}
export async function requestListingEdit(
  listingId,
  reason,
  token,
  lang = "en"
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}Listings/RequestEdit?listingId=${listingId}&reason=${encodeURIComponent(
        reason
      )}&lang=${lang}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseText = await res.text(); // نحاول ناخد الرد كـ نص

    if (!res.ok) {
      throw new Error(responseText); // نرمي الرسالة اللي جاية من السيرفر نفسها
    }

    try {
      return JSON.parse(responseText); // لو كانت JSON نرجعها ككائن
    } catch {
      return responseText; // أو نرجعها كـ نص
    }
  } catch (error) {
    console.error("Error requesting edit for listing:", error);
    throw error;
  }
}

export async function getAdVerificationHistory(token) {
  try {
    const response = await fetch(`${API_BASE_URL}AdsVerficationsHistory`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ad verification history:", error);
    throw error;
  }
}
