import { useState } from "react";
import { useUserContext } from "../context/UserContextProvider";
import axios from "axios";
import { messageRoute } from "../utils/APIRoutes";

const useGetLatestMessage = () => {
  const { user } = useUserContext();

  const [latestMessage, setLatestMessage] = useState({});
  const [isGetLatestMessageLoading, setIsGetLatestMessageLoading] = useState(1);

  const getLatestMessageFunction = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const newLatestMessages = {};
      for (const contact of user.contacts) {
        const response = await axios.get(
          `${messageRoute}/getLatestMessage/${contact._id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        newLatestMessages[contact._id] = response.data;
      }

      // console.log("GET LATEST MESSAGE", newLatestMessages);
      setLatestMessage(newLatestMessages);
      setIsGetLatestMessageLoading(false);
    } catch (error) {
      console.log(error.response.data);
      setIsGetLatestMessageLoading(false);
      throw error.response.data.message;
    }
  };

  return { getLatestMessageFunction, isGetLatestMessageLoading, latestMessage };
};

export default useGetLatestMessage;
