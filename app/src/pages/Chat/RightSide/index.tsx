import { useState } from 'react';
import * as S from './RightSide.styled';
import SearchUser from './SearchUser';
import { TbBellFilled, TbBellRingingFilled } from "react-icons/tb";
import { BsSearch } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import Notification from './Notifications';

enum Section {
  SEARCH_USER,
  NOTIFICATIONS,
  USERS
};

export default function RightSide() {
  const [section, setSection] = useState<Section>(Section.SEARCH_USER);

  return (
    <S.Container>
      <S.NavBarSection>
        <S.ItemSection
          isActive={section === Section.SEARCH_USER}
          onClick={() => setSection(Section.SEARCH_USER)}
        >
          <BsSearch />
        </S.ItemSection>
        <S.ItemSection
          isActive={section === Section.NOTIFICATIONS}
          onClick={() => setSection(Section.NOTIFICATIONS)}
        >
          {true ? <TbBellRingingFilled /> : <TbBellFilled />}
        </S.ItemSection>
        <S.ItemSection
          isActive={section === Section.USERS}
          onClick={() => setSection(Section.USERS)}
        >
          <FaUserAlt />
        </S.ItemSection>
      </S.NavBarSection>
      {
        section === Section.SEARCH_USER ? <SearchUser /> :
        section === Section.NOTIFICATIONS ? <Notification />
          : <h1>nada</h1>
      }
    </S.Container>
  );
}