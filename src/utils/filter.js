
import {FilterType} from "../const.js";

const getFutureWaypoints = (waypoints, nowDate) => {
  return waypoints.filter((waypoint) => {
    return waypoint.startTime > nowDate;
  });
};

const getPastWaypoints = (waypoints, nowDate) => {
  return waypoints.filter((waypoint) => {
    return waypoint.endTime < nowDate;
  });
};

export const getWaypointsByFilter = (waypoints, filterType) => {
  const nowDate = new Date().toISOString();

  switch (filterType) {
    case FilterType.FUTURE :
      return getFutureWaypoints(waypoints, nowDate);
    case FilterType.PAST :
      return getPastWaypoints(waypoints, nowDate);
  }
  return waypoints;
};
