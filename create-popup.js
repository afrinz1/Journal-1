// create-popup.js
// Simple popup for icon1

window.addEventListener('DOMContentLoaded', function() {
  const icons = document.querySelectorAll('.icon-img');
  if (!icons[0]) return;
  icons[0].addEventListener('click', function() {
    // Remove existing popup if any
    const existing = document.getElementById('create-popup');
    if (existing) existing.remove();
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'create-popup';
    popup.className = 'create-popup-bg';

    popup.innerHTML = `
      <div class="create-popup-content">
        <div class="create-popup-window-bar">
          <button class="create-popup-close">×</button>
        </div>
        <div class="create-popup-main">
          <div class="create-popup-title">Create Journal</div>
          <input class="create-popup-input" type="text" placeholder="Enter journal name" />
          <button class="create-popup-btn">CREATE</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    popup.querySelector('.create-popup-close').onclick = () => popup.remove();

    popup.querySelector('.create-popup-btn').onclick = () => {
      const input = popup.querySelector('.create-popup-input');
      const journalName = input.value.trim();
      if (journalName) {
        // Save journal name in session (optional, not needed for Firestore)
        // localStorage.setItem('currentJournalName', journalName); // REMOVE
        popup.remove();
        window.open('journal-popup/journal1.html', '_blank');
      } else {
        input.focus();
      }
    };
  });
});

window.addEventListener('DOMContentLoaded', function() {
  const icons = document.querySelectorAll('.icon-img');
  if (!icons[0]) return;
  icons[0].addEventListener('click', function() {
    // Remove existing popup if any
    const existing = document.getElementById('create-popup');
    if (existing) existing.remove();

    // Create popup
    const popup = document.createElement('div');
    popup.id = 'create-popup';
    popup.className = 'create-popup-bg';
    popup.innerHTML = `
      <div class="create-popup-content">
        <div class="create-popup-window-bar">
          <div class="circle"></div>
          <div class="circle"></div>
          <button class="create-popup-close">×</button>
        </div>
        <div class="create-popup-main">
          <h2 class="create-popup-title">GIVE TODAYS JOURNAL A NAME !!</h2>
          <input class="create-popup-input" type="text" placeholder="________________">
          <button class="create-popup-btn">CREATE</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    // Close handlers
    popup.querySelector('.create-popup-close').onclick = () => popup.remove();
    popup.onclick = (e) => { if (e.target === popup) popup.remove(); };

    // Make popup movable
    makePopupMovable(popup.querySelector('.create-popup-content'), popup.querySelector('.create-popup-window-bar'));

    // Create journal popup on CREATE
    const createBtn = popup.querySelector('.create-popup-btn');
    createBtn.onclick = function() {
      // Remove any existing journal popup
      const existingJournal = document.getElementById('journal-popup');
      if (existingJournal) existingJournal.remove();
      // Create journal popup
      const journalPopup = document.createElement('div');
      journalPopup.id = 'journal-popup';
      journalPopup.className = 'create-popup-bg';
      journalPopup.innerHTML = `
        <div class="window" style="width:90vw;max-width:600px;height:90vh;background:#f8f6f2;border-radius:10px;border:1.5px solid #000;display:flex;flex-direction:column;">
          <div class="header" style="background:#eac1a2;padding:10px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #000;font-weight:bold;letter-spacing:1px;font-size:14px;cursor:move;">
            <span class="day">MONDAY</span>
            <span class="date">6 - 27 - 25</span>
            <span class="close" style="cursor:pointer;margin-left:auto;margin-right:10px;">✕</span>
          </div>
          <div class="content" style="padding:15px;flex-grow:1;display:flex;flex-direction:column;border-radius:10px;margin:10px;border:1px solid #000;background:#f8f6f2;position:relative;">
            <div class="title" style="font-size:14px;font-weight:bold;margin-bottom:10px;">welcome to “your” personal journal.</div>
            <textarea class="journal-text" placeholder="Write here..." style="flex-grow:1;border:none;outline:none;resize:none;font-size:14px;line-height:30px;background:#f8f6f2;border-top:1px solid #ccc;border-bottom:1px solid #ccc;width:100%;height:80%;font-family:Arial,sans-serif;padding:0;margin:0;box-sizing:border-box;"></textarea>
            <button class="save-btn" style="position:absolute;bottom:15px;right:15px;background:#eac1a2;border:1px solid #000;border-radius:6px;padding:8px 15px;cursor:pointer;font-size:12px;letter-spacing:1px;">SAVE</button>
          </div>
        </div>
      `;
      document.body.appendChild(journalPopup);
      // Close handler for journal popup
      journalPopup.querySelector('.close').onclick = () => journalPopup.remove();
      journalPopup.onclick = (e) => { if (e.target === journalPopup) journalPopup.remove(); };
      // Make journal popup movable
      makePopupMovable(journalPopup.querySelector('.window'), journalPopup.querySelector('.header'));
      // Add SAVE button logic
      const saveBtn = journalPopup.querySelector('.save-btn');
      saveBtn.onclick = async function() {
        const text = journalPopup.querySelector('.journal-text').value.trim();
        const date = journalPopup.querySelector('.date').textContent;
        const day = journalPopup.querySelector('.day').textContent;
        const createPopupInput = document.querySelector('.create-popup-input');
        const journalName = createPopupInput ? createPopupInput.value.trim() : '';
        if (text) {
          // Save journal entry to Firestore
          const entry = { day, date, text, name: journalName };
          try {
            await saveJournalToFirestore(entry);
          } catch (e) {
            alert('Failed to save journal: ' + e.message);
            return;
          }
          journalPopup.remove();
          // Show success popup
          const successPopup = document.createElement('div');
          successPopup.className = 'create-popup-bg';
          successPopup.innerHTML = `
            <div class="create-popup-content" style="min-width:250px;max-width:90vw;">
              <div class="create-popup-window-bar">
                <button class="create-popup-close">×</button>
              </div>
              <div class="create-popup-main" style="text-align:center;">
                <div class="create-popup-title">Journal created successfully!</div>
                <button class="create-popup-btn" style="margin-top:20px;">OK</button>
              </div>
            </div>
          `;
          document.body.appendChild(successPopup);
          successPopup.querySelector('.create-popup-close').onclick = () => successPopup.remove();
          successPopup.querySelector('.create-popup-btn').onclick = () => successPopup.remove();
          successPopup.onclick = (e) => { if (e.target === successPopup) successPopup.remove(); };
        } else {
          journalPopup.querySelector('.journal-text').focus();
        }
      };

      // Movable popup helper
      function makePopupMovable(popupEl, handleEl) {
        let isDragging = false, startX, startY, origX, origY;
        handleEl.style.cursor = 'move';
        handleEl.onmousedown = function(e) {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const rect = popupEl.getBoundingClientRect();
          origX = rect.left;
          origY = rect.top;
          document.body.style.userSelect = 'none';
        };
        document.onmousemove = function(e) {
          if (!isDragging) return;
          let dx = e.clientX - startX;
          let dy = e.clientY - startY;
          popupEl.style.position = 'fixed';
          popupEl.style.left = (origX + dx) + 'px';
          popupEl.style.top = (origY + dy) + 'px';
          popupEl.style.margin = '0';
        };
        document.onmouseup = function() {
          isDragging = false;
          document.body.style.userSelect = '';
        };
      }
    };

    // Movable popup helper
    function makePopupMovable(popupEl, handleEl) {
      let isDragging = false, startX, startY, origX, origY;
      handleEl.style.cursor = 'move';
      handleEl.onmousedown = function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = popupEl.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;
        document.body.style.userSelect = 'none';
      };
      document.onmousemove = function(e) {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        popupEl.style.position = 'fixed';
        popupEl.style.left = (origX + dx) + 'px';
        popupEl.style.top = (origY + dy) + 'px';
        popupEl.style.margin = '0';
      };
      document.onmouseup = function() {
        isDragging = false;
        document.body.style.userSelect = '';
      };
    }
  });
});

// Show all saved journals when clicking OLD JOURNALS here
window.addEventListener('DOMContentLoaded', function() {
  const oldJournalsBtn = document.querySelector('.old-journals-box');
  if (oldJournalsBtn) {
    oldJournalsBtn.style.cursor = 'pointer';
    oldJournalsBtn.onclick = function() {
      if (typeof showJournalListPopup === 'function') {
        showJournalListPopup();
      } else if (window.showJournalListPopup) {
        window.showJournalListPopup();
      } else {
        alert('Could not load journal list popup.');
      }
    };
  }
});

// Include Firebase and Firestore helpers
const script1 = document.createElement('script');
script1.src = 'firebase.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'firestore-helpers.js';
document.head.appendChild(script2);
