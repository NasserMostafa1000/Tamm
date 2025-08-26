import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { playNotificationSound, ServerPath } from "../Utils/Constant";
import { useAuth } from "../Context/TokenContext";
import { useLanguage } from "../Context/LangContext";
import { fetchChatContacts } from "../Services/messages";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function MessagesPage() {
  const { userToken, userId } = useAuth();
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [connection, setConnection] = useState(null);
  console.log(contacts);
  useEffect(() => {
    if (!userToken) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ServerPath}chatHub`, {
        accessTokenFactory: () => userToken,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [userToken]);

  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        connection.on("UpdateContacts", () => {
          fetchContacts();
          playNotificationSound("/messageSent.mp3"); // شغل الصوت الأول
        });
      })
      .catch((err) => console.error("❌ SignalR error:", err));

    return () => {
      connection.stop();
    };
  }, [connection]);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const sameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const time = date.toLocaleTimeString(isArabic ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (sameDay) return `${isArabic ? "اليوم" : "Today"} ${time}`;
    if (isYesterday) return `${isArabic ? "أمس" : "Yesterday"} ${time}`;

    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const fetchContacts = async () => {
    try {
      const response = await fetchChatContacts();
      setContacts(response);
    } catch (err) {
      console.error("❌ Failed to load contacts", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);
  const openChat = (contact) => {
    const targetUserId =
      contact.fromUserId == userId ? contact.toUserId : contact.fromUserId;

    navigate("/Chat", {
      state: {
        recipientUserId: targetUserId,
        recipientName: contact.fullName,
        recipientImage: contact.imageUrl,
        listingId: contact.listingId,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        {isArabic ? "الرسائل الخاصة" : "Private Messages"}
      </h2>

      {contacts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          {isArabic ? "لا توجد رسائل بعد." : "No messages yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {contacts.map((contact, index) => {
            const isSenderMe = contact.fromUserId == userId;

            return (
              <div
                key={index}
                onClick={() => openChat(contact)}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all
                  ${
                    contact.isRead
                      ? "bg-white dark:bg-gray-800"
                      : "bg-blue-50 dark:bg-blue-900"
                  }`}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {contact.imageUrl ? (
                  <img
                    src={contact.imageUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-gray-400 dark:text-gray-500" />
                )}

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {contact.fullName}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(contact.sentAt)}
                    </span>
                  </div>

                  <p
                    className={`truncate text-sm ${
                      contact.isRead
                        ? "text-gray-500 dark:text-gray-400"
                        : "font-bold text-black dark:text-white"
                    }`}
                  >
                    {isSenderMe ? (isArabic ? "أنت: " : "You: ") : ""}
                    {contact.lastMessage}
                  </p>

                  {contact.listingId && contact.listingTitle && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate">
                      <a
                        href={`/ListingDetails/${contact.listingId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {isArabic
                          ? `بخصوص: ${contact.listingTitle}`
                          : `Regarding: ${contact.listingTitle}`}
                      </a>
                    </p>
                  )}
                </div>

                {!contact.isRead && (
                  <div
                    className="w-2 h-2 rounded-full bg-blue-500"
                    title={isArabic ? "غير مقروء" : "Unread"}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
