import LogoIcon from '@/components/Svg/LogoIcon/LogoIcon';
import s from './Message.module.css';

export default function Message(
  { text, name, color }:
    { text: string, name: string, color: string }
) {
  return (
    <div className={s.message}>
      <LogoIcon className={s.icon} color={color} />
      <div>
        <h5 className={s.title} style={{ color }}>{name}</h5>
        <p className={s.text}>{text}</p>
      </div>
    </div>
  );
}