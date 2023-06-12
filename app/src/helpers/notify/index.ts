import Notify from "./notify";
import { NotifyType } from "./type";

const notify = new Notify();

export const succesNotification = (text: string): void =>
  notify.add(text, NotifyType.SUCCESS);
export const failureNotification = (text: string): void =>
  notify.add(text, NotifyType.FAILURE);
export const warningNotification = (text: string): void =>
  notify.add(text, NotifyType.WARNING);
