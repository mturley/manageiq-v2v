import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import { mockRequest, mockReset } from '../../../../../common/mockRequests';
import { fetchTransformationPlansAction, setMigrationsFilterAction, cancelPlanRequestAction } from '../OverviewActions';
import { requestTransformationPlansData } from '../overview.transformationPlans.fixtures';
import { cancelRequestResponse } from '../overview.cancelRequest.fixtures';
import { TRANSFORMATION_PLAN_REQUESTS_URL } from '../OverviewConstants';

const middlewares = [thunk, promiseMiddleware()];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

afterEach(() => {
  store.clearActions();
  mockReset();
});

describe('fetchTransformationPlansAction', () => {
  const { fetchTransformationPlansUrl, response } = requestTransformationPlansData;

  test('dispatches PENDING and FULFILLED actions', () => {
    mockRequest({
      method: 'GET',
      url: fetchTransformationPlansUrl,
      params: null,
      status: 200,
      ...response
    });

    return store
      .dispatch(
        fetchTransformationPlansAction({
          url: fetchTransformationPlansUrl,
          archived: false
        })
      )
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  test('dispatches PENDING and REJECTED actions', () => {
    mockRequest({
      method: 'GET',
      url: fetchTransformationPlansUrl,
      params: null,
      status: 404,
      ...response
    });

    return store
      .dispatch(
        fetchTransformationPlansAction({
          url: fetchTransformationPlansUrl,
          archived: false
        })
      )
      .catch(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });
});

describe('setMigrationsFilterAction', () => {
  const activeFilter = 'Migrations Plans Not Started';

  test('dispatches an action with correct type and payload', () => {
    store.dispatch(setMigrationsFilterAction(activeFilter));

    expect(store.getActions()).toMatchSnapshot();
  });

  test('dispatches additional actions', () => {
    const SOME_ACTION_TYPE = 'SOME_ACTION_TYPE';
    const payload = 'Some payload';
    store.dispatch(setMigrationsFilterAction(activeFilter, { [SOME_ACTION_TYPE]: payload }));

    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('cancelPlanRequestAction', () => {
  const request = {
    method: 'POST',
    data: { action: 'cancel' }
  };

  const action = cancelPlanRequestAction(TRANSFORMATION_PLAN_REQUESTS_URL, '1');

  test('dispatches PENDING and FULFILLED actions', () => {
    mockRequest({
      ...request,
      status: 200,
      response: { data: cancelRequestResponse }
    });

    return store.dispatch(action).then(() => {
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  test('dispatched PENDING and REJECTED actions', () => {
    mockRequest({
      ...request,
      status: 404
    });

    return store.dispatch(action).catch(() => {
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
