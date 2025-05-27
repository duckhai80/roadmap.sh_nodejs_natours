import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  await axios({
    method: 'POST',
    url: '/api/v1/users/login',
    data: {
      email,
      password,
    },
  })
    .then((res) => {
      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!');

        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    })
    .catch((err) => {
      showAlert('error', err.response.data.message);
    });
};

export const logout = async () => {
  await axios({
    method: 'GET',
    url: '/api/v1/users/logout',
  })
    .then((res) => {
      if (res.data.status === 'success') location.reload(true);
    })
    .catch((err) => {
      showAlert('error', 'Error logging out! Please try again!');
    });
};
