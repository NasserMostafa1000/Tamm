// src/Services/paymentService.js

import { API_BASE_URL } from "../Utils/Constant";

export async function verifyPayPalOrder({
  orderId,
  amountOfCoins,
  paymentMethodId,
}) {
  try {
    const token = localStorage.getItem("userToken"); // أو حسب مكان تخزينك للتوكن

    const response = await fetch(`${API_BASE_URL}payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 إضافة التوكن هنا
      },
      body: JSON.stringify({
        orderId,
        amountOfCoins,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to verify payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying PayPal order:", error);
    throw error;
  }
}
