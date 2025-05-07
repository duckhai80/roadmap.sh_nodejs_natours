import axios from 'axios';
import { showAlert } from './alert';

export const updateUserData = async (name, email) => {
  await axios({
    method: 'PATCH',
    url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
    data: {
      name,
      email,
    },
  })
    .then((res) => {
      if (res.data.status === 'success') {
        showAlert('success', 'Data updated successfully!');
      }
    })
    .catch((err) => {
      showAlert('error', err.response.data.message);
    });
};
