import API from "./api";

const ChatService = {
  fetchChats: () => {
    console.log("Chat.js chatactions fetchChats");
    return API.get("/chats/index")
      .then(({ data }) => {
        console.log("chat Service data", data);
        return data;
      })
      .catch((err) => {
        console.log("chat Service err", err);

        throw err;
      });
  },
};

export default ChatService;
