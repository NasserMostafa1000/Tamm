import { API_BASE_URL } from "../Utils/Constant";

// api.js
export default async function getPriceRange(subCategoryName) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Listings/GetPriceRange?subCategoryName=${encodeURIComponent(
        subCategoryName
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch price range");
    }

    const data = await response.json();
    return {
      min: data.minPrice,
      max: data.maxPrice,
    };
  } catch (error) {
    console.error("Error fetching price range:", error);
    return null;
  }
}
