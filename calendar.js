// calendar.js
// Simple square calendar rendering below the center line in .below-top-container

document.addEventListener('DOMContentLoaded', function () {
  const calendarContainer = document.getElementById('custom-calendar');
  if (!calendarContainer) return;

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderCalendar(month, year) {
    calendarContainer.innerHTML = '';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
      <button class="calendar-nav" id="prev-month">&#8592;</button>
      <span class="calendar-title">${monthNames[month]} ${year}</span>
      <button class="calendar-nav" id="next-month">&#8594;</button>
    `;
    calendarContainer.appendChild(header);

    // Days of week
    const daysRow = document.createElement('div');
    daysRow.className = 'calendar-days-row';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
      const day = document.createElement('div');
      day.className = 'calendar-day calendar-day-label';
      day.textContent = d;
      daysRow.appendChild(day);
    });
    calendarContainer.appendChild(daysRow);

    // Dates
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      grid.appendChild(empty);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateCell = document.createElement('div');
      dateCell.className = 'calendar-day';
      dateCell.textContent = d;
      if (
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dateCell.classList.add('today');
      }
      grid.appendChild(dateCell);
    }
    calendarContainer.appendChild(grid);

    // Navigation
    document.getElementById('prev-month').onclick = () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentMonth, currentYear);
    };
    document.getElementById('next-month').onclick = () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
    };
  }

  renderCalendar(currentMonth, currentYear);
});

// Add random quote logic for quoteText
(function() {
  const quotes = [
    "The best way to get started is to quit talking and begin doing.",
    "Success is not in what you have, but who you are.",
    "Dream bigger. Do bigger.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Great things never come from comfort zones.",
    "Push yourself, because no one else is going to do it for you.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking. Don't let the noise of others' opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary."
  ];
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const quote = quotes[dayOfYear % quotes.length];
  var quoteText = document.getElementById('quoteText');
  if (quoteText) quoteText.textContent = quote;
})();
