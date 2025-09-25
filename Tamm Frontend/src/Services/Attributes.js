import { API_BASE_URL } from "../Utils/Constant.js";
// Services/Attributes.js
export const AddAttribute = async ({
  CategoryId,
  AttributeNameEn,
  AttributeNameAR,
  UnitEn,
  UnitAr,
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}Attributes/AddAttribute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
      },
      body: JSON.stringify({
        CategoryId: Number(CategoryId), // تأكد من أن القيمة رقمية
        AttributeNameEn,
        AttributeNameAR,
        UnitEn: UnitEn || null, // إرسال null إذا كانت القيمة فارغة
        UnitAr: UnitAr || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add attribute");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in AddAttribute:", error);
    throw error; // إعادة رمي الخطأ للتعامل معه في المكون الرئيسي
  }
};
export default AddAttribute;
