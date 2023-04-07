import { useState } from "react";
import RegisterForm from "./RegisterForm/RegisterForm";
import LoginForm from "./LoginForm/LoginForm";
import CodeVerification from "./CodeVerification/CodeVerification";
import LogoIcon from "../Svg/LogoIcon/LogoIcon";
import { UserRegister } from "@/types/user.type";
import { Mode } from "@/types/auth.type";
import s from "./Auth.module.css";

export default function Auth() {
  const [mode, setMode] = useState<Mode>(Mode.LOGIN);
  const [registerData, setRegisterData] = useState<UserRegister>();

  const handleRegisterFormSubmit = (user: UserRegister): void => {
    setRegisterData(user);
    setMode(Mode.CODE_VERIFICATION);
  }

  return (
    <div className={s.container}>
      <div className={s.authContainer}>
        <div className={s.logoContainer}>
          <LogoIcon className={s.icon} color="#FE4056ff" />
          <h3 className={s.titleLogo}>CHAT.JS</h3>
        </div>

        {
          mode === Mode.LOGIN
            ? <LoginForm setMode={setMode} />
            : mode === Mode.REGISTER
              ? <RegisterForm
                handleRegisterFormSubmit={handleRegisterFormSubmit}
                setMode={setMode}
              />
              : <CodeVerification registerData={registerData as UserRegister} />
        }

      </div>
    </div>
  );
}