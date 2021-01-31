import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../logo.svg';
import * as auth from '../api/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';

export const Header = () => {
  const history = useHistory();
  const { user } = useSelector((state: RootState) => state.user);

  const onClick = async () => {
    await auth.logout();
    history.push('/');
  };

  return (
    <header>
      {!!user && (
        <span onClick={() => onClick()}>
          Logout
        </span>
      )}
    </header>
  );
};
