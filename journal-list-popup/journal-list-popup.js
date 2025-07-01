// journal-list-popup.js
// Handles showing all saved journals from localStorage in a popup

function showJournalListPopup() {
  // Remove any existing journals popup
  const existing = document.getElementById('journals-list-popup');
  if (existing) existing.remove();
  // Get journals from Firestore (async)
  getJournalsFromFirestore().then(journals => {
    // Create popup background
    const popupBg = document.createElement('div');
    popupBg.className = 'create-popup-bg';
    popupBg.id = 'journals-list-popup';
    popupBg.style.zIndex = 10000;

    // Build journal list buttons
    let journalButtons = '';
    if (journals.length === 0) {
      journalButtons = '<div style="padding:20px;text-align:center;">No journals found.</div>';
    } else {
      journalButtons = journals.map((j, i) =>
        `<div style="display:flex;align-items:center;gap:6px;">
          <button data-id="${j.id}" style="flex:1;">• ${j.name ? j.name : '(No Name)'}</button>
          <button class="delete-journal-btn" data-del-id="${j.id}" title="Delete" style="background:#ffb3b3;border:1px solid #b00;color:#b00;font-size:13px;padding:2px 7px;border-radius:4px;cursor:pointer;">✕</button>
        </div>`
      ).join('');
    }

    // Main popup HTML
    popupBg.innerHTML = `
      <div class="window">
        <div class="top-bar">
          <div class="window-controls">
            <div></div><div></div><div></div>
          </div>
          <div class="top-bar-day">${journals[0]?.day || ''}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="date-section">${journals[0]?.date || ''}</div>
            <button class="journal-popup-close" title="Close">×</button>
          </div>
        </div>
        <div class="header-section">“TAKE A LOOK BACK AT WHAT YOU WHERE”</div>
        <div class="content">
          <div class="journal-list">
            ${journalButtons}
          </div>
          <div class="journal-display">
            ${journals.length > 0 ? `<div class='journal-content'>${journals[0].text ? journals[0].text.replace(/</g, '&lt;') : ''}</div>` : ''}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(popupBg);

    // Close handler
    popupBg.querySelector('.journal-popup-close').onclick = () => popupBg.remove();
    popupBg.onclick = (e) => { if (e.target === popupBg) popupBg.remove(); };

    // Journal switching logic
    if (journals.length > 0) {
      const buttons = popupBg.querySelectorAll('.journal-list button[data-id]');
      const display = popupBg.querySelector('.journal-display');
      const dayDiv = popupBg.querySelector('.top-bar-day');
      const dateDiv = popupBg.querySelector('.date-section');
      buttons.forEach((btn, idx) => {
        btn.onclick = function() {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          display.innerHTML = `<div class='journal-content'>${journals[idx].text ? journals[idx].text.replace(/</g, '&lt;') : ''}</div>`;
          if (dayDiv) dayDiv.textContent = journals[idx].day || '';
          if (dateDiv) dateDiv.textContent = journals[idx].date || '';
        };
      });
      // Set first as active
      if (buttons[0]) buttons[0].classList.add('active');
    }

    // Delete journal logic
    const deleteBtns = popupBg.querySelectorAll('.delete-journal-btn');
    deleteBtns.forEach(btn => {
      btn.onclick = async function(e) {
        e.stopPropagation();
        const id = btn.getAttribute('data-del-id');
        if (id) {
          try {
            await deleteJournalFromFirestore(id);
            popupBg.remove();
            showJournalListPopup();
          } catch (err) {
            alert('Failed to delete journal: ' + err.message);
          }
        }
      };
    });
  });
}

// Expose globally for non-module usage
window.showJournalListPopup = showJournalListPopup;

/* Add firestore-helpers.js to journal-list-popup.js for Firestore CRUD support.
<script src="firebase.js"></script>
<script src="firestore-helpers.js"></script>
*/
