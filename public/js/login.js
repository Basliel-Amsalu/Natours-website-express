// import axios from 'axios';

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markUp = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
  window.setTimeout(hideAlert, 5000);
};

document.querySelector('.form--login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

const login = async (email, password) => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else if (data.status === 'fail' && data.message) {
      showAlert('error', data.message); // Display the error message from the server
    } else {
      showAlert('error', 'Login failed. Please try again.'); // Fallback error message
    }
  } catch (err) {
    showAlert('error', 'Login failed. Please try again.'); // Catch any other errors and show a generic message
  }
};

//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://localhost:3000/api/v1/users/login',
//       data: {
//         email,
//         password,
//       },
//     });

//     if (res.data.status === 'success') {
//       alert('Logged in successfully');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1500);
//     }
//   } catch (err) {
//     alert(err.response.data.message);
//   }
// };
