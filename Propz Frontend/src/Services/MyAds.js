import { API_BASE_URL } from "../Utils/Constant";

export async function getMyListings(lang, token, UserId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}Listings/GetListingsPreviewByUserId?lang=${lang}&userId=${UserId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch your listings.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}
export async function deleteListing(listingId, token) {
  try {
    const res = await fetch(
      `${API_BASE_URL}Listings/DeleteListing/${listingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to delete listing");

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
