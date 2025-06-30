// firestore-helpers.js
// Helper functions for Firestore CRUD for journals and to-dos

// Get current user UID (assumes user is logged in)
function getCurrentUserId() {
  const user = firebase.auth().currentUser;
  return user ? user.uid : null;
}

// --- JOURNALS ---
async function saveJournalToFirestore(journal) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  const docRef = await firebase.firestore()
    .collection('users').doc(uid)
    .collection('journals').add(journal);
  return docRef.id;
}

async function getJournalsFromFirestore() {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  const snapshot = await firebase.firestore()
    .collection('users').doc(uid)
    .collection('journals').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function deleteJournalFromFirestore(journalId) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  await firebase.firestore()
    .collection('users').doc(uid)
    .collection('journals').doc(journalId).delete();
}

// --- TO-DOs ---
async function saveToDoListToFirestore(tasks) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  const docRef = await firebase.firestore()
    .collection('users').doc(uid)
    .collection('todos').add({ tasks, created: new Date() });
  return docRef.id;
}

async function getToDoListsFromFirestore() {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  const snapshot = await firebase.firestore()
    .collection('users').doc(uid)
    .collection('todos').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateToDoListInFirestore(todoId, tasks) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  await firebase.firestore()
    .collection('users').doc(uid)
    .collection('todos').doc(todoId).update({ tasks });
}

async function deleteToDoListFromFirestore(todoId) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not logged in');
  await firebase.firestore()
    .collection('users').doc(uid)
    .collection('todos').doc(todoId).delete();
}
