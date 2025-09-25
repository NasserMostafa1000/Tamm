import { API_BASE_URL } from "../Utils/Constant";

// جلب بيانات العميل من خلال التوكن
export default async function fetchUserDetails(token) {
  const res = await fetch(`${API_BASE_URL}Clients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user data");

  const data = await res.json();
  return data;
}
export async function fetchCountries() {
  const res = await fetch(`${API_BASE_URL}countries`);

  if (!res.ok) throw new Error("Failed to fetch countries");

  const data = await res.json();
  return data;
}
// Services/Profile.js

export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("userToken");

  const response = await fetch(`${API_BASE_URL}Clients/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user profile");
  }

  return await response.json();
};

export async function compressAndUploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("imageFile", file);
    const token = localStorage.getItem("userToken");
    const response = await fetch(`${API_BASE_URL}Clients/UploadClientImage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    return result; // يحتوي على imageUrl مثلاً
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
