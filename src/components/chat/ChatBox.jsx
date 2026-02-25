import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { getAssistantReply } from "../../data/chatResponses";

export default function ChatBox({ externalMessage }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";

  const STORAGE_KEY = "moodbloom_chat";
  const messagesEndRef = useRef(null);
  const lastExternalMessageRef = useRef(null);

  const getInitialMessage = () => ({
    role: "assistant",
    text:
      lang === "en"
        ? "Hello! I'm your MoodBloom companion..."
        : "Привіт! Я ваш помічник MoodBloom...",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [getInitialMessage()];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([getInitialMessage()]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    (textParam) => {
      const textToSend = textParam ?? input;
      if (!textToSend.trim()) return;

      const timeNow = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMessage = {
        role: "user",
        text: textToSend,
        time: timeNow,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      setTimeout(() => {
        const reply = getAssistantReply(textToSend, lang);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: reply,
            time: timeNow,
          },
        ]);
      }, 500);
    },
    [input, lang]
  );

  // Виправлений ефект швидких тем
  useEffect(() => {
    if (
      externalMessage &&
      externalMessage !== lastExternalMessageRef.current
    ) {
      handleSend(externalMessage);
      lastExternalMessageRef.current = externalMessage;
    }
  }, [externalMessage, handleSend]);

  return (
  <div
  className="
    w-full max-w-[1000px]
    rounded-[40px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-4 sm:px-8 py-6 sm:py-10
    flex flex-col
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
      <div
        className="
          flex flex-col gap-5
          mb-6
          max-h-[400px] sm:max-h-[500px]
          overflow-y-auto
          pr-2
        "
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? `
                  self-end
                  max-w-[85%] sm:max-w-[60%]
                  text-right
                  bg-accent text-white
                  px-3 sm:px-4 py-2 sm:py-3
                  rounded-[18px] sm:rounded-[20px]
                `
                : "max-w-[85%] sm:max-w-[70%]"
            }
          >
            <p className="text-[14px] sm:text-[15px] leading-relaxed">
              {msg.text}
            </p>
            <span className="text-[11px] sm:text-[12px] opacity-60">
              {msg.time}
            </span>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div
        className="
          flex items-center gap-3
          border border-gray-300 dark:border-gray-700
          rounded-full px-4 sm:px-6 py-2 sm:py-3
          focus-within:border-accent
          transition
        "
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            lang === "en"
              ? "Type your message"
              : "Введіть повідомлення"
          }
          className="
            flex-1 bg-transparent
            outline-none
            text-[13px] sm:text-[14px]
            placeholder:opacity-50
          "
        />

        <Send
          size={18}
          onClick={() => handleSend()}
          className="
            cursor-pointer
            text-accent
            hover:scale-110
            transition
          "
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={clearChat}
          className="
            text-[12px] sm:text-[13px]
            font-medium
            text-gray-500
            hover:text-accent
            transition
            relative
            after:absolute after:left-0 after:-bottom-0.5
            after:h-[1px] after:w-0
            after:bg-accent
            after:transition-all after:duration-300
            hover:after:w-full
          "
        >
          {lang === "en" ? "Clear chat" : "Очистити чат"}
        </button>
      </div>
    </div>
  );
}