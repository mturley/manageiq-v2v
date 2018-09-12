import URI from 'urijs';
import API from '../../../../../../../../common/API';
import { V2V_VM_STEP_RESET, V2V_VALIDATE_VMS, QUERY_V2V_PLAN_VMS } from './PlanWizardVMStepConstants';

export { showConfirmModalAction, hideConfirmModalAction } from '../../../../OverviewActions';

const _validateVmsActionCreator = (url, vms) => dispatch => {
  const postBody = {
    action: 'validate_vms',
    import: vms
  };
  dispatch({
    type: V2V_VALIDATE_VMS,
    payload: new Promise((resolve, reject) => {
      API.post(url, postBody)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    })
  });
};

export const validateVmsAction = (url, id, vms) => {
  const uri = new URI(`${url}/${id}`);

  return _validateVmsActionCreator(uri.toString(), vms);
};

export const csvImportAction = () => dispatch => {
  dispatch({
    type: V2V_VM_STEP_RESET
  });
};

export const csvParseErrorAction = errMsg => dispatch => {
  dispatch({
    type: `${V2V_VALIDATE_VMS}_CSV_PARSE_ERROR`,
    payload: errMsg
  });
};

const _queryPreselectedVmsActionCreator = ids => dispatch => {
  const resources = ids.map(id => ({
    id
  }));

  return dispatch({
    type: QUERY_V2V_PLAN_VMS,
    payload: API.post(
      '/api/vms?expand=resources&attributes=name,ems_cluster.name,allocated_disk_storage,ext_management_system.name,v_parent_blue_folder_display_path',
      {
        action: 'query',
        resources
      }
    )
  });
};

export const queryPreselectedVmsAction = ids => _queryPreselectedVmsActionCreator(ids);
