// import axios from 'axios';

const hide = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const show = (type, msg) => {
  hide();
  const markUp = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
  window.setTimeout(hide, 5000);
};
const userDataForm = document.querySelector('.form-user-data');

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    // const photo = document.getElementById('photo').files[0];
    // console.log(photo);
    // updateSettings({ name, email, photo }, 'data');
    updateSettings(form, 'data');
  });
}

const userPasswordForm = document.querySelector('.form-user-settings');

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'UPDATING...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, confirmPassword },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

const updateSettings = async (dataval, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';
    const res = await fetch(url, {
      method: 'PATCH',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      body: dataval,
    });
    const data = await res.json();
    console.log(data);
    if (data.status === 'success') {
      show('success', `${type.toUpperCase()} updated successfully!`);
    } else if (data.status === 'error' && data.message) {
      show('error', data.message); // Display the error message from the server
    } else {
      show('error', 'Update failed. Please try again.'); // Fallback error message
    }
  } catch (err) {
    show('error', 'Update failed. Please try again.'); // Catch any other errors and show a generic message
  }
};
