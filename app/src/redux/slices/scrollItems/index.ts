import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { InitialStateScrollItems, ScrollItems } from "./type";
import { DirectionRequest } from "@/redux/actions/channel/type";
import ENVS from "@/envs";

const initialState: InitialStateScrollItems = {};

const scrollItemsSlice = createSlice({
  name: "scrollItems",
  initialState,
  reducers: {
    set(
      state: InitialStateScrollItems, 
      action: PayloadAction<{ id: string, items: any[], direction: DirectionRequest, continueFetchingUp: boolean, continueFetchingDown: boolean, maxItems?: number, maxVirtualItems?: number }>
    ) {
      if(!state[action.payload.id]) {
        state[action.payload.id] = { 
          items: [], 
          maxItems: action.payload.maxItems || 50, 
          maxVirtualItems: action.payload.maxVirtualItems || 50, 
          continueFetchingDown: false, 
          continueFetchingUp: false, 
          identifierItemKey: ENVS.KEY_ID, 
          lastScrollStop: 0, 
          virtualItems: [] 
        }
      }
      
      const scrollItems = state[action.payload.id]

      const isExcededItems = scrollItems?.items.length + action.payload.items.length > scrollItems.maxItems
      const isDown = action.payload.direction === DirectionRequest.DOWN

      scrollItems.items = 
            isDown ? 
            [...scrollItems.items, ...action.payload.items] : [...action.payload.items, ...scrollItems.items]

      if(isExcededItems) {
        scrollItems.items = 
            !isDown ? 
            scrollItems.items.slice(0, scrollItems.maxItems) : scrollItems.items.slice(-scrollItems.maxItems)
      }

      if(isDown && isExcededItems) {
        scrollItems.continueFetchingDown = action.payload.continueFetchingDown
        scrollItems.continueFetchingUp = true
      } else if(!isDown && isExcededItems) {
        scrollItems.continueFetchingDown = true
        scrollItems.continueFetchingUp = action.payload.continueFetchingUp
      } else {
        scrollItems.continueFetchingDown = isDown ? action.payload.continueFetchingDown : scrollItems.continueFetchingDown
        scrollItems.continueFetchingUp = !isDown ? action.payload.continueFetchingUp : scrollItems.continueFetchingUp
      }


    },
    add(
      state: InitialStateScrollItems, 
      action: PayloadAction<{ id: string, item: any, direction: DirectionRequest }>
    ) {
      if(!state[action.payload.id]) return;

      const scrollItems = state[action.payload.id]

      if(action.payload.direction === DirectionRequest.DOWN && !scrollItems.continueFetchingDown) {
        scrollItems.items.push(action.payload.item)

        if(scrollItems.items.length > scrollItems.maxItems) {
          scrollItems.continueFetchingUp = true
          scrollItems.items = scrollItems.items.slice(-scrollItems.maxItems)
        }
      } else if(action.payload.direction === DirectionRequest.UP && !scrollItems.continueFetchingUp) {
        scrollItems.items.unshift(action.payload.item)
        
        if(scrollItems.items.length > scrollItems.maxItems) {
          scrollItems.continueFetchingDown = true
          scrollItems.items = scrollItems.items.slice(0, scrollItems.maxItems)
        }
      }
    },
    removeOne(
      state: InitialStateScrollItems, 
      action: PayloadAction<{ id: string, keyId: string, valueId: any }>
    ) {
      let { id, keyId, valueId } = action.payload
      const scrollItems = state[id]

      if(!scrollItems) return;

      const { items } = scrollItems

      const index = items.findIndex(item => item[keyId] === valueId)

      if(index === -1) return;

      scrollItems.items = [...items.slice(0, index), ...items.slice(index + 1)]
    },
    removeMany(
      state: InitialStateScrollItems, 
      action: PayloadAction<{ id: string, valueIds: any[] }>
    ) {
      const { id, valueIds } = action.payload
      const scrollItems = state[id]

      if(!scrollItems) return;

      scrollItems.items = scrollItems.items.filter(item => !valueIds.includes(item[ENVS.KEY_ID]))
    }
  },
});

export const getScrollItems = (state: RootState) => state.scrollItems;

export const { actions, reducer } = scrollItemsSlice;