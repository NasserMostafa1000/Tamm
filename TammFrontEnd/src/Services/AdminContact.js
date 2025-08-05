import { API_BASE_URL } from "../Utils/Constant";
export const getContactUs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}AdminSettings/GetContactUs`);

    if (!response.ok) {
      throw new Error("Failed to fetch contact information.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    throw error;
  }
};

// 🟡 2. تحديث بيانات التواصل (يتطلب توكن)
export const updateContactUs = async (data, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}AdminSettings/UpdateContactUs`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ← التوكن هنا
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update contact info: ${error}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating contact info:", error);
    throw error;
  }
};
