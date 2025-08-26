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
