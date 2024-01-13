import { getFriendState } from "@/redux/slices/friend";
import { useDispatch, useSelector } from "react-redux";
import { FriendTabContainer, FriendTabPhotoContainer, FriendTabUsername, FriendTabsContainer, Username } from "./FriendTabs.styled";
import { friendActions, friendFetchs } from "@/redux/actions/friend";
import { getUserState } from "@/redux/slices/user";
import { AppDispatch } from "@/redux/store";
import { failureNotification } from "@/helpers/notify";
import FriendTabSkeleton from "@/components/Skeletons/FriendTabSkeleton";
import VirtualizedItem from "@/components/VirtualizedItem";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function FriendTabs() {
  const dispatch: AppDispatch = useDispatch();
  const { friends, continue: canContinue } = useSelector(getFriendState);
  const accessToken = useSelector(getUserState).user!.accessToken;

  const getFriends = async () => {
    try {

      const { results } = await friendFetchs.getFriends({ lastId: null, accessToken });

      dispatch(friendActions.getFriends(results));
    } catch (e: any) {

      failureNotification('Cannot Get Friends');
    }
  }

  const renderFriendTab = (index: number) => {
    const { friend, _id, messagesCount } = friends[index];

    return (
      <VirtualizedItem key={_id}>
        <FriendTabContainer onClick={() => dispatch(friendActions.setCurrentChatId(_id))}>
          <FriendTabPhotoContainer messagesCount={messagesCount}>
            <ProfileAvatar photo={friend.photo} color={friend.color} />
          </FriendTabPhotoContainer>
          <FriendTabUsername>
            <Username color={friend.color}>{friend.username}</Username>
          </FriendTabUsername>
        </FriendTabContainer>
      </VirtualizedItem>
    )
  }


  return (
    <FriendTabsContainer
      itemsLength={friends.length}
      renderItem={renderFriendTab}
      fetchItems={getFriends}
      hasMore={canContinue}
      margin={300}
      loading={<FriendTabSkeleton cuantity={8} reverse />}
    />
  )
}

