"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Message } from "@/lib/validators/message";
import { cn, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  sessionId: string;
  chatId: string;
  sessionImage: string | null | undefined;
  chatPartner: User;
  initialMessages: Message[];
}

const Messages: FC<MessagesProps> = ({
  sessionId,
  chatId,
  sessionImage,
  chatPartner,
  initialMessages,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const getFormattedDate = (timestamp: number) => {
    if ((timestamp + "")?.length === 13) {
      const date = new Date(timestamp);
      const timeArray = date.toLocaleTimeString().split(":");
      const timeString = `${timeArray[0]}:${timeArray[1]}`;
      return timeString;
    }
    return "";
  };

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}:incoming_messages`));

    const messagesHandler = (message: Message) => {
      setMessages((prev) => {
        const updatedMessages = [message, ...prev];
        return updatedMessages;
      });
    };
    pusherClient.bind("incoming_messages", messagesHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:incoming_messages`));

      pusherClient.unbind("incoming_messages", messagesHandler);
    };
  }, [chatId]);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index]?.senderId;

        return (
          <div
            key={`${message.id}-${message.timestamp}`}
            className="chat-message"
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end text-gray-200": isCurrentUser,
                    "order-2 items-start text-gray-500": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {getFormattedDate(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  className="rounded-full"
                  src={isCurrentUser ? sessionImage || "" : chatPartner?.image}
                  alt={`${isCurrentUser ? "user" : "partner"} profile picture`}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
