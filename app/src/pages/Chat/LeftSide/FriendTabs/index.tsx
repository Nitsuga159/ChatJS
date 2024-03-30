import { getFriendState } from "@/redux/slices/friend";
import { useDispatch, useSelector } from "react-redux";
import { FriendTabContainer, FriendTabPhotoContainer, FriendTabUsername, FriendTabsContainer, Username } from "./FriendTabs.styled";
import { friendActions, friendFetchs } from "@/redux/actions/friend";
import { getUserState } from "@/redux/slices/user";
import { AppDispatch } from "@/redux/store";
import { failureNotification } from "@/helpers/notify";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useCallback, useState } from "react";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";
import { Friend } from "@/redux/slices/friend/type";

export default function FriendTabs() {
  const dispatch: AppDispatch = useDispatch();
  const { friends } = useSelector(getFriendState);
  const accessToken = useSelector(getUserState).user!.accessToken;

  const getFriends = useCallback(async (time: TimeRequest, to: DirectionRequest) => {
    try {
      const { results } = await friendFetchs.getFriends({
        query: {
          lastId: time ? friends.at(time === TimeRequest.AFTER ? -1 : 0)?._id || null : null,
          to,
          time
        },
        accessToken: accessToken
      })

      return { continue: results.continue, newItems: results.friends }
    } catch (e: any) {
      console.log("error friend get", e)
      failureNotification(e.response.data.message);
    }
  }, [friends]);

  const renderFriendTab = (friendItem: Friend) => {
    const { friend, _id, messagesCount } = friendItem;

    return (
        <FriendTabContainer key={_id} onClick={() => dispatch(friendActions.setCurrentChatId(_id))}>
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
    // <FriendTabsContainer
    //   renderItem={renderFriendTab}
    //   fetchItems={getFriends}
    //   updateItems={(data: any[]) => dispatch(friendActions.getFriends(data))}
    //   settings={settings}
    //   setSettings={setSettings}
    //   items={friends}
    //   limit={30}
    //   loading={<FriendTabSkeleton cuantity={8} reverse />}
    // />
    <></>
  )
}

