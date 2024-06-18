import axios from "axios";
import { useState } from "react";
import { userRoute } from "../utils/APIRoutes";

const useUpdateUser = () => {
  const [isUserUpdateLoading, setIsUserUpdateLoading] = useState(false);

  const updateUserFunciton = async (userData) => {
    setIsUserUpdateLoading(true);

    try {
      const userToken = localStorage.getItem("userToken");

      const formData = new FormData();

      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);
      formData.append("username", userData.username);
      formData.append("userImage", userData.userImage);

      const response = await axios.patch(userRoute, formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setIsUserUpdateLoading(false);
      return response;
    } catch (error) {
      setIsUserUpdateLoading(false);
      throw error.response.data.message;
    }
  };

  return { updateUserFunciton, isUserUpdateLoading };
};

export default useUpdateUser;
