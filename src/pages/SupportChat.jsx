import React, { useState } from "react";
import QuickTopics from "../components/chat/QuickTopics";
import AboutChat from "../components/chat/AboutChat";
import ChatBox from "../components/chat/ChatBox";

export default function SupportChat() {
  const [selectedTopic, setSelectedTopic] = useState("");

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4">
      <div
        className="
          w-full max-w-[1000px]
          flex flex-col lg:flex-row
          gap-8 lg:gap-12
          mb-10
        "
      >
        <QuickTopics onSelect={setSelectedTopic} />
        <AboutChat />
      </div>

      <ChatBox externalMessage={selectedTopic} />

    </div>
  );
}