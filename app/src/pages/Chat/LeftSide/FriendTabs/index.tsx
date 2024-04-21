import { useDispatch } from "react-redux";
import { FriendTabContainer, FriendTabPhotoContainer, FriendTabUsername, FriendTabsContainer, Username } from "./FriendTabs.styled";
import { AppDispatch } from "@/redux/store";
import ProfileAvatar from "@/components/ProfileAvatar";
import { DirectionRequest } from "@/redux/actions/channel/type";
import { Friend } from "@/redux/slices/friend/type";
import FriendTabSkeleton from "@/components/Skeletons/FriendTabSkeleton";
import ENVS from "@/envs";
import { GetFriendsAPI } from "@/components/Providers/http/friend-api-interface";
import { actions as friendActions } from "@/redux/slices/friend";

export default function FriendTabs() {
  const dispatch: AppDispatch = useDispatch();

  const renderFriendTab = (friendItem: Friend) => {
    const { friend, _id, messagesCount } = friendItem;

    return (
        <FriendTabContainer key={_id} onClick={() => dispatch(friendActions.setCurrentFriend(friendItem))}>
          <FriendTabPhotoContainer messagesCount={messagesCount}>
            <ProfileAvatar photo={friend.photo} color={friend.color} />
          </FriendTabPhotoContainer>
          <FriendTabUsername>
            <Username color={friend.color}>{friend.username}</Username>
          </FriendTabUsername>
        </FriendTabContainer>
    )
  }


  return (
    <FriendTabsContainer
      renderItem={renderFriendTab}
      api={new GetFriendsAPI({})}
      startFrom={DirectionRequest.DOWN}
      scrollItemsKey={ENVS.FRIEND_TABS_ITEMS_ID}
      loading={<FriendTabSkeleton cuantity={8} reverse />}
    />
  )
}

