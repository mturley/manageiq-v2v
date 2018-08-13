import URI from 'urijs';
import API from '../../../../../../../../common/API';

import {
  FETCH_V2V_OSP_SECURITY_GROUPS,
  FETCH_V2V_OSP_FLAVORS
} from './PlanWizardInstancePropertiesStepConstants';

export const _getOpenstackSecurityGroupsActionCreator = url => dispatch => {
  console.log('CALLING ME, dispatch: ', dispatch);
  dispatch({
    type: FETCH_V2V_OSP_SECURITY_GROUPS,
    payload: API.get(url)
  });
}

export const fetchOpenstackSecurityGroupsAction = (url, tenantId, urlParams) => {
  const uri = new URI(`${url}/${tenantId}?${urlParams}`);
  return _getOpenstackSecurityGroupsActionCreator(uri.toString());
};

export const _getOpenstackFlavorsActionCreator = url => dispatch =>
  dispatch({
    type: FETCH_V2V_OSP_FLAVORS,
    payload: API.get(url)
  });

export const fetchOpenstackFlavorsAction = (url, tenantId, urlParams) => {
  const uri = new URI(`${url}/${tenantId}?${urlParams}`);
  return _getOpenstackFlavorsActionCreator(uri.toString());
};
