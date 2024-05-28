import axios from "axios";
import { useState } from "react";
import { messageRoute } from "../utils/APIRoutes";

const useGetMessages = () => {
  const [isGetMessagesLoading, setIsGetMessagesLoading] = useState(true);

  const getMessagesFunction = async (id) => {
    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(`${messageRoute}/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setIsGetMessagesLoading(false);
      return response;
    } catch (error) {
      setIsGetMessagesLoading(false);
      throw error.response.data.message;
    }
  };
  return { getMessagesFunction, isGetMessagesLoading };
};

export default useGetMessages;
