import getFriends from "./getFriends";
import getMessages from "./getMessages";
import addFriend from "./addFriend";
import addMessage from "./addMessage";
import resetMessageCount from "./resetMessageCount";
import deleteMessages from "./deleteMessage";
import { actions } from "@/redux/slices/friend";
import addTryCatch from "@/helpers/addTryCatch";

export const friendActions = actions;

const friendFetchs = {
  getFriends,
  getMessages,
  addFriend,
  addMessage,
  resetMessageCount,
  deleteMessages,
};

type FriendFetchsKeys = keyof typeof friendFetchs;

for (let key in friendFetchs)
  friendFetchs[key as FriendFetchsKeys] = addTryCatch(
    friendFetchs[key as FriendFetchsKeys]
  ) as any;

export { friendFetchs };
