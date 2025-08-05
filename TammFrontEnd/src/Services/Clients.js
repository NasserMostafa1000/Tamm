import { API_BASE_URL } from "../Utils/Constant.js";

export async function sendNotification({
  emailOrUserId,
  subject,
  body,
  provider,
}) {
  const res = await fetch(`${API_BASE_URL}Notifications/SendNotification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailOrUserId,
      subject,
      body,
      notificationProvider: provider,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to send notification");
  }
  return await res.text();
}

export async function fetchClientsPaged(pageNumber, pageSize, token) {
  const res = await fetch(
    `${API_BASE_URL}Clients/GetClients?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch clients");
  return await res.json();
}

export async function getAllClients(token) {
  let all = [];
  let page = 1;
  while (true) {
    const data = await fetchClientsPaged(page, 100, token); // نستخرج 100 صف في كل صفحة
    if (!data.clients || data.clients.length === 0) break;
    all = all.concat(data.clients);
    if (all.length >= data.totalCount) break;
    page++;
  }
  return all;
}

export async function blockPerson(personId, token) {
  const res = await fetch(
    `${API_BASE_URL}Users/BlockPerson?personId=${personId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to block user");
  }

  return res.text(); // بيرجع "User blocked successfully."
}
export const deletePerson = async (UserId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}Clients/${UserId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "فشل في حذف الشخص");
    }

    return await response.json();
  } catch (error) {
    throw error.message || "حدث خطأ أثناء الحذف";
  }
};
