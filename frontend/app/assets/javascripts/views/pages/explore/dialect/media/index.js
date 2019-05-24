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
import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchResources } from 'providers/redux/reducers/fvResources'
import { navigateTo } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import MediaList from 'views/components/Browsing/media-list'
import withPagination from 'views/hoc/grid-list/with-pagination'
import withFilter from 'views/hoc/grid-list/with-filter'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 20, filters: { 'properties.dc:title': '', dialect: '' } }

/**
 * Browse media related to this dialect
 */

const { array, func, object, string } = PropTypes
export class DialectMedia extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    computeResources: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchResources: func.isRequired,
    navigateTo: func.isRequired,
    pushWindowPath: func.isRequired,
    fetchPortal: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      fetcherParams: DefaultFetcherParams,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', 'fetchData'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _onNavigateRequest(media) {
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(this.props.routeParams.theme || 'explore', media, 'media')
    )
  }

  fetchData(fetcherParams, props = this.props) {
    this.setState({
      fetcherParams: fetcherParams,
    })

    props.fetchResources(
      props.routeParams.dialect_path + '/Resources',
      ProviderHelpers.filtersToNXQL(fetcherParams.filters) +
        '&currentPageIndex=' +
        (fetcherParams.currentPageIndex - 1) +
        '&pageSize=' +
        fetcherParams.pageSize
    )
  }

  // Fetch data on initial render
  componentDidMount() {
    this.props.fetchPortal(this.props.routeParams.dialect_path + '/Portal')
    this.fetchData(this.state.fetcherParams)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      nextProps.fetchPortal(nextProps.routeParams.dialect_path + '/Portal')
      this.fetchData(DefaultFetcherParams, nextProps)
    }
  }
  render() {
    const FilteredPaginatedMediaList = withFilter(
      withPagination(MediaList, DefaultFetcherParams.pageSize),
      DefaultFetcherParams
    )
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path + '/Portal',
        entity: this.props.computePortal,
      },
      {
        id: this.props.routeParams.dialect_path + '/Resources',
        entity: this.props.computeResources,
      },
    ])

    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )
    const computeResources = ProviderHelpers.getEntry(
      this.props.computeResources,
      this.props.routeParams.dialect_path + '/Resources'
    )

    return (
      <PromiseWrapper hideFetch computeEntities={computeEntities}>
        <h1>
          {selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal)}{' '}
          {intl.trans('media', 'Media', 'first')}
        </h1>

        <hr />

        <div className="row">
          <div className="col-xs-12">
            <FilteredPaginatedMediaList
              cols={5}
              cellHeight={150}
              initialValues={{ 'dc:contributors': selectn('response.properties.username', this.props.computeLogin) }}
              filterOptionsKey="Resources"
              action={this._onNavigateRequest}
              fetcher={this.fetchData}
              theme={this.props.routeParams.theme}
              area={this.props.routeParams.area}
              fetcherParams={this.state.fetcherParams}
              metadata={selectn('response', computeResources) || selectn('response_prev', computeResources)}
              items={
                selectn('response.entries', computeResources) || selectn('response_prev.entries', computeResources)
              }
            />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPortal, fvResources, nuxeo, windowPath } = state

  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeResources } = fvResources
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeLogin,
    computePortal,
    computeResources,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResources,
  navigateTo,
  pushWindowPath,
  fetchPortal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialectMedia)
