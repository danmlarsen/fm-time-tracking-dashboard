const timeframeListEl = document.querySelector('.time-tracker__timeframe-list');
const listContainer = document.querySelector('.time-tracker__list-container');

const state = {
    data: null,
    selectedTimeframe: 'weekly',
};

const fetchData = function () {
    fetch('/data.json')
        .then(req => {
            if (!req.ok) {
                console.error('Ooops. Something went wrong!');
                return null;
            }

            return req.json();
        })
        .then(data => {
            state.data = data;
            updateTimeTracker();
        });
};

const generateListItemMarkup = function () {
    const listItemsMarkup = state.data.map(item => {
        const { timeframes, title } = item;
        const { current, previous } = timeframes[state.selectedTimeframe];

        return `
            <li class="time-tracker__list-item time-tracker__list-item--${title.toLowerCase().replace(' ', '')}">
                <div class="time-tracker__list-item-content">
                <h2 class="time-tracker__category">${title}</h2>
                <a href="#" class="time-tracker__options"><img src="images/icon-ellipsis.svg" class="time-tracker__options-icon" alt="" /></a>
                <p class="time-tracker__hours">${current}hrs</p>
                <p class="time-tracker__previous-hours">Previous - ${previous}hrs</p>
                </div>
            </li>`;
    });

    return listItemsMarkup.join('');
};

const updateTimeTracker = function () {
    listContainer.innerHTML = `
    <ul class="time-tracker__list">${generateListItemMarkup()}</ul>
  `;
};

timeframeListEl.addEventListener('click', function (e) {
    if (!e.target.dataset?.timeframe) return;

    timeframeListEl.querySelectorAll('.time-tracker__timeframe-btn').forEach(el => el.classList.remove('time-tracker__timeframe-btn--active'));
    e.target.classList.add('time-tracker__timeframe-btn--active');

    state.selectedTimeframe = e.target.dataset.timeframe;

    updateTimeTracker();
});

fetchData();
