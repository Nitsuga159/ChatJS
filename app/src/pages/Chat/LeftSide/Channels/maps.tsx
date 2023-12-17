import ItemSelection from "@/components/ItemSelection";
import { SimpleChannel } from "@/redux/slices/channel/type";
import { PerfilImageItem, PerfilLetterItem } from "./Channels.styled";
import VirtualizedItem from "@/components/VirtualizedItem";

export const mapChannelItem =
  (onClick: (_id: string) => void, array: any[]) =>
    (index: number) => {
      const { name, photo, _id } = array[index] as SimpleChannel

      return (
        <VirtualizedItem key={_id}>
          <ItemSelection
            name={name}
            onClick={() => onClick(_id)}
          >
            {
              photo ?
                <PerfilImageItem src={photo} /> :
                <PerfilLetterItem>{name[0].toUpperCase()}</PerfilLetterItem>
            }
          </ItemSelection>
        </VirtualizedItem>
      )
    };