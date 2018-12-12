import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import { mockRequest, mockReset } from '../../../../../common/mockRequests';
import * as actions from '../OverviewActions';
import { requestTransformationPlansData } from '../overview.transformationPlans.fixtures';
import { cancelRequestResponse } from '../overview.cancelRequest.fixtures';
import {
  SHOW_CONFIRM_MODAL,
  HIDE_CONFIRM_MODAL,
  SHOW_PLAN_WIZARD,
  SHOW_PLAN_WIZARD_EDIT_MODE,
  SHOW_EDIT_PLAN_TITLE_MODAL,
  HIDE_EDIT_PLAN_TITLE_MODAL,
  FETCH_PROVIDERS,
  FETCH_PROVIDERS_URL,
  TRANSFORMATION_PLAN_REQUESTS_URL
} from '../OverviewConstants';

const middlewares = [thunk, promiseMiddleware()];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

afterEach(() => {
  store.clearActions();
  mockReset();
});

describe('confirm modal actions', () => {
  test('show', () => {
    const modalOptions = { mock: 'data' };
    const action = actions.showConfirmModalAction(modalOptions);
    expect(action).toEqual({
      type: SHOW_CONFIRM_MODAL,
      payload: modalOptions
    });
  });

  test('hide', () => {
    expect(actions.hideConfirmModalAction()).toEqual({
      type: HIDE_CONFIRM_MODAL
    });
  });
});

describe('plan wizard actions', () => {
  test('show in normal mode', () => {
    const id = '12345';
    store.dispatch(actions.showPlanWizardAction(id));
    expect(store.getActions()).toEqual([
      {
        type: SHOW_PLAN_WIZARD,
        payload: { id }
      }
    ]);
  });

  test('show in edit mode', () => {
    const id = '12345';
    store.dispatch(actions.showPlanWizardEditModeAction(id));
    expect(store.getActions()).toEqual([
      {
        type: SHOW_PLAN_WIZARD_EDIT_MODE,
        editingPlanId: id
      }
    ]);
  });
});

describe('edit plan title modal', () => {
  test('show', () => {
    const id = '12345';
    store.dispatch(actions.showEditPlanNameModalAction(id));
    expect(store.getActions()).toEqual([
      {
        type: SHOW_EDIT_PLAN_TITLE_MODAL,
        editingPlanId: id
      }
    ]);
  });

  test('hide', () => {
    store.dispatch(actions.hideEditPlanNameModalAction());
    expect(store.getActions()).toEqual([
      {
        type: HIDE_EDIT_PLAN_TITLE_MODAL
      }
    ]);
  });
});

describe('fetchProvidersAction', () => {
  test('dispatches PENDING and FULFILLED actions', () => {
    const response = { data: { mock: 'data' } };
    mockRequest({
      method: 'GET',
      url: FETCH_PROVIDERS_URL,
      status: 200,
      response
    });
    return store.dispatch(actions.fetchProvidersAction()).then(() => {
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  test('dispatches PENDING and REJECTED actions', () => {
    const response = 'error';
    mockRequest({
      method: 'GET',
      url: FETCH_PROVIDERS_URL,
      status: 404
    });
    return store.dispatch(actions.fetchProvidersAction()).catch(() => {
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});

describe('fetchTransformationPlansAction', () => {
  const { fetchTransformationPlansUrl, response } = requestTransformationPlansData;

  test('dispatches PENDING and FULFILLED actions', () => {
    mockRequest({
      method: 'GET',
      url: fetchTransformationPlansUrl,
      status: 200,
      response
    });

    return store
      .dispatch(
        actions.fetchTransformationPlansAction({
          url: fetchTransformationPlansUrl,
          archived: false
        })
      )
      .then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0].type).toBe('FETCH_V2V_TRANSFORMATION_PLANS_PENDING');
        expect(actions[1].type).toBe('FETCH_V2V_ALL_REQUESTS_WITH_TASKS_PENDING');
        expect(actions[2].type).toBe('FETCH_V2V_TRANSFORMATION_PLANS_FULFILLED');
        expect(actions[2].payload.data.resources).toHaveLength(8);
      });
  });

  test('dispatches PENDING and REJECTED actions', () => {
    mockRequest({
      method: 'GET',
      url: fetchTransformationPlansUrl,
      status: 404,
      response
    });

    return store
      .dispatch(
        actions.fetchTransformationPlansAction({
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
    store.dispatch(actions.setMigrationsFilterAction(activeFilter));

    expect(store.getActions()).toMatchSnapshot();
  });

  test('dispatches additional actions', () => {
    const SOME_ACTION_TYPE = 'SOME_ACTION_TYPE';
    const payload = 'Some payload';
    store.dispatch(actions.setMigrationsFilterAction(activeFilter, { [SOME_ACTION_TYPE]: payload }));

    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('cancelPlanRequestAction', () => {
  const request = {
    method: 'POST',
    url: TRANSFORMATION_PLAN_REQUESTS_URL,
    data: { action: 'cancel' }
  };

  const action = actions.cancelPlanRequestAction(TRANSFORMATION_PLAN_REQUESTS_URL, '1');

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
