"use client";

import React, { FC, useState } from "react";
import Button from "./UI/Button";
import { addFriendValidator } from "@/lib/validators/add-friend";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type AddFriendFormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AddFriendFormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const [friendReqSentSuccessfully, setFriendReqSentSuccessfully] =
    useState<boolean>(false);

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });
      setFriendReqSentSuccessfully(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error?.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error?.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  };

  const onSubmit = (data: AddFriendFormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-green-900"
      >
        Add friend by E-mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-grey-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@exaxmple.com"
        />
        <Button>Add</Button>
      </div>
      <p
        className={`mt-1 text-sm ${
          friendReqSentSuccessfully ? "text-green-600" : "text-red-600"
        }`}
      >
        {friendReqSentSuccessfully
          ? "Friend request sent succesfully"
          : errors.email?.message}
      </p>
    </form>
  );
};

export default AddFriendButton;
