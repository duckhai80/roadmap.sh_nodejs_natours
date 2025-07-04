import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = (event) => async (data, type) => {
  const url =
    type === 'password'
      ? '/api/v1/users/updatePassword'
      : '/api/v1/users/updateMe';

  event.target.querySelector('button').disabled = true;

  await axios({
    method: 'PATCH',
    url,
    data,
  })
    .then((res) => {
      if (res.data.status === 'success') {
        showAlert('success', `${type.toUpperCase()} updated successfully!`);
      }
    })
    .catch((err) => {
      showAlert('error', err.response.data.message);
    })
    .finally(() => {
      event.target.querySelector('button').disabled = false;
    });
};
