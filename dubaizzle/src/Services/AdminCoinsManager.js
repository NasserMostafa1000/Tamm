import { API_BASE_URL } from "../Utils/Constant.js";

function getAuthHeaders() {
  const token = localStorage.getItem("userToken"); // عدّل حسب مكان تخزين التوكن عندك
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAllCoinPackages() {
  const res = await fetch(`${API_BASE_URL}Coins/GetAll`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("فشل جلب البيانات");
  return res.json();
}

export async function addCoinPackage(newPackage) {
  const res = await fetch(`${API_BASE_URL}Coins/Add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(newPackage),
  });
  if (!res.ok) throw new Error("خطأ أثناء الإضافة");
}

export async function updateCoinPackage(editPackage) {
  const res = await fetch(`${API_BASE_URL}Coins/Update`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(editPackage),
  });
  if (!res.ok) throw new Error("فشل التحديث");
}

export async function deleteCoinPackage(id) {
  const res = await fetch(`${API_BASE_URL}Coins/Delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("فشل الحذف");
}
// Get coin rate
export async function getCoinRate() {
  const res = await fetch(`${API_BASE_URL}AdminSettings/GetCoinRate`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("فشل جلب سعر العملة");
  return res.json();
}

// Update coin rate
export async function updateCoinRate(value) {
  const res = await fetch(`${API_BASE_URL}AdminSettings/UpdateCoinRate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("فشل تحديث سعر العملة");
}

// Get ad posting price
export async function getAdPrice() {
  const res = await fetch(`${API_BASE_URL}AdminSettings/GetAdPrice`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("فشل جلب سعر الإعلان");
  return res.json();
}

// Update ad posting price
export async function updateAdPrice(value) {
  const res = await fetch(`${API_BASE_URL}AdminSettings/UpdateAdPrice`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("فشل تحديث سعر الإعلان");
}
