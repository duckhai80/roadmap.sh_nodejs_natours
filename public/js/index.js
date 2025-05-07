// import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './maptiler';
import { updateUserData } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form .form');
const logoutBtn = document.querySelector('.nav__el.nav__el--logout');
const updateUserDataForm = document.querySelector('.form.form-user-data');

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

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = updateUserDataForm.name.value;
    const email = updateUserDataForm.email.value;

    updateUserData(name, email);
  });
}
