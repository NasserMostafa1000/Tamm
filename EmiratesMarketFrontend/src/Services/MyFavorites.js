// Services/FavoritesApi.js
import { API_BASE_URL } from "../Utils/Constant";
export async function getUserFavorites(lang, token) {
  try {
    const res = await fetch(
      `${API_BASE_URL}Favorites/GetUserFavorites?lang=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch favorites");
    return await res.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}
export async function deleteFavorite(favoriteId, token) {
  try {
    const res = await fetch(`${API_BASE_URL}Favorites/Delete/${favoriteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete favorite");
    return await res.json();
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return null;
  }
}
