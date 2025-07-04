// import '@babel/polyfill';
import { login, logout, signup } from './login';
import { displayMap } from './maptiler';
import { bookTour } from './stripe';
import { updateSettings } from './updateSettings';
import { showAlert } from './alert';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form:not(.signup-form) .form');
const signupForm = document.querySelector('.signup-form .form');
const logoutBtn = document.querySelector('.nav__el.nav__el--logout');
const userDataForm = document.querySelector('.form.form-user-data');
const userPasswordForm = document.querySelector('.form.form-user-password');
const bookTourBtn = document.getElementById('book-tour-btn');
const messageAlert = document.querySelector('body').dataset.alert;

if (messageAlert) showAlert('success', messageAlert, 5);

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(e)(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(e)(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', (e) => logout(e));

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();
    const name = userDataForm.name.value;
    const email = userDataForm.email.value;
    const photo = userDataForm.photo.files[0];

    formData.append('name', name);
    formData.append('email', email);
    formData.append('photo', photo);

    updateSettings(e)(formData, 'data');
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

    await updateSettings(e)(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    savePasswordBtn.textContent = 'Save password';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';

    const tourId = bookTourBtn.dataset.tourId;
    // const tourId = e.target.dataset.tourId;

    bookTour(tourId);
  });
}
