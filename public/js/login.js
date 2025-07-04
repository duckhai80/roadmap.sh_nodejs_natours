import axios from 'axios';
import { showAlert } from './alert';

export const signup =
  (event) => async (name, email, password, passwordConfirm) => {
    event.target.querySelector('button').disabled = true;

    await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role: 'user',
      },
    })
      .then((res) => {
        if (res.data.status === 'success') {
          showAlert('success', 'Signed up successfully!');

          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
        }
      })
      .catch((err) => {
        showAlert('error', err.response.data.message);

        event.target.querySelector('button').disabled = false;
      });
  };

export const login = (event) => async (email, password) => {
  // event.target.querySelector('button').disabled = true;

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

      // event.target.querySelector('button').disabled = false;
    });
};

export const logout = async (event) => {
  event.target.style.setProperty('pointer-events', 'none');

  await axios({
    method: 'GET',
    url: '/api/v1/users/logout',
  })
    .then((res) => {
      if (res.data.status === 'success') location.reload(true);
    })
    .catch((err) => {
      showAlert('error', 'Error logging out! Please try again!');

      event.target.style.setProperty('pointer-events', 'auto');
    });
};
