import React, { useState } from "react";
import { addParentCategory } from "../Services/PostAd";
import LoadingSpinner from "../Loader/LoadingSpinner";
import { useLanguage } from "../Context/LangContext";
import { AddAttribute } from "../Services/Attributes";

function InsertingAttribute() {
  const [categoryNameEn, setCategoryNameEn] = useState("");
  const [categoryNameAr, setCategoryNameAr] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [currentAttribute, setCurrentAttribute] = useState({
    AttributeNameEn: "",
    AttributeNameAR: "",
    UnitEn: "",
    UnitAr: "",
  });
  const [step, setStep] = useState("category");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { language } = useLanguage();

  // في المكون الرئيسي InsertingAttribute.js
  const handleSubmitCategory = async (attrs) => {
    setLoading(true);
    setLoadingMessage(
      language === "العربية" ? "جارٍ إضافة القسم..." : "Adding category..."
    );

    try {
      // 1. إضافة القسم الرئيسي أولاً
      const result = await addParentCategory({
        categoryNameEn,
        categoryNameAr,
      });

      const categoryId = result.categoryId;

      setLoadingMessage(
        language === "العربية"
          ? "تم إضافة القسم، جاري إضافة المواصفات..."
          : "Category added. Now adding attributes..."
      );

      // 2. إضافة السمات بشكل تسلسلي
      if (attrs && attrs.length > 0) {
        for (const attr of attrs) {
          if (attr.AttributeNameEn || attr.AttributeNameAR) {
            try {
              await AddAttribute({
                CategoryId: categoryId,
                AttributeNameEn: attr.AttributeNameEn,
                AttributeNameAR: attr.AttributeNameAR,
                UnitEn: attr.UnitEn,
                UnitAr: attr.UnitAr,
              });
            } catch (error) {
              console.error(`Failed to add attribute: ${error.message}`);
              throw new Error(
                language === "العربية"
                  ? `فشل إضافة المواصفة: ${
                      attr.AttributeNameEn || attr.AttributeNameAR
                    }`
                  : `Failed to add attribute: ${
                      attr.AttributeNameEn || attr.AttributeNameAR
                    }`
              );
            }
          }
        }
      }

      setLoadingMessage(
        language === "العربية" ? "تمت الإضافة بنجاح!" : "Added successfully!"
      );

      // إعادة تعيين النموذج
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        language === "العربية"
          ? `حدث خطأ: ${error.message}`
          : `Error occurred: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // دالة مساعدة لإعادة تعيين النموذج
  const resetForm = () => {
    setCategoryNameEn("");
    setCategoryNameAr("");
    setAttributes([]);
    setCurrentAttribute({
      AttributeNameEn: "",
      AttributeNameAR: "",
      UnitEn: "",
      UnitAr: "",
    });
    setStep("category");
  };

  const handleAddAttribute = () => {
    if (
      currentAttribute.AttributeNameEn ||
      currentAttribute.AttributeNameAR ||
      currentAttribute.UnitEn ||
      currentAttribute.UnitAr
    ) {
      setAttributes([...attributes, { ...currentAttribute }]);
    }
    setCurrentAttribute({
      AttributeNameEn: "",
      AttributeNameAR: "",
      UnitEn: "",
      UnitAr: "",
    });
    setStep("confirm");
  };

  const handleAddAnotherAttribute = () => {
    setStep("attribute");
  };

  const handleFinish = async () => {
    // التحقق من وجود اسم القسم
    if (!categoryNameEn && !categoryNameAr) {
      alert(
        language === "العربية"
          ? "يرجى إدخال اسم القسم"
          : "Please enter category name"
      );
      setStep("category");
      return;
    }

    // تجميع كل السمات
    let updatedAttributes = [...attributes];
    if (
      currentAttribute.AttributeNameEn ||
      currentAttribute.AttributeNameAR ||
      currentAttribute.UnitEn ||
      currentAttribute.UnitAr
    ) {
      updatedAttributes = [...attributes, { ...currentAttribute }];
    }

    // إضافة تأخير بين الطلبات إذا لزم الأمر
    await handleSubmitCategory(updatedAttributes);
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <LoadingSpinner label={loadingMessage} />
        <p className="mt-4 text-lg font-semibold text-black dark:text-white">
          {loadingMessage}
        </p>
        {loadingMessage.includes("adding attributes") && (
          <p className="text-sm text-gray-500">
            {language === "العربية"
              ? "قد تستغرق العملية بعض الوقت..."
              : "This may take a while..."}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-yellow-600 dark:text-yellow-400 mb-6">
        {language === "العربية" ? "إضافة قسم جديد" : "Add New Category"}
      </h1>

      {step === "category" && (
        <>
          <input
            type="text"
            placeholder={
              language === "العربية"
                ? "اسم القسم بالعربية"
                : "Category name in Arabic"
            }
            value={categoryNameAr}
            onChange={(e) => setCategoryNameAr(e.target.value)}
            className="w-full p-3 border rounded text-black placeholder-black"
          />
          <input
            type="text"
            placeholder={
              language === "العربية"
                ? "اسم القسم بالإنجليزية"
                : "Category name in English"
            }
            value={categoryNameEn}
            onChange={(e) => setCategoryNameEn(e.target.value)}
            className="w-full p-3 border rounded text-black placeholder-black"
          />
          <button
            onClick={() => {
              if (!categoryNameEn && !categoryNameAr) {
                alert(
                  language === "العربية"
                    ? "يرجى إدخال اسم القسم"
                    : "Please enter category name"
                );
                return;
              }
              setStep("attribute");
            }}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            {language === "العربية" ? "التالي" : "Next"}
          </button>
        </>
      )}

      {step === "attribute" && (
        <>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {language === "العربية" ? "مواصفة جديدة" : "New Attribute"}
          </h2>

          <input
            type="text"
            placeholder={
              language === "العربية"
                ? "الاسم بالعربية"
                : "Attribute name in Arabic"
            }
            value={currentAttribute.AttributeNameAR}
            onChange={(e) =>
              setCurrentAttribute({
                ...currentAttribute,
                AttributeNameAR: e.target.value,
              })
            }
            className="w-full p-3 border rounded text-black placeholder-black"
          />

          <input
            type="text"
            placeholder={
              language === "العربية" ? "الوحدة بالعربية" : "Unit in Arabic"
            }
            value={currentAttribute.UnitAr}
            onChange={(e) =>
              setCurrentAttribute({
                ...currentAttribute,
                UnitAr: e.target.value,
              })
            }
            className="w-full p-3 border rounded text-black placeholder-black"
          />
          <input
            type="text"
            placeholder={
              language === "العربية"
                ? "الاسم بالإنجليزية"
                : "Attribute name in English"
            }
            value={currentAttribute.AttributeNameEn}
            onChange={(e) =>
              setCurrentAttribute({
                ...currentAttribute,
                AttributeNameEn: e.target.value,
              })
            }
            className="w-full p-3 border rounded text-black placeholder-black"
          />
          <input
            type="text"
            placeholder={
              language === "العربية" ? "الوحدة بالإنجليزية" : "Unit in English"
            }
            value={currentAttribute.UnitEn}
            onChange={(e) =>
              setCurrentAttribute({
                ...currentAttribute,
                UnitEn: e.target.value,
              })
            }
            className="w-full p-3 border rounded text-black placeholder-black"
          />
          <button
            onClick={handleAddAttribute}
            disabled={
              !currentAttribute.AttributeNameEn &&
              !currentAttribute.AttributeNameAR
            }
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {language === "العربية" ? "التالي" : "Next"}
          </button>
        </>
      )}

      {step === "confirm" && (
        <div className="space-y-3">
          <p className="text-black dark:text-white text-lg">
            {language === "العربية"
              ? "هل تريد إضافة مواصفة أخرى؟"
              : "Do you want to add another attribute?"}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleAddAnotherAttribute}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {language === "العربية" ? "نعم" : "Yes"}
            </button>
            <button
              onClick={handleFinish}
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
            >
              {language === "العربية" ? "لا، إنهاء" : "No, Finish"}
            </button>
          </div>

          {attributes.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-black dark:text-white">
                {language === "العربية"
                  ? "المواصفات المضافة:"
                  : "Added attributes:"}
              </h3>
              <ul className="list-disc pl-5 text-black dark:text-white">
                {attributes.map((attr, index) => (
                  <li key={index}>
                    {attr.AttributeNameEn || attr.AttributeNameAR}
                    {(attr.UnitEn || attr.UnitAr) &&
                      ` (${attr.UnitEn || attr.UnitAr})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InsertingAttribute;
