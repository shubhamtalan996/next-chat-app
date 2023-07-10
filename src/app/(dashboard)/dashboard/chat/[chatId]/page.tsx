import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validators/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";

interface pageProps {
  params: {
    chatId: string;
  };
}

const getChatMessages = async (chatId: string) => {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbResult = result.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbResult.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch (error) {
    notFound();
  }
};

const page = async ({ params }: pageProps) => {
  const { chatId } = params;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user: appUser } = session;
  const [user1, user2] = chatId.split("--");

  if (appUser.id !== user1 && appUser.id !== user2) notFound();

  const chatPartnerId = appUser.id === user1 ? user2 : user1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh - 6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center  space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages
        sessionId={session.user.id}
        chatId={chatId}
        sessionImage={session.user.image}
        chatPartner={chatPartner}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;
