import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { Message, messageValidator } from "@/lib/validators/message";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export const POST = async (req: Request) => {
  try {
    const { chatId, text } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2)
      return new Response("Unauthorized", { status: 401 });

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      `smembers`,
      `user:${session.user.id}:friends`
    )) as string[];

    const isfriend = friendList.includes(friendId);

    if (!isfriend) return new Response("Unauthorized", { status: 401 });

    const rawSender = (await fetchRedis(
      `get`,
      `user:${session.user.id}`
    )) as string;

    const sender = JSON.parse(rawSender) as User;

    /** All valid send the message */
    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}:incoming_messages`),
      "incoming_messages",
      messageData
    );

    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      "new_message",
      {
        ...messageData,
        senderImage: sender.image,
        senderName: sender.name,
      }
    );

    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message);
    }

    return new Response("Internal server error", {
      status: 500,
    });
  }
};
