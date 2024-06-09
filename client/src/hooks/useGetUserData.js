import axios from "axios";
import { useState } from "react";
import { userRoute } from "../utils/APIRoutes";
import { useUserContext } from "../context/UserContextProvider";

const useGetUserData = () => {
  const { setUser } = useUserContext();
  const [isGetUserDataLoading, setISGetUserDataLoading] = useState(true);

  const getUserDataFunction = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      const response = await axios.get(`${userRoute}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      // console.log(response.data.user);
      setUser(response.data.user);

      setISGetUserDataLoading(false);
    } catch (error) {
      setISGetUserDataLoading(false);
      throw error.response.data.message;
    }
  };
  return { getUserDataFunction, isGetUserDataLoading };
};

export default useGetUserData;
