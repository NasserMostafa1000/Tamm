import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Context/TokenContext";
import { fetchUnApprovedListingById } from "../Services/Ad";
import { fetchMessages } from "../Services/messages";
import { playNotificationSound, ServerPath } from "../Utils/Constant";
import { useLanguage } from "../Context/LangContext";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../Context/ThemeContext";
import { FaUserCircle, FaCheck, FaCheckDouble } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function ChatPage() {
  const { userToken } = useAuth();
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const location = useLocation();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { recipientUserId, listingId, recipientName, recipientImage } =
    location.state || {};
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [listing, setListing] = useState(null);
  const initialized = useRef(false);
  const messagesEndRef = useRef(null);

  let userId = null;

  try {
    if (userToken) {
      const decoded = jwtDecode(userToken);
      userId = decoded.sub || decoded.userId || decoded.nameID || null;
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }

  // إنشاء اتصال SignalR
  useEffect(() => {
    if (!userToken) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${ServerPath}chatHub`, {
        accessTokenFactory: () => userToken,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [userToken]);

  // بدء الاتصال والاستماع للرسائل الجديدة
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("✅ SignalR connected to ChatHub");

        connection.on("ReceiveMessage", (newMessage) => {
          setMessages((prev) => [...prev, newMessage]);
          playNotificationSound("/messageSent.mp3"); // شغل الصوت الأول
        });

        connection.on("MessageSent", () => {});
      })
      .catch((err) => console.error("❌ SignalR connection error", err));

    return () => {
      connection.off("ReceiveMessage");
      connection.off("MessageSent");
    };
  }, [connection]);

  // جلب بيانات الإعلان والرسائل
  useEffect(() => {
    if (!userToken || !recipientUserId || initialized.current) return;

    async function loadData() {
      try {
        if (listingId) {
          const data = await fetchUnApprovedListingById(
            isArabic ? "ar" : "en",
            listingId
          );
          setListing(data);
        }

        const fetchedMessages = await fetchMessages(userId, recipientUserId);
        setMessages(fetchedMessages);

        // إرسال رسالة افتراضية إذا كان هناك إعلان
        if (listingId && connection) {
          const defaultMsg = isArabic
            ? "هل مازال الإعلان متوفرًا؟"
            : "Is this ad still available?";

          const hasDefaultMsg = fetchedMessages.some(
            (msg) =>
              msg.message === defaultMsg &&
              msg.fromUserId === userId &&
              msg.toUserId === recipientUserId
          );

          if (!hasDefaultMsg) {
            const sentMessage = {
              fromUserId: userId ? parseInt(userId) : 0,
              toUserId: recipientUserId,
              message: defaultMsg,
              listingId,
              sentAt: new Date().toISOString(),
              isRead: false,
            };

            await connection.invoke(
              "SendMessage",
              Number(recipientUserId),
              defaultMsg,
              listingId
            );
            setMessages((prev) => [...prev, sentMessage]);
          }
        }

        initialized.current = true;
      } catch (error) {
        console.error("Failed to load chat data:", error);
      }
    }

    loadData();
  }, [userToken, recipientUserId, listingId, isArabic, userId, connection]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const newMessage = {
        fromUserId: userId ? parseInt(userId) : 0,
        toUserId: recipientUserId,
        message,
        listingId,
        sentAt: new Date().toISOString(),
        isRead: false,
      };

      await connection.invoke(
        "SendMessage",
        recipientUserId,
        message,
        listingId
      );

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      playNotificationSound("/messageSent.mp3"); // شغل الصوت الأول
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // التمرير التلقائي عند وجود رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: isArabic ? ar : enUS,
    });
  };

  if (!userToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 dark:text-red-400 p-4 text-center text-lg">
          {isArabic
            ? "سجّل الدخول لبدء المحادثة"
            : "Please login to start chatting"}
        </p>
      </div>
    );
  }

  const defaultMsg = isArabic
    ? "هل مازال الإعلان متوفرًا؟"
    : "Is this ad still available?";

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        {recipientImage ? (
          <img
            src={recipientImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-500 dark:text-gray-300" />
        )}

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {recipientName || "User"}
          </h2>
        </div>
      </div>

      {/* Listing preview */}
      {listing && (
        <div className="flex items-center gap-3 p-3 mx-3 mt-3 rounded-lg bg-gray-100 dark:bg-gray-800">
          <img
            src={
              listing.images?.[0]?.imageUrl ||
              listing.images?.[0]?.url ||
              "/no-image.jpg"
            }
            alt="Listing"
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold dark:text-white">
              {listing.title}
            </h3>
            <p className="text-xs dark:text-gray-300">{listing.price} AED</p>
          </div>
        </div>
      )}

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          const isDefaultMessage = msg.message === defaultMsg;
          const isMyMessage = msg.fromUserId == userId;
          const isRead = msg.isRead || false;

          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isMyMessage ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  isMyMessage
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none"
                }`}
              >
                <div className="text-sm">{msg.message}</div>

                {msg.listingId && (
                  <a
                    href={`/Listing/${msg.listingId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs underline mt-1 inline-block ${
                      isMyMessage ? "text-blue-200" : "text-blue-500"
                    }`}
                  >
                    {isArabic ? "بخصوص الإعلان" : "Regarding ad"}
                  </a>
                )}

                <div className="flex items-center justify-end mt-1 space-x-2">
                  <span className="text-xs opacity-70">
                    {formatDate(msg.sentAt)}
                  </span>
                  {isMyMessage && (
                    <span className="text-xs">
                      {isRead ? (
                        <FaCheckDouble className="text-blue-200" />
                      ) : (
                        <FaCheck className="text-gray-400" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            className={`flex-1 p-2 rounded-full ${
              isDark ? "bg-gray-700 text-white" : "bg-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isArabic ? "اكتب رسالة..." : "Type a message..."}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
