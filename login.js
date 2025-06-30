// login.js
// Firebase email/password login integration
document.getElementById('loginForm').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const username = form.username.value.trim(); // Not used for Firebase login
  const password = form.password.value;
  const errorDiv = document.getElementById('loginError');

  // For Firebase, login is by email, but your form uses username.
  // We'll fetch all users and find the email for the given username.
  // In production, you should use email directly.
  try {
    // Get all users from Firestore or require user to enter email instead of username.
    // For now, try to login with username as email (if you want username, you need to map username to email in Firestore)
    // We'll try login as if username is email:
    const userCredential = await firebase.auth().signInWithEmailAndPassword(username, password);
    errorDiv.style.color = '#228B22';
    errorDiv.textContent = 'Login successful! Redirecting...';
    // Optionally, store user info in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    }));
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  } catch (error) {
    errorDiv.style.color = '#b00';
    errorDiv.textContent = error.message.replace('Firebase:', '').trim();
  }
};
