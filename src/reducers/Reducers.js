import _ from 'lodash';
import reduceReducers from 'reduce-reducers';

function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}

function fetchRequest(state) {
  return { ...state, isFetching: true, isFailure: false };
}

function fetchSuccess(state, action) {
  return {
    ...state,
    isFetching: false,
    isFailure: false,
    data: action.payload.data,
  };
}

function fetchFailure(state, action) {
  return {
    ...state, isFetching: false, isFailure: true, errorInfo: action.payload,
  };
}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

function buildFetchReducer(initialState, name = '') {
  const newInitialState = {
    ...initialState,
    isFetching: false,
    isFailure: false,
  };
  const handlers = {};
  handlers[`FETCH_${name}_REQUEST`] = fetchRequest;
  handlers[`FETCH_${name}_SUCCESS`] = fetchSuccess;
  handlers[`FETCH_${name}_FAILURE`] = fetchFailure;
  return createReducer(newInitialState, handlers);
}

function buildPostReducer(initialState, name = '') {
  const newInitialState = {
    ...initialState,
    isFetching: false,
    isFailure: false,
  };
  const handlers = {};
  handlers[`POST_${name}_REQUEST`] = fetchRequest;
  handlers[`POST_${name}_SUCCESS`] = fetchSuccess;
  handlers[`POST_${name}_FAILURE`] = fetchFailure;
  return createReducer(newInitialState, handlers);
}

function setPlainTextFilter(state, action) {
  return action.payload;
}

function setObjectFilter(state, action) {
  return updateObject(state, action.payload);
}

export const steps = createReducer([], {
  ADD_STEPS(state, action) {
    if (typeof (action.payload) === 'string') {
      return state.concat([action.payload]);
    }
    return state.concat(action.payload);
  },
  REMOVE_STEPS(state, action) {
    // immutable
    if (typeof (action.payload) === 'string') {
      _.remove(state, item => item === action.payload);
      return _.clone(state);
    }
    return _.clone(state);
  },
  RESET_STEPS() {
    return [];
  },
});

export const currentMode = createReducer('answer', {
  SET_CURRENT_MODE(state, action) { return action.payload; },
});

export const room = createReducer(null, {
  SET_ROOM(state, action) { return action.payload; },
});

export const message = createReducer({
  type: 'success',
  text: 'Default',
  duration: 5000,
  open: false,
  action: null,
}, {
  SET_MESSAGE(state, action) {
    return {
      ...state,
      ...action.payload,
    };
  },
  OPEN_MESSAGE_BOX(state) {
    return {
      ...state,
      open: true,
    };
  },
  CLOSE_MESSAGE_BOX(state) {
    return {
      ...state,
      open: false,
    };
  },
});

export const currentAnswerId = createReducer(null, {
  SET_CURRENT_ANSWER_ID(state, action) { return action.payload; },
});

export const puzzles = buildFetchReducer({}, 'PUZZLES');
export const puzzle = reduceReducers(
  buildFetchReducer({
    data: {
      is_favorite: false,
      right_answers: [],
      wrong_answers: [],
      steps: '',
      rank: '18k',
      id: 0,
      whofirst: 'Black First',
      preview_img_r1: {
        x100: { url: '' },
        x200: { url: '' },
        x300: { url: '' },
        x400: { url: '' },
        x1000: { url: '' },
      },
    },
  }, 'PUZZLE'),
  buildFetchReducer({}, 'PUZZLE_NEXT'),
  createReducer({}, {
    TOGGLE_FAVORITE: state => ({
      ...state,
      data: {
        ...state.data,
        is_favorite: !state.data.is_favorite,
        favorite_count:
          state.data.is_favorite ? state.data.favorite_count - 1 : state.data.favorite_count + 1,
      },
    }),
    RIGHT_ADD_ONE: state => ({
      ...state,
      data: {
        ...state.data,
        right_count: state.data.right_count + 1,
      },
    }),
    WRONG_ADD_ONE: state => ({
      ...state,
      data: {
        ...state.data,
        wrong_count: state.data.wrong_count + 1,
      },
    }),
  }),
);

export const puzzleRecords = buildFetchReducer({}, 'PUZZLE_RECORDS');
export const puzzleRecord = reduceReducers(
  buildFetchReducer({}, 'PUZZLE_RECORD'),
  buildPostReducer({}, 'PUZZLE_RECORD'),
);

export const dashboard = buildFetchReducer({ data: { total: 0, right: 0, wrong: 0 } }, 'DASHBOARD');

export const rating = buildPostReducer({}, 'RATING');
export const favorite = buildPostReducer({}, 'FAVORITE');
export const favorites = buildFetchReducer({}, 'FAVORITES');
export const kifus = buildFetchReducer({}, 'KIFUS');
export const kifu = buildFetchReducer({
  data: {
    player_b: { en_name: 'John Doe' },
    player_w: { en_name: 'Jane Doe' },
    b_rank: 'None',
    w_rank: 'None',
    result: 'None',
    komi: 'None',
    short_date: 'None',
    steps: '',
  },
}, 'KIFU');

export const topPlayers = buildFetchReducer({}, 'TOP_PLAYERS');
export const rangeFilter = createReducer('all', { SET_RANGE_FILTER: setPlainTextFilter });
export const kifuFilter = createReducer('all', { SET_KIFU_FILTER: setPlainTextFilter });
export const tagFilter = createReducer('all', { SET_TAG_FILTER: setPlainTextFilter });
export const dateRangeFilter = createReducer('last7days', { SET_DATE_RANGE_FILTER: setPlainTextFilter });
export const userRangeFilter = createReducer('onlyme', { SET_USER_RANGE_FILTER: setPlainTextFilter });
export const recordTypeFilter = createReducer('all', { SET_RECORD_TYPE_FILTER: setPlainTextFilter });
export const nextStoneType = createReducer(1, { SET_NEXT_STONE_TYPE_FILTER: setPlainTextFilter });
export const toolbarHidden = createReducer(true, { SET_TOOLBAR_HIDDEN: setPlainTextFilter });
export const boardStates = createReducer({
  showCoordinate: true,
  showAnalysisModal: false,
  mark: 'None',
  turn: 'B-W',
  clear: false,
}, { SET_BOARD_STATES: setObjectFilter });
export const ranges = createReducer(['all', '18k-10k', '9k-5k', '4k-1k', '1d-3d', '4d-6d'], {});
export const theme = createReducer(
  localStorage.getItem('theme') || 'subdued-theme',
  { SET_THEME: setPlainTextFilter },
);
export const tags = buildFetchReducer({}, 'TAGS');
