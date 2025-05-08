// import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './maptiler';
import { updateSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form .form');
const logoutBtn = document.querySelector('.nav__el.nav__el--logout');
const userDataForm = document.querySelector('.form.form-user-data');
const userPasswordForm = document.querySelector('.form.form-user-password');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    console.log('KHAIII');
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = userDataForm.name.value;
    const email = userDataForm.email.value;

    updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const savePasswordBtn = document.querySelector('.btn--save-password');
    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    savePasswordBtn.textContent = 'Updating...';

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    savePasswordBtn.textContent = 'Save password';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });
}
