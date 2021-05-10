import { combineReducers } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { useSelector, TypedUseSelectorHook } from "react-redux";

import { profileSlice, updatedUserSlice, userSlice } from "./userSlice";
// import appReducer from './app';
// import { authSlice } from './authSlice';
// import * as utils from '../utils';
import { problemNextSlice, problemSlice, problemsSlice } from "./problemSlice";
import { kifuSlice, kifusSlice } from "./kifuSlice";
import { uiSlice } from "./uiSlice";
import { tagsSlice } from "./tagSlice";
import { viewedKifusSlice, viewedProblemsSlice } from "./viewedSlice";
import { playersSlice } from "./playerSlice";
import { authSlice, signUpSlice } from "./authSlice";
import {
  openSignInSlice,
  openSignUpSlice,
  openCommentsSlice,
  openUserMenuSlice,
} from "./genericSlice";

// export * from './authSlice';
export * from "./problemSlice";
export * from "./kifuSlice";
export * from "./uiSlice";
export * from "./tagSlice";
export * from "./playerSlice";
export * from "./genericSlice";
export * from "./authSlice";
export * from "./viewedSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  updatedUser: updatedUserSlice.reducer,
  auth: authSlice.reducer,
  signup: signUpSlice.reducer,
  profile: profileSlice.reducer,
  problems: problemsSlice.reducer,
  problem: reduceReducers<any>(
    {},
    problemSlice.reducer,
    problemNextSlice.reducer
  ),
  kifus: kifusSlice.reducer,
  kifu: kifuSlice.reducer,
  players: playersSlice.reducer,
  tags: tagsSlice.reducer,
  viewedProblems: viewedProblemsSlice.reducer,
  viewedKifus: viewedProblemsSlice.reducer,
  ui: uiSlice.reducer,
  openSignIn: openSignInSlice.reducer,
  openSignUp: openSignUpSlice.reducer,
  openComments: openCommentsSlice.reducer,
  openUserMenu: openUserMenuSlice.reducer,
});

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
