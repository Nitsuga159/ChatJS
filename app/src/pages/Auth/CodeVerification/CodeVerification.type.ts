import { Mode } from "@/types/auth.type";
import { UserRegister } from "@/types/user.type";
import { SetStateAction } from "react";

export type CodeVerificationProps = {
  registerData: UserRegister;
  setMode: (value: SetStateAction<Mode>) => void;
};

export type Notify = {
  show: boolean;
  title: string;
  text: string;
  type: "error" | "success" | "normal";
};
