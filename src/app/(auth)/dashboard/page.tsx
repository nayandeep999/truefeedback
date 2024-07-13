"use client";

import { MessageCard } from "@/components/message-card";
import QueryPagination from "@/components/query-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastTitle } from "@radix-ui/react-toast";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const MESSAGES_PER_PAGE = 5;

interface UserDashboardProps {
  searchParams: {
    page?: string;
  };
}

function UserDashboard({ searchParams }: UserDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);

  const { toast } = useToast();
  const { data: session } = useSession();
  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (
        axiosError.response?.data.message === "Currently there are no messages"
      ) {
        // Return early without showing a toast
        return;
      } else {
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;
  const profileUrl = `${window.location.protocol}//${window.location.host}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);
  const displayMessages = messages.slice(
    MESSAGES_PER_PAGE * (currentPage - 1),
    MESSAGES_PER_PAGE * currentPage
  );

  return (
    <div className="container flex flex-col min-h-screen max-w-7xl mt-3 py-3">
      <div className="md:flex md:space-x-6 ">
        <div className="w-full md:max-w-md h-auto mb-8">
          {isLoading ? (
            <>
              <Card className="w-full mb-5">
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-[30px] w-[190px] mb-2" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-2">
                  <Skeleton className="h-[25px] w-full" />
                </CardContent>
                <CardContent className="flex items-center gap-3">
                  <Skeleton className="h-[25px] w-[200px]" />
                </CardContent>
              </Card>
              <Card className="w-full mb-5">
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-[25px] w-[240px] mb-2" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[25px] w-[100px]" />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="w-full mb-5">
                <CardHeader>
                  <CardTitle>Your profile link</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full p-2 rounded-lg"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="max-w-fit"
                    variant={"outline"}
                  >
                    Copy
                  </Button>
                </CardContent>
                <CardContent className="flex items-center gap-3">
                  <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                  />
                  <span>Accept Messages - {acceptMessages ? "On" : "Off"}</span>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-balance">
                    Total feedbacks received
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-semibold text-xl">
                  {messages.length}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="mt-4 md:mt-0 md:flex-1">
          {isLoading ? (
            <>
              <Skeleton className="h-[30px] w-[250px] mb-5" />
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-[20px] w-full mb-3" />
                  <Skeleton className="h-[20px] w-full mb-8" />
                </div>
              ))}
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-2">Feedbacks</h3>
              {messages.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {displayMessages.map((message) => (
                    <MessageCard
                      key={message._id as string}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <p>No messages to display.</p>
              )}
              <QueryPagination
                totalPages={totalPages}
                className="justify-end mt-4"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
