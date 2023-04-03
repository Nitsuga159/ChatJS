import LogoIcon from '../Svg/LogoIcon/LogoIcon';
import s from './Login.module.css';

export default function Auth() {

  return (
    <div className={s.container}>
      <LogoIcon className={s.icon} color="#dcdcdc" />
    </div>
  );
}