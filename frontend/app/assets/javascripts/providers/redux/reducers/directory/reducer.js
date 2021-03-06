// NOTE: see `.../javascripts/providers/redux/reducers/index.js` about `_directory` vs `directory`
import { combineReducers } from 'redux'
import { DIRECTORY_FETCH_START, DIRECTORY_FETCH_SUCCESS, DIRECTORY_FETCH_ERROR } from './actionTypes'

const initialState = { isFetching: false, directories: {}, directory: null, success: false }

const computeDirectory = (state = initialState, action) => {
  switch (action.type) {
    case DIRECTORY_FETCH_START:
      return Object.assign({}, state, { isFetching: true, success: false, directory: action.name })

    case DIRECTORY_FETCH_SUCCESS:
      return Object.assign({}, state, {
        directories: Object.assign(state.directories, action.directories),
        directory: action.name,
        isFetching: false,
        success: true,
      })

    case DIRECTORY_FETCH_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        isError: true,
        error: action.error,
        directory: action.name,
      })

    default:
      return Object.assign({}, state, { isFetching: false, directory: action.name })
  }
}

export const directoryReducer = combineReducers({
  computeDirectory,
})
