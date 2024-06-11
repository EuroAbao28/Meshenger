import React, { useEffect, useRef, useState } from "react";
import { BsFillEmojiSmileFill, BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import { LuArrowLeft, LuUserX, LuUserPlus } from "react-icons/lu";
import userImage from "../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserToChat from "../hooks/useGetUserToChat";
import toast from "react-hot-toast";
import axios from "axios";
import { messageRoute, roomRoute, userRoute } from "../utils/APIRoutes";
import useGetUserData from "../hooks/useGetUserData";
import classNames from "classnames";
import { socket } from "../components/Layout";
import TimeAgo from "timeago-react";
import useGetMessages from "../hooks/useGetMessages";
import { useUserContext } from "../context/UserContextProvider";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndScroller = useRef(null);
  const { user, setToggleGetLatesMessage, activeUsers } = useUserContext();

  const [userToChat, setUserToChat] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isEmojiShow, setIsEmojiShow] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [isDateShown, setIsdDateShown] = useState("");

  const { getUserDataFunction } = useGetUserData();
  const {
    getUserToChatFuntion,
    isGetUserToChatLoading,
    setIsGetUserToChatLoading,
  } = useGetUserToChat();
  const { getMessagesFunction, isGetMessagesLoading } = useGetMessages();

  // get user to chat
  const handleGetUserToChat = async () => {
    setIsGetUserToChatLoading(true);
    try {
      const response = await getUserToChatFuntion(id);

      setUserToChat(response.data);
      // console.log(response.data);
      socket.emit("leaveRoom", roomId);

      setRoomId("");

      // getRoom
      try {
        const userToken = localStorage.getItem("userToken");
        const getRoom = await axios.post(
          `${roomRoute}/${id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        socket.emit("joinRoom", getRoom.data.roomId);
        setRoomId(getRoom.data.roomId);
      } catch (error) {
        toast.error("Room id not found/created");
        console.log(error);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // leave room
  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomId);
    navigate("/");
  };

  // add user from contact
  const handleAddUser = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.post(
        `${userRoute}/addToContact/${id}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.success(response.data.message);
      getUserDataFunction();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // remove user from contact
  const handleRemoveUser = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
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
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsEmojiShow(false);
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.post(
        `${messageRoute}/${id}`,
        { content: messageInput },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // add the roomId
      const messageData = {
        ...response.data.response,
        roomId,
      };

      // console.log(messageData);

      // emit the sent message
      socket.emit("sendMessage", messageData);
      socket.emit("sendNotif", messageData);

      setMessages((prev) => [...prev, response.data.response]);
      setMessageInput("");
      setIsEmojiShow(false);

      setToggleGetLatesMessage((prev) => prev + 1);

      // set latest chat
    } catch (error) {
      console.log(error);
    }
  };

  // toggle date
  const handleToggleDate = (id) => {
    if (isDateShown === id) {
      setIsdDateShown("");
    } else {
      setIsdDateShown(id);
    }
  };

  // refresh if the id params changes
  useEffect(() => {
    const getMessage = async () => {
      setMessages([]);
      try {
        const response = await getMessagesFunction(id);
        setMessages(response.data);
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    };

    getMessage();
    handleGetUserToChat();
  }, [id]);

  // for receiving message from socket.io
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);

      setToggleGetLatesMessage((prev) => prev + 1);
    });
  }, []);

  // auto scroller
  useEffect(() => {
    if (messagesEndScroller.current) {
      messagesEndScroller.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, id]);

  // add emoji
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessageInput(messageInput + emoji);
  };

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
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-4 border-slate-100">
            <div className="p-2 rounded-full cursor-pointer hover:bg-slate-100 md:hidden">
              <LuArrowLeft className="text-2xl" onClick={handleLeaveRoom} />
            </div>

            <div className="flex items-center gap-4 mr-auto">
              <div className="relative w-12">
                {activeUsers.includes(userToChat.username) && (
                  <span className="absolute top-0 right-0 w-3 bg-green-500 rounded-full aspect-square"></span>
                )}
                <img
                  src={userImage}
                  alt="user image"
                  className="w-full rounded-full aspect-square"
                />
              </div>
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
                {user.contacts.some((contact) => contact._id === id) ? (
                  <li
                    onClick={handleRemoveUser}
                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-slate-100">
                    <LuUserX />
                    <a>Remove user</a>
                  </li>
                ) : (
                  <li
                    onClick={handleAddUser}
                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-slate-100">
                    <LuUserPlus />
                    <a>Add user</a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* conversations */}
          <div className="flex-1 ">
            <div className="relative w-full h-full overflow-x-hidden overflow-y-auto">
              <div className="absolute inset-0 ">
                {messages &&
                  messages.map((message, index) => (
                    <div
                      ref={messagesEndScroller}
                      key={index}
                      className={classNames("chat px-2", {
                        "chat-start  ": id === message.sender,
                        "chat-end ": id !== message.sender,
                      })}>
                      <div
                        onClick={() => handleToggleDate(message._id)}
                        className={classNames("chat-bubble", {
                          "bg-slate-100 ": id === message.sender,
                          "text-white bg-sky-500 place-self-end":
                            id !== message.sender,
                        })}>
                        {message.content}
                      </div>
                      <div
                        className={classNames(
                          "chat-footer  mt-1 transition-all text-slate-400 overflow-hidden",
                          {
                            "h-0": isDateShown !== message._id,
                            "h-5": isDateShown === message._id,
                          }
                        )}>
                        <TimeAgo datetime={message.createdAt} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* user input */}
          <div className="border-t-4 border-slate-100">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-4 p-4">
              <div className="relative p-2 text-2xl rounded-full hover:bg-slate-100 text-slate-500">
                <div onClick={() => setIsEmojiShow(!isEmojiShow)}>
                  <BsFillEmojiSmileFill />
                </div>
                {isEmojiShow && (
                  <div className="absolute left-0 z-10 bottom-10">
                    <Picker data={data} onEmojiSelect={addEmoji} />
                  </div>
                )}
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
