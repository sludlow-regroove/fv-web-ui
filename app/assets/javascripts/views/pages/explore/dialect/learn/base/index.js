/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import selectn from 'selectn';
import ProviderHelpers from 'common/ProviderHelpers';

const innerUlStyle = {
    'fontSize': '0.9em',
    'margin': 0,
    'padding': '0 15px'
};

/**
* Learn Base Page
* TODO: Convert to composition vs. inheritance https://facebook.github.io/react/docs/composition-vs-inheritance.html
*/
export default class PageDialectLearnBase extends Component {

  constructor(props, context) {
    super(props, context);
  }

  // Fetch data on initial render
  componentDidMount() {
    this._resetColumns(this.props);
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }

    if (nextProps.routeParams.area !== this.props.routeParams.area) {
      this._resetColumns(nextProps);
      this._resetPagination(nextProps);
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace('sections', 'Workspaces') + '/' + path);
  }

  _onEntryNavigateRequest(item) {
    // Get path name from path
    let splitPath = item.path.split('/');
    this.props.pushWindowPath(this.props.windowPath + '/' + splitPath[splitPath.length - 1]);
  }  

  _handleRefetch(dataGridProps, page, pageSize) {

    this.setState({
      pageInfo: {
        page: page + 1,
        pageSize: pageSize
      }
    });

    this._fetchListViewData(this.props, page, pageSize, this.state.sortInfo.currentSortType, this.state.sortInfo.currentSortCols);
  }

  _handleSortChange(sortInfo) {

    let colRequestSkipped = false;
    let sortCol = [];
    let sortType = [];

    sortInfo.map(function (sortColumn, i) {

      let name = selectn('['+i+'].name', sortInfo);

      if (this.props.DISABLED_SORT_COLS.indexOf(name) === -1) {

        let definedCol = this.state.columns.find(function(item) {
          return item.name === name;
        });

        sortCol.push((selectn('sortName', definedCol)) ? selectn('sortName', definedCol) : name);
        sortType.push((selectn('['+i+'].dir', sortInfo) == -1) ? 'desc' : 'asc');
      } else {
        if (i === sortInfo.length-1)
          colRequestSkipped = true;
      }
    }.bind(this));

    if (sortCol.length == 0) {
     sortCol = [this.props.DEFAULT_SORT_COL];
     sortType = [this.props.DEFAULT_SORT_TYPE];
    }

    let joinedSortType = sortType.join();
    let joinedSortCols = sortCol.join();

    // Skip updating if last sort addition is disabled
    if (colRequestSkipped)
      return;

    this._fetchListViewData(this.props, this.props.DEFAULT_PAGE, this.props.DEFAULT_PAGE_SIZE, joinedSortType, joinedSortCols);

    this.setState({
      sortInfo: {
        uiSortOrder: sortInfo,
        currentSortCols: joinedSortCols,
        currentSortType: joinedSortType
      }
    });
  }

  _handleColumnOrderChange(index, dropIndex) {
		var col = this.state.columns[index]
		this.state.columns.splice(index, 1)
		this.state.columns.splice(dropIndex, 0, col)
		this.setState({})
  }

  _handleFacetSelected(facetField, categoryId, event, checked) {

    let categoryFilter = '';

    // Adding filter
    if (checked) {
      this.state.filterInfo.currentCategoryFilterIds.push(categoryId);
    }
    // Removing filter
    else {
      this.state.filterInfo.currentCategoryFilterIds.splice(this.state.filterInfo.currentCategoryFilterIds.indexOf(categoryId), 1);
    }

    // Category filter 
    if (this.state.filterInfo.currentCategoryFilterIds.length > 0) {
      categoryFilter = ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys(facetField, this.props.routeParams.area) + '/* IN ("' + this.state.filterInfo.currentCategoryFilterIds.join('","') + '")';
    }

    // Update applied filter state
    this.state.filterInfo.currentAppliedFilter.categories = categoryFilter;

    // Refetch words
    this._fetchListViewData(this.props, this.props.DEFAULT_PAGE, this.props.DEFAULT_PAGE_SIZE, this.props.DEFAULT_SORT_TYPE, this.props.DEFAULT_SORT_COL);
  }

  renderComplexArrayRow(dataItems = [], render) {
      let rows = [];

      dataItems.map(function(entry, i) {
        rows.push(render(entry, i));
      });

      if (dataItems.length >= 2) {
        rows.push(<li key='more'>...</li>);
      }

      return <ul style={innerUlStyle}>
          {rows}
      </ul>;
  }

  _resetColumns(props) {
    // Toggle 'state' column for section/workspaces view
    if (props.routeParams.area == 'sections') {
      let stateCol = this.state.columns.findIndex(function(item) {
          return item.name === 'state';
      });

      this.state.columns.splice(stateCol, 1);
    } else {
      this.state.columns.push({ name: 'state', title: 'State' });
    }
  }

  _resetPagination(props) {
    this.setState({
      pageInfo: {
        page: props.DEFAULT_PAGE,
        pageSize: props.DEFAULT_PAGE_SIZE
      }
    })
  }
}