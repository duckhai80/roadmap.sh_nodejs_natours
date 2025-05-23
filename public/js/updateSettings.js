import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? '/api/v1/users/updatePassword'
      : '/api/v1/users/updateMe';

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
    });
};
