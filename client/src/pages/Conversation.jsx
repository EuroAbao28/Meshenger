import React, { useEffect, useRef, useState } from "react";
import { BsFillEmojiSmileFill, BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import { LuArrowLeft, LuUserX, LuBan } from "react-icons/lu";
import userImage from "../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserToChat from "../hooks/useGetUserToChat";
import toast from "react-hot-toast";
import axios from "axios";
import { messageRoute, userRoute } from "../utils/APIRoutes";
import useGetUserData from "../hooks/useGetUserData";
import classNames from "classnames";
import { useUserContext } from "../context/UserContextProvider";

const userToken = localStorage.getItem("userToken");

function Conversation() {
  const navigate = useNavigate();
  const messagesEndScroller = useRef(null);
  const { id } = useParams();
  const { user } = useUserContext();

  const [userToChat, setUserToChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const { getUserDataFunction } = useGetUserData();

  const {
    getUserToChatFuntion,
    isGetUserToChatLoading,
    setIsGetUserToChatLoading,
  } = useGetUserToChat();

  // get user to chat
  const handleGetUserToChat = async () => {
    setIsGetUserToChatLoading(true);
    try {
      const response = await getUserToChatFuntion(id);

      setUserToChat(response.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // remove user from contact
  const handleRemoveUser = async () => {
    try {
      const response = await axios.delete(
        `${userRoute}/removeFromContact/${id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast.success(response.data.message);
      getUserDataFunction();
      navigate("/");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // get messages
  const handleGetMessages = async () => {
    try {
      const response = await axios.get(`${messageRoute}/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setMessages(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${messageRoute}/${id}`,
        { content: messageInput },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const newMessage = {
        content: messageInput,
        sender: user._id,
        receiver: id,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.log(error);
    }
  };

  // messages refresh
  useEffect(() => {}, []);

  // initial mount of this component
  useEffect(() => {
    handleGetUserToChat();
    handleGetMessages();
  }, [id]);

  // auto scroller
  useEffect(() => {
    if (messagesEndScroller.current) {
      messagesEndScroller.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="z-10 flex flex-col w-full h-full bg-white md:rounded-lg">
      {isGetUserToChatLoading ? (
        <div className="flex items-center justify-center flex-1 gap-2 ">
          <span className="loading loading-spinner loading-sm"></span>
          <div className="text-lg">Loading</div>
        </div>
      ) : (
        <>
          {/* header */}
          <div className="flex items-center justify-between gap-2 p-4 border-b-4 border-slate-100">
            <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100 md:hidden">
              <LuArrowLeft className="text-2xl" onClick={() => navigate("/")} />
            </div>

            <div className="flex items-center gap-4 mr-auto">
              <img src={userImage} alt="user" className="w-10" />
              <h3 className="text-lg font-semibold">{`${userToChat.firstname} ${userToChat.lastname}`}</h3>
            </div>

            <div className="dropdown dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="p-2 rounded-full cursor-pointer hover:bg-slate-100">
                <BsThreeDotsVertical className="text-2xl" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1]  p-2 shadow bg-white rounded text-nowrap">
                <li
                  onClick={handleRemoveUser}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-slate-100">
                  <LuUserX />
                  <a>Remove user</a>
                </li>
              </ul>
            </div>
          </div>

          {/* conversations */}
          <div className="flex-1  ">
            <div className="relative w-full h-full  overflow-y-auto">
              <div className="absolute inset-0  ">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={classNames("chat py-1 px-2", {
                      "chat-start  ": id === message.sender,
                      "chat-end text-white": id !== message.sender,
                    })}>
                    <div
                      className={classNames("chat-bubble ", {
                        "bg-slate-100 ": id === message.sender,
                        "text-white bg-sky-500": id !== message.sender,
                      })}>
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndScroller} />
              </div>
            </div>
          </div>

          {/* user input */}
          <div className="border-t-4 border-slate-100">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-4 p-4">
              <div className="text-2xl text-slate-500">
                <BsFillEmojiSmileFill />
              </div>
              <input
                type="text"
                placeholder="Write a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full outline outline-1 focus-within:outline-sky-500 outline-slate-300"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 text-lg text-white rounded-full bg-sky-500 aspect-square">
                <BiSolidSend />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Conversation;
