import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";

export default function ImagesUploader({ selectedImages, setSelectedImages }) {
  const { language } = useLanguage();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setMainImageIndex(0);
  };

  useEffect(() => {
    const urls = selectedImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const handleClearImages = () => {
    setSelectedImages([]);
    setPreviewUrls([]);
    setMainImageIndex(0);
    document.getElementById("image-upload").value = "";
  };

  return (
    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-md">
      <label
        htmlFor="image-upload"
        className="block mb-2 font-semibold text-yellow-600 dark:text-yellow-400 cursor-pointer"
      >
        {language === "العربية"
          ? "اختر صور الإعلان (يمكن اختيار أكثر من صورة)"
          : "Select ad images (you can select multiple)"}
      </label>

      <input
        id="image-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="w-full p-2 border border-yellow-400 rounded-lg cursor-pointer text-sm text-yellow-800 dark:text-yellow-300"
      />

      {selectedImages.length > 0 && (
        <div className="mt-4 space-y-3">
          {/* الصورة الكبيرة */}
          <div>
            <img
              src={previewUrls[mainImageIndex]}
              alt="Main preview"
              className="w-full h-64 object-contain rounded-lg border shadow"
            />
          </div>

          {/* الصور المصغرة */}
          <div className="flex flex-wrap justify-center gap-2">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Thumb ${idx}`}
                onClick={() => setMainImageIndex(idx)}
                className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer ${
                  idx === mainImageIndex
                    ? "border-yellow-500"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleClearImages}
            className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {language === "العربية"
              ? "حذف الصور المحددة"
              : "Clear selected images"}
          </button>
        </div>
      )}
    </div>
  );
}
