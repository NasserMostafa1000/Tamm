import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import ImagesUploader from "./ImagesUplader";
import { fetchAttributesByCategory } from "../Services/PostAd";

export default function StepFiveListingDetails({
  setTitleEn,
  setTitleAr,
  setDescriptionEn,
  setDescriptionAr,
  setPrice,
  SelectedImages,
  SetSelectedImages,
  subCategoryId,
  setAttributeValues,
  parentCategoryId,
  parentCategoryName,
}) {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    if (subCategoryId) {
      const categoryId =
        parentCategoryName === "عقارات" || parentCategoryName === "Real Estate"
          ? subCategoryId
          : parentCategoryId;

      fetchAttributesByCategory(categoryId, isArabic ? "ar" : "en").then(
        (data) => setAttributes(data)
      );
    }
  }, [subCategoryId, isArabic, parentCategoryName, parentCategoryId]);

  const handleAttributeChange = (attributeId, value) => {
    setAttributeValues((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (item) => item.attributeId === attributeId
      );

      if (index !== -1) {
        updated[index].value = value;
      } else {
        updated.push({ attributeId, value });
      }

      return updated;
    });
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-4 ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <h2 className="text-lg font-bold text-green-700 dark:text-green-300">
        {isArabic ? "تفاصيل الإعلان" : "Ad Details"}
      </h2>

      <input
        type="text"
        required
        onChange={(e) => setTitleAr(e.target.value)}
        placeholder={isArabic ? "عنوان الإعلان بالعربية" : "Title in Arabic"}
        className="w-full p-2 border border-green-400 rounded mb-3 text-black placeholder-black"
      />
      <textarea
        required
        onChange={(e) => setDescriptionAr(e.target.value)}
        placeholder={
          isArabic ? "وصف الإعلان بالعربية" : "Description in Arabic"
        }
        className="w-full p-2 border border-green-400 rounded mb-3 text-black placeholder-black"
      />
      <input
        type="text"
        required
        onChange={(e) => setTitleEn(e.target.value)}
        placeholder={
          isArabic ? "عنوان الإعلان بالإنجليزية" : "Title in English"
        }
        className="w-full p-2 border border-green-400 rounded mb-3 text-black placeholder-black"
      />

      <textarea
        required
        onChange={(e) => setDescriptionEn(e.target.value)}
        placeholder={
          isArabic ? "وصف الإعلان بالإنجليزية" : "Description in English"
        }
        className="w-full p-2 border border-green-400 rounded mb-3 text-black placeholder-black"
      />

      <input
        type="number"
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        placeholder={isArabic ? "السعر" : "Price "}
        className="w-full p-2 border border-green-400 rounded mb-3 text-black placeholder-black"
      />

      {attributes.map((attr) => {
        const endsWithQuestionMark =
          attr.attributeName.trim().endsWith("؟") ||
          attr.attributeName.trim().endsWith("?");

        return (
          <div key={attr.attributeId} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isArabic
                ? `${attr.attributeName}${attr.unit ? ` / ${attr.unit}` : ""}`
                : `${attr.attributeName}${attr.unit ? ` / ${attr.unit}` : ""} `}
            </label>

            {endsWithQuestionMark ? (
              <select
                onChange={(e) =>
                  handleAttributeChange(attr.attributeId, e.target.value)
                }
                className="w-full p-2 border border-green-400 rounded text-black"
              >
                <option value="">{isArabic ? "اختر" : "Select"}</option>
                <option value="yes">{isArabic ? "نعم" : "Yes"}</option>
                <option value="no">{isArabic ? "لا" : "No"}</option>
              </select>
            ) : (
              <input
                type="text"
                onChange={(e) =>
                  handleAttributeChange(attr.attributeId, e.target.value)
                }
                placeholder=""
                className="w-full p-2 border border-green-400 rounded text-black placeholder-black"
              />
            )}
          </div>
        );
      })}

      <ImagesUploader
        selectedImages={SelectedImages}
        setSelectedImages={SetSelectedImages}
      />
    </div>
  );
}
