const timeframeListEl = document.querySelector('.time-tracker__timeframe-list');
const listContainer = document.querySelector('.time-tracker__list-container');

const state = {
    data: null,
    selectedTimeframe: 'weekly',
};

const fetchData = function () {
    fetch('./data.json')
        .then(req => {
            if (!req.ok) {
                throw new Error('Ooops. Something went wrong!');
            }

            return req.json();
        })
        .then(data => {
            state.data = data;
            displayTimeTracker();
        })
        .catch(err => {
            displayError(err);
        });
};

const generateListItemMarkup = function () {
    const listItemsMarkup = state.data.map(item => {
        const { timeframes, title } = item;
        const { current, previous } = timeframes[state.selectedTimeframe];

        const previousText = state.selectedTimeframe == 'daily' ? 'Yesterday' : state.selectedTimeframe == 'weekly' ? 'Last week' : 'Last month';

        return `
            <li class="time-tracker__list-item time-tracker__list-item--${title.toLowerCase().replace(' ', '')}">
                <div class="time-tracker__list-item-content">
                <h2 class="time-tracker__category">${title}</h2>
                <a href="#" class="time-tracker__options">
                <svg class="time-tracker__options-icon" alt="Options button" width="21" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill-rule="evenodd"/></svg>
                </a>
                <p class="time-tracker__hours">${current}hrs</p>
                <p class="time-tracker__previous-hours">${previousText} - ${previous}hrs</p>
                </div>
            </li>`;
    });

    return listItemsMarkup.join('');
};

const displayTimeTracker = function () {
    listContainer.innerHTML = `
    <ul class="time-tracker__list">${generateListItemMarkup()}</ul>
  `;
};

const displayError = function (errorMsg) {
    listContainer.innerHTML = `
        <div class="error">
            <p class="error__message">${errorMsg}</p>
        </div>
    `;
};

timeframeListEl.addEventListener('click', function (e) {
    const clickedTimeframeBtn = e.target.closest('.time-tracker__timeframe-btn');

    if (!clickedTimeframeBtn || !e.target.dataset?.timeframe) return;

    timeframeListEl.querySelectorAll('.time-tracker__timeframe-btn').forEach(el => el.classList.remove('time-tracker__timeframe-btn--active'));
    clickedTimeframeBtn.classList.add('time-tracker__timeframe-btn--active');

    state.selectedTimeframe = e.target.dataset.timeframe;

    displayTimeTracker();
});

fetchData();
