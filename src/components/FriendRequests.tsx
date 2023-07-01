"use client";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";

interface FriendRequestsProps {
  sessionId: string;
  incomingFriendRequests: IncomingFriendRequest[];
}

const FriendRequests: FC<FriendRequestsProps> = ({
  sessionId,
  incomingFriendRequests,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );
  console.log({ incomingFriendRequests });

  const handleRequest = async (action: "accept" | "deny", senderId: string) => {
    await axios.post(`/api/friends/${action}`, { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
  };

  return (
    <>
      {!friendRequests?.length ? (
        <p className="text-sm text-zinc-500">No friend requests found</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
              onClick={() => handleRequest("accept", request.senderId)}
            >
              <Check className="font-semibold text-white" />
            </button>
            <button
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X
                className="font-semibold text-white"
                onClick={() => handleRequest("deny", request.senderId)}
              />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
