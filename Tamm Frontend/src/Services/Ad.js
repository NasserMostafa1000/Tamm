import { API_BASE_URL } from "../Utils/Constant";

export async function fetchAdsPreview(lang, filterWith, CurrentPlace) {
  try {
    // أبني رابط فيه باراميترز الكويري
    const url = new URL(`${API_BASE_URL}Listings/Preview`);
    url.searchParams.append("lang", lang);
    url.searchParams.append("filterWith", filterWith);
    url.searchParams.append("currentPlace", CurrentPlace);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ads preview");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ads:", error);
    return [];
  }
}
export async function fetchListingById(lang, listingId) {
  try {
    const url = new URL(`${API_BASE_URL}Listings/Details`);
    url.searchParams.append("lang", lang);
    url.searchParams.append("listingId", listingId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch listing");

    return await response.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}
export async function fetchUnApprovedListingById(lang, listingId, token) {
  try {
    const url = new URL(`${API_BASE_URL}Listings/unApprovedListingDetails`);
    url.searchParams.append("lang", lang);
    url.searchParams.append("listingId", listingId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch listing");

    return await response.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export const upsertCustomerRating = async (toUserId, ratingValue, token) => {
  const response = await fetch(
    `${API_BASE_URL}ClientsRatings/upsert?toUserId=${toUserId}&ratingValue=${ratingValue}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to submit rating.");
  }

  return response.text();
};

export const getCustomerRating = async (toUserId, token) => {
  const response = await fetch(`${API_BASE_URL}ClientsRatings/${toUserId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const error = await response.text();
    throw new Error(error || "Failed to fetch rating.");
  }

  return response.json();
};
