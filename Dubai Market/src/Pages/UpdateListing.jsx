import React, { useState, useEffect } from "react";
import {
  getFullListingForEdit,
  updateListingFull,
  uploadAdImage,
} from "../Services/PostUpdateAd";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const EditListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getFullListingForEdit(listingId, token);
        setListing(data);
        setImages(data.imageUrls || []);
      } catch (err) {
        console.error(err);
        setMessage({ text: "Failed to load listing", type: "error" });
      }
    };
    fetchListing();
  }, [listingId]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // رفع الصور الجديدة أولاً
      const uploadedUrls = [];
      for (const file of newImages) {
        const res = await uploadAdImage(file, listingId, token);
        uploadedUrls.push(res.imageUrl);
      }

      // الصور القديمة التي لم يتم حذفها
      const imagesToKeep = [...images];

      // دمج الصور القديمة مع الصور الجديدة المرفوعة
      const allImages = [...imagesToKeep, ...uploadedUrls];

      const dto = {
        ListingId: listing.listingId,
        PersonId: listing.personId,
        SubCategoryId: listing.subCategoryId,
        TitleEn: listing.titleEn,
        TitleAr: listing.titleAr,
        DescriptionEn: listing.descriptionEn,
        DescriptionAr: listing.descriptionAr,
        Price: listing.price,
        ListingAddressId: listing.listingAddressId,
        Email: listing.email,
        PhoneNumber: listing.phoneNumber,
        CityPlaceId: listing.cityPlaceId,
        ImageUrls: allImages,
        ExistingImageUrls: allImages,
        Attributes: listing.attributes,
      };

      await updateListingFull(dto, token);

      // إظهار رسالة النجاح في المودال بدلاً من الرسالة التقليدية
      setShowSuccessModal(true);
      setNewImages([]);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update listing", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate("/myads"); // التوجيه إلى صفحة إعلاناتي
  };

  if (!listing)
    return (
      <div className="flex justify-center items-center h-screen text-gray-900 dark:text-white">
        Loading...
      </div>
    );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-black text-white"
          : "bg-gradient-to-br from-gray-50 to-white text-black"
      }`}
    >
      <div className="container mx-auto p-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit Listing
        </h2>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-lg shadow-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 border-l-4 border-red-500 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Title (EN)
              </label>
              <input
                type="text"
                value={listing.titleEn || ""}
                onChange={(e) =>
                  setListing({ ...listing, titleEn: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Title (AR)
              </label>
              <input
                type="text"
                value={listing.titleAr || ""}
                onChange={(e) =>
                  setListing({ ...listing, titleAr: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Description (EN)
              </label>
              <textarea
                value={listing.descriptionEn || ""}
                onChange={(e) =>
                  setListing({ ...listing, descriptionEn: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Description (AR)
              </label>
              <textarea
                value={listing.descriptionAr || ""}
                onChange={(e) =>
                  setListing({ ...listing, descriptionAr: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Price (AED)
              </label>
              <input
                type="number"
                value={listing.price || ""}
                onChange={(e) =>
                  setListing({
                    ...listing,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={listing.email || ""}
                onChange={(e) =>
                  setListing({ ...listing, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Phone
              </label>
              <input
                type="text"
                value={listing.phoneNumber || ""}
                onChange={(e) =>
                  setListing({ ...listing, phoneNumber: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Attributes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listing.attributes.map((attr, idx) => (
              <div
                key={attr.attributeId || idx}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  {attr.attributeNameEn}
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={attr.value || ""}
                    onChange={(e) => {
                      const newAttrs = [...listing.attributes];
                      newAttrs[idx].value = e.target.value;
                      setListing({ ...listing, attributes: newAttrs });
                    }}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  {attr.unitEn && (
                    <span className="text-sm ml-2 dark:text-gray-400 whitespace-nowrap">
                      {attr.unitEn}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Images
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-4 dark:text-gray-300">
              Current Images ({images.length + newImages.length})
            </label>
            <div className="flex flex-wrap gap-4 mb-6">
              {images.map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt="Listing"
                    className="w-24 h-24 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg transition hover:bg-red-600"
                    onClick={() => handleRemoveImage(url)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {newImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New"
                    className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-dashed border-blue-400 transition-transform group-hover:scale-105"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg transition hover:bg-red-600"
                    onClick={() => handleRemoveNewImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <label className="inline-flex items-center justify-center bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-200 transition dark:bg-blue-900 dark:border-blue-700 dark:text-white dark:hover:bg-blue-800 w-full">
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Images
              </span>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Listing"
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2 dark:text-white">
              Listing Updated Successfully
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Your listing is now under review. You will be notified once it's
              approved.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleModalOk}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditListing;
