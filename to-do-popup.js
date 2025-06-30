// to-do-popup.js
// Popup for icon 2: To Do List

window.addEventListener('DOMContentLoaded', function() {
  // Robust: find icon by src or alt if not enough icons
  let icons = Array.from(document.querySelectorAll('.icon-img'));
  // Try to find the to-do icon by alt or src if not present at index 1
  let todoIcon = icons[1];
  if (!todoIcon) {
    todoIcon = icons.find(img => (img.alt && img.alt.toLowerCase().includes('to do')) || (img.src && img.src.toLowerCase().includes('icon2')));
  }
  if (!todoIcon) return;
  todoIcon.addEventListener('click', function() {
    // Remove existing popup if any
    const existing = document.getElementById('to-do-popup');
    if (existing) existing.remove();

    // Create popup
    const popup = document.createElement('div');
    popup.id = 'to-do-popup';
    popup.className = 'to-do-popup-bg';
    popup.innerHTML = `
      <div class="to-do-popup-content">
        <div class="to-do-popup-window-bar">
          <div class="circle"></div>
          <div class="circle"></div>
          <button class="to-do-popup-close">×</button>
        </div>
        <div class="to-do-popup-main">
          <h2 class="to-do-popup-title">TO DO LIST</h2>
          <ul class="to-do-list"></ul>
          <div class="to-do-input-row">
            <input class="to-do-input" type="text" placeholder="Add a task...">
            <button class="to-do-add-btn">Add</button>
          </div>
        </div>
        <button class="to-do-save-btn">Save</button>
      </div>
    `;
    document.body.appendChild(popup);
    // Close handlers
    popup.querySelector('.to-do-popup-close').onclick = () => popup.remove();
    popup.onclick = (e) => { if (e.target === popup) popup.remove(); };

    // Add task logic
    function updateNumbers() {
      const items = popup.querySelectorAll('.to-do-list li');
      items.forEach((li, idx) => {
        li.querySelector('.to-do-task-text').textContent = (idx + 1) + '. ' + li.dataset.task;
      });
      // Ensure the list fits and no side scrolling
      list.style.overflowX = 'hidden';
      list.style.wordBreak = 'break-word';
      list.style.whiteSpace = 'normal';
      list.style.maxHeight = '220px'; // Adjust as needed for popup size
      list.style.overflowY = 'auto';
      list.style.paddingRight = '4px';
    }
    const input = popup.querySelector('.to-do-input');
    const addBtn = popup.querySelector('.to-do-add-btn');
    const list = popup.querySelector('.to-do-list');
    function addTask() {
      const val = input.value.trim();
      if (!val) return;
      const li = document.createElement('li');
      li.dataset.task = val;
      li.innerHTML = `<span class="to-do-task-text"></span><button class="to-do-delete-btn">Delete</button>`;
      li.querySelector('.to-do-delete-btn').onclick = (e) => { e.stopPropagation(); li.remove(); updateNumbers(); };
      li.onclick = null; // Remove click-to-remove
      // Style to prevent side scrolling and wrap text
      li.style.overflow = 'hidden';
      li.style.textOverflow = 'ellipsis';
      li.style.wordBreak = 'break-word';
      li.style.whiteSpace = 'normal';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.justifyContent = 'space-between';
      li.style.gap = '8px';
      list.appendChild(li);
      input.value = '';
      updateNumbers();
      // No popup/alert on add
    }
    addBtn.onclick = addTask;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

    // Save button logic
    const saveBtn = popup.querySelector('.to-do-save-btn');
    saveBtn.onclick = async function() {
      const tasks = Array.from(list.querySelectorAll('li .to-do-task-text')).map(span => span.textContent.trim());
      if (tasks.length > 0) {
        try {
          await saveToDoListToFirestore(tasks);
        } catch (e) {
          alert('Failed to save to-do list: ' + e.message);
          return;
        }
        popup.remove();
        if (window.renderSavedToDoLists) window.renderSavedToDoLists();
      }
    };
  });
});

// Render saved to-do lists in .below-top-container-right
window.renderSavedToDoLists = async function() {
  const container = document.querySelector('.below-top-container-right .inner-box');
  if (!container) return;
  container.innerHTML = '';
  let saved = [];
  try {
    const lists = await getToDoListsFromFirestore();
    saved = lists.map(l => l.tasks).flat();
  } catch (e) {
    container.innerHTML = '<div style="color:#888;text-align:center;width:100%;font-size:1.1em;font-style:italic;margin-top:30px;">no tasks added yet</div>';
    return;
  }
  if (saved.length === 0) {
    container.innerHTML = '<div style="color:#888;text-align:center;width:100%;font-size:1.1em;font-style:italic;margin-top:30px;">no tasks added yet</div>';
    return;
  }
  // Create a single box for all tasks
  const listDiv = document.createElement('div');
  listDiv.className = 'saved-todo-list';
  listDiv.style.marginBottom = '18px';
  // Render each task as a separate box with a strike box
  saved.forEach((task, i) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'saved-todo-list-task';
    // Add strike box
    const strikeBox = document.createElement('span');
    strikeBox.className = 'strike-box';
    strikeBox.title = 'Mark as done';
    strikeBox.onclick = async function(e) {
      e.stopPropagation();
      strikeBox.classList.add('checked');
      taskDiv.classList.add('striked');
      setTimeout(async () => {
        // Remove from Firestore: find and update the first list containing this task
        try {
          const lists = await getToDoListsFromFirestore();
          for (const l of lists) {
            const idx = l.tasks.indexOf(task);
            if (idx !== -1) {
              l.tasks.splice(idx, 1);
              await updateToDoListInFirestore(l.id, l.tasks);
              break;
            }
          }
        } catch (e) {}
        window.renderSavedToDoLists();
      }, 500);
    };
    taskDiv.appendChild(strikeBox);
    // Task text
    const textSpan = document.createElement('span');
    textSpan.textContent = task.replace(/^[0-9]+\.\s*/, '');
    taskDiv.appendChild(textSpan);
    listDiv.appendChild(taskDiv);
  });
  container.appendChild(listDiv);
};
window.addEventListener('DOMContentLoaded', window.renderSavedToDoLists);
