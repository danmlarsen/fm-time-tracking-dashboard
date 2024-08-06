const timeframeListEl = document.querySelector(".time-tracker__timeframe-list");
const listContainer = document.querySelector(".time-tracker__list-container");

const state = {
  data: null,
  selectedTimeframe: "weekly",
};

const fetchData = function () {
  fetch("/data.json")
    .then((req) => {
      if (!req.ok) {
        console.error("Ooops. Something went wrong!");
        return null;
      }

      return req.json();
    })
    .then((data) => {
      state.data = data;
      updateTimeTracker();
    });
};

const generateListItemMarkup = function () {
  const listItemsMarkup = state.data.map((item) => {
    const { timeframes, title } = item;
    const { current, previous } = timeframes[state.selectedTimeframe];

    return `
            <li class="time-tracker__list-item time-tracker__list-item--${title
              .toLowerCase()
              .replace(" ", "")}">
                <div class="time-tracker__list-item-content">
                <h2 class="time-tracker__category">${title}</h2>
                <p class="time-tracker__hours">${current}hrs</p>
                <p class="time-tracker__previous-hours">Previous - ${previous}hrs</p>
                </div>
            </li>`;
  });

  return listItemsMarkup.join("");
};

const updateTimeTracker = function () {
  listContainer.innerHTML = `
    <ul class="time-tracker__list">${generateListItemMarkup()}</ul>
  `;
};

timeframeListEl.addEventListener("click", function (e) {
  if (!e.target.dataset?.timeframe) return;

  state.selectedTimeframe = e.target.dataset.timeframe;

  updateTimeTracker();
});

fetchData();
