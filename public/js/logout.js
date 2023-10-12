const logout = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/users/logout', {
      method: 'GET',
    });
    const data = await res.json();
    console.log('Logout', data);

    if (data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Logging out failed. Please try again.'); // Catch any other errors and show a generic message
  }
};

const logoutbtn = document.querySelector('.nav__el--logout');
if (logoutbtn) {
  logoutbtn.addEventListener('click', logout);
}
