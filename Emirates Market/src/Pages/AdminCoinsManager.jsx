import React, { useEffect, useState } from "react";
import {
  IoMdAddCircleOutline,
  IoMdTrash,
  IoMdCreate,
  IoMdSave,
  IoMdClose,
} from "react-icons/io";
import { FaCoins, FaCog } from "react-icons/fa";
import {
  getAllCoinPackages,
  addCoinPackage,
  updateCoinPackage,
  deleteCoinPackage,
  updateCoinRate,
  updateAdPrice,
  getAdPrice,
  getCoinRate,
} from "../Services/AdminCoinsManager";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";

export default function AdminCoinsManager() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    coinsAmount: "",
    coinPrice: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editPackage, setEditPackage] = useState({});
  const [coinRate, setCoinRate] = useState("");
  const [adPrice, setAdPrice] = useState("");

  const fetchPackages = async () => {
    try {
      const data = await getAllCoinPackages();
      setPackages(data);
    } catch {
      alert(
        language === "العربية" ? "فشل جلب البيانات" : "Failed to fetch data"
      );
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchCoinRate();
    fetchAdPrice();
  }, []);

  const fetchCoinRate = async () => {
    try {
      const rate = await getCoinRate();
      setCoinRate(rate);
    } catch {
      alert(
        language === "العربية"
          ? "فشل جلب سعر العملة"
          : "Failed to fetch coin rate"
      );
    }
  };

  const fetchAdPrice = async () => {
    try {
      const price = await getAdPrice();
      setAdPrice(price);
    } catch {
      alert(
        language === "العربية"
          ? "فشل جلب سعر الإعلان"
          : "Failed to fetch ad price"
      );
    }
  };

  const handleCoinRateUpdate = async () => {
    try {
      await updateCoinRate(Number(coinRate));
    } catch {
      alert(language === "العربية" ? "فشل التحديث" : "Update failed");
    }
  };

  const handleAdPriceUpdate = async () => {
    try {
      await updateAdPrice(Number(adPrice));
      alert(
        language === "العربية" ? "تم تحديث سعر الإعلان" : "Ad price updated"
      );
    } catch {
      alert(language === "العربية" ? "فشل التحديث" : "Update failed");
    }
  };

  const handleAdd = async () => {
    if (!newPackage.coinsAmount || !newPackage.coinPrice) {
      alert(
        language === "العربية"
          ? "يرجى إدخال عدد الكوينز والسعر"
          : "Please enter coins amount and price"
      );
      return;
    }

    try {
      await addCoinPackage(newPackage);
      setNewPackage({ coinsAmount: "", coinPrice: "" });
      fetchPackages();
    } catch {
      alert(
        language === "العربية" ? "خطأ أثناء الإضافة" : "Error while adding"
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        language === "العربية"
          ? "هل تريد حذف هذه الباقة؟"
          : "Do you want to delete this package?"
      )
    )
      return;

    try {
      await deleteCoinPackage(id);
      fetchPackages();
    } catch {
      alert(language === "العربية" ? "فشل الحذف" : "Delete failed");
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.coinId);
    setEditPackage(pkg);
  };

  const handleUpdate = async () => {
    if (!editPackage.coinsAmount || !editPackage.coinPrice) {
      alert(
        language === "العربية"
          ? "يرجى إدخال عدد الكوينز والسعر"
          : "Please enter coins amount and price"
      );
      return;
    }

    try {
      editPackage.coinPrice = Number(editPackage.coinPrice);
      await updateCoinPackage(editPackage);
      setEditingId(null);
      fetchPackages();
    } catch {
      alert(language === "العربية" ? "فشل التحديث" : "Update failed");
    }
  };

  return (
    <div
      className={`p-6 max-w-7xl mx-auto ${
        mode === "dark" ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FaCoins
            className={`${
              mode === "dark" ? "text-yellow-400" : "text-yellow-600"
            }`}
          />
          {language === "العربية"
            ? "إدارة باقات الكوينز"
            : "Manage Coin Packages"}
        </h2>
      </div>
      {/* System Settings Section */}
      <div
        className={`p-6 rounded-xl shadow-md mb-8 ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCog className="text-blue-500" />
          {language === "العربية" ? "إعدادات النظام" : "System Settings"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === "العربية"
                ? "سعر العملة بالدرهم"
                : "Coin Rate (AED)"}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className={`flex-1 p-3 rounded-lg border ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
                value={coinRate}
                onChange={(e) => setCoinRate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // هنا تحط اللي عايز يعمله لما تضغط Enter
                    // مثلاً:
                    updateCoinRate(Number(coinRate)); // دالة بتعمل تحديث السعر أو أي عملية ثانية
                  }
                }}
              />

              <button
                onClick={handleCoinRateUpdate}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <IoMdSave size={16} />
                {language === "العربية" ? "تحديث" : "Update"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === "العربية"
                ? "سعر رفع الإعلان (بالكوين)"
                : "Ad Posting Price (Coins)"}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className={`flex-1 p-3 rounded-lg border ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
                value={adPrice}
                onChange={(e) => setAdPrice(e.target.value)}
              />
              <button
                onClick={handleAdPriceUpdate}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <IoMdSave size={16} />
                {language === "العربية" ? "تحديث" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Package Section */}
      <div
        className={`p-6 rounded-xl shadow-md mb-8 ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {language === "العربية" ? "إضافة باقة جديدة" : "Add New Package"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {language === "العربية" ? "عدد الكوينز" : "Coins Amount"}
            </label>
            <input
              type="number"
              className={`w-full p-3 rounded-lg border ${
                mode === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              value={newPackage.coinsAmount}
              onChange={(e) =>
                setNewPackage({ ...newPackage, coinsAmount: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {language === "العربية" ? "السعر بالدرهم" : "Price (AED)"}
            </label>
            <input
              type="number"
              className={`w-full p-3 rounded-lg border ${
                mode === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              value={newPackage.coinPrice}
              onChange={(e) =>
                setNewPackage({ ...newPackage, coinPrice: e.target.value })
              }
            />
          </div>
          <div className="flex items-end">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all"
              onClick={handleAdd}
            >
              <IoMdAddCircleOutline size={20} />
              {language === "العربية" ? "إضافة" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.coinId}
            className={`rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            dir={language === "العربية" ? "rtl" : "ltr"}
          >
            {editingId === pkg.coinId ? (
              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === "العربية" ? "عدد الكوينز" : "Coins Amount"}
                  </label>
                  <input
                    type="number"
                    className={`w-full p-2 rounded-lg border ${
                      mode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    value={editPackage.coinsAmount}
                    onChange={(e) =>
                      setEditPackage({
                        ...editPackage,
                        coinsAmount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === "العربية" ? "السعر بالدرهم" : "Price (AED)"}
                  </label>
                  <input
                    type="number"
                    className={`w-full p-2 rounded-lg border ${
                      mode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    value={editPackage.coinPrice}
                    onChange={(e) =>
                      setEditPackage({
                        ...editPackage,
                        coinPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                  >
                    <IoMdClose size={18} />
                    {language === "العربية" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <IoMdSave size={18} />
                    {language === "العربية" ? "حفظ" : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`text-2xl font-bold ${
                      mode === "dark" ? "text-yellow-400" : "text-yellow-600"
                    } flex items-center gap-2`}
                  >
                    <FaCoins size={24} />
                    {pkg.coinsAmount}{" "}
                    {language === "العربية" ? "كوين" : "Coins"}
                  </div>
                </div>
                <div
                  className={`text-lg mb-6 ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {pkg.coinPrice}{" "}
                  {language === "العربية" ? "درهم إماراتي" : "AED"}
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                  >
                    <IoMdCreate size={18} />
                    {language === "العربية" ? "تعديل" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.coinId)}
                    className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                  >
                    <IoMdTrash size={18} />
                    {language === "العربية" ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
