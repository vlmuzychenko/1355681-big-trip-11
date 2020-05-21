import FilterComponent from "../components/filters.js";
import {FilterType, RenderPosition} from "../const.js";
import {render, replace} from "../utils/render.js";

export default class FilterController {
  constructor(container, waypointsModel) {
    this._container = container;
    this._waypointsModel = waypointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._waypointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultFilterType() {
    this._activeFilterType = FilterType.EVERYTHING;
    this._waypointsModel.setFilter(this._activeFilterType);
    this._onDataChange();
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._waypointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
