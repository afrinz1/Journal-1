// signup.js
// Firebase email/password signup integration

document.getElementById('signupForm').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const errorDiv = document.getElementById('signupError');

  if (!username || !email || !password) {
    errorDiv.textContent = 'All fields are required.';
    return;
  }
  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters.';
    return;
  }

  // Firebase Auth signup
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    // Optionally, set displayName
    await userCredential.user.updateProfile({ displayName: username });
    errorDiv.style.color = '#228B22';
    errorDiv.textContent = 'Signup successful! Redirecting...';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  } catch (error) {
    errorDiv.style.color = '#b00';
    errorDiv.textContent = error.message.replace('Firebase:', '').trim();
  }
};
