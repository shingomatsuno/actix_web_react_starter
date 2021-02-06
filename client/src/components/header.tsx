import React from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../logo.svg";
import * as auth from "../api/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { useDispatch } from "react-redux";
import { setUser } from "../store/modules/userModule";

export const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state: RootState) => state.user);

  console.log(user);

  const onClick = async () => {
    await auth.logout();
    dispatch(setUser(null));
    history.push("/");
  };

  return (
    <header>{!!user && <span onClick={() => onClick()}>Logout</span>}</header>
  );
};
