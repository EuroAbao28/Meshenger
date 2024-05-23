import axios from "axios";
import { useState } from "react";
import { userRoute } from "../utils/APIRoutes";

const useGetUserToChat = () => {
  const [isGetUserToChatLoading, setIsGetUserToChatLoading] = useState(true);

  const getUserToChatFuntion = async (id) => {
    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(`${userRoute}/getuserToChat/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsGetUserToChatLoading(false);
      return response;
    } catch (error) {
      setIsGetUserToChatLoading(false);
      throw error.response.data.message;
    }
  };

  return {
    getUserToChatFuntion,
    isGetUserToChatLoading,
    setIsGetUserToChatLoading,
  };
};

export default useGetUserToChat;
