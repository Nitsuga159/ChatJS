import ItemSelection from "@/components/ItemSelection";
import { SimpleChannel } from "@/redux/slices/channel/type";
import { PerfilImageItem, PerfilLetterItem } from "./Channels.styled";

export const mapChannelItem =
  (onClick: (_id: string) => void) =>
    (channel: SimpleChannel) => {
      const { name, photo, _id } = channel

      return (
          <ItemSelection
            name={name}
            onClick={() => onClick(_id)}
            key={_id}
            id={_id}
          >
            {
              photo ?
                <PerfilImageItem src={photo} /> :
                <PerfilLetterItem>{name[0]}</PerfilLetterItem>
            }
          </ItemSelection>
      )
    };