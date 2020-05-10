
import {FilterType} from "../const.js";
import moment from "moment";

const getFutureWaypoints = (waypoints, nowDate) => {
  const now = moment.utc(nowDate).format();
  return waypoints.filter((waypoint) => {
    return waypoint.startTime > now;
  });
};

const getPastWaypoints = (waypoints, nowDate) => {
  const now = moment.utc(nowDate).format();
  return waypoints.filter((waypoint) => {
    return waypoint.endTime < now;
  });
};

export const getWaypointsByFilter = (waypoints, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE :
      return getFutureWaypoints(waypoints, nowDate);
    case FilterType.PAST :
      return getPastWaypoints(waypoints, nowDate);
  }
  return waypoints;
};
