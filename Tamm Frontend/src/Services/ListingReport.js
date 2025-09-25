// Services/Reports.js

import { API_BASE_URL } from "../Utils/Constant.js";
export const fetchReportReasons = async (lang) => {
  const response = await fetch(
    `${API_BASE_URL}ListingReports/GetReasons?lang=${lang}`
  );

  if (!response.ok) {
    throw new Error("فشل في جلب أسباب الإبلاغ");
  }

  return await response.json();
};

// 2. Submit a report
export const submitListingReport = async ({ userId, listingId, reasonId }) => {
  const userIdNum = Number(userId);
  const response = await fetch(`${API_BASE_URL}ListingReports/Insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userIdNum, // ✅ التعديل هنا
      listingId,
      reasonId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "فشل في إرسال البلاغ");
  }

  return await response.json();
};

// src/Services/ListingReportsService.js

export async function fetchListingReports(userToken, lang) {
  const res = await fetch(
    `${API_BASE_URL}ListingReports/GetListingReports?lang=${lang}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}

export async function approveReportAndDeleteListing(userToken, adId, reportId) {
  const res = await fetch(
    `${API_BASE_URL}ListingReports/ApproveReportAndDeleteAd?adId=${adId}&reportId=${reportId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to approve report and delete ad. Status: ${res.status}`);
  }

  return await res.json(); // علشان ترجع الـ { success: true }
}


export async function rejectReport(userToken, reportId) {
  const res = await fetch(
    `${API_BASE_URL}ListingReports/RejectReport?reportId=${reportId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to reject report. Status: ${res.status}`);
  }

  return await res.json(); // علشان ترجع الـ { success: true }
}
