import crudRepository from "./crudRepository.js";
import Message from "../schema/message.js"

const messageReposiyry = {
   ...crudRepository(Message),
   getPaginatedMessaged :async (messageParam, limit ,page) => {
  const mesaage = await Message.find(messageParam)
    .sort({createdAt : -1})
    .skip((page -1) * limit)
    .limit(limit)
    .populate("senderId", "username email avatar");

    return mesaage;
}
}


export default messageReposiyry