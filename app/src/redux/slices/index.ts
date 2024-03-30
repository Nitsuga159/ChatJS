import { reducer as user } from "./user";
import { reducer as friend } from "./friend";
import { reducer as channel } from "./channel";
import { reducer as notifications } from "./notifications";
import { reducer as general } from "./general";
import { reducer as scrollItems } from "./scrollItems";

export default {
  user,
  friend,
  channel,
  notifications,
  general,
  scrollItems
};
