// src/Services/Chat.js
import { API_BASE_URL } from "../Utils/Constant";

export async function fetchChatContacts() {
  const token = localStorage.getItem("userToken");

  const res = await fetch(`${API_BASE_URL}Chat/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch contacts");

  return await res.json();
}

// الدالة الجديدة لجلب الرسائل بين المستخدم الحالي وجهة الاتصال
export async function fetchMessages(currentUserId, contactUserId) {
  const token = localStorage.getItem("userToken");

  const res = await fetch(
    `${API_BASE_URL}Chat/messages?currentUserId=${currentUserId}&contactUserId=${contactUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch messages");

  return await res.json();
}

export async function fetchUnreadMessagesCount() {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) throw new Error("Token not found");

    const response = await fetch(`${API_BASE_URL}chat/UnreadCount`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.totalMessages;
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    return 0;
  }
}
