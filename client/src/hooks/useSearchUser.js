import { useState } from "react";
import axios from "axios";
import { userRoute } from "../utils/APIRoutes";

const useSearchUser = () => {
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const searchFunction = async (searchInput) => {
    setIsSearchLoading(true);

    try {
      const response = await axios.get(
        `${userRoute}/search?searchInput=${encodeURIComponent(searchInput)}`
      );

      setIsSearchLoading(false);
      return response;
    } catch (error) {
      setIsSearchLoading(false);
      throw error.response.data.message;
    }
  };

  return { searchFunction, isSearchLoading };
};

export default useSearchUser;
