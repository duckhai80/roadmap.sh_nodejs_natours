export const hideAlert = () => {
  const element = document.querySelector('.alert');

  if (element) element.parentElement.removeChild(element);
};

export const showAlert = (type, message, timeout = 5) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${message}</div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, timeout * 1000);
};
