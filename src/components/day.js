import moment from "moment";
import {createFormTemplate} from "./form.js";
import {createWaypointTemplate} from "./waypoint.js";

const createDayTemplate = (index, waypointsByDay) => {
  const createWaypointsTemplate = (waypoints) => {
    return waypoints
      .map((waypoint) => {
        return createWaypointTemplate(waypoint);
      })
      .join(``);
  };

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${moment.utc(new Date(waypointsByDay[0].startTime)).format(`YYYY-MM-DD`)}">${moment.utc(new Date(waypointsByDay[0].startTime)).format(`D MMM`)}</time>
      </div>

      <ul class="trip-events__list">
      ${index === 0 ? createFormTemplate(waypointsByDay[index]) : ``}

      ${createWaypointsTemplate(waypointsByDay)}
      </ul>
    </li>`
  );
};

export {createDayTemplate};
