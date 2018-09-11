import Immutable from 'seamless-immutable';

import { V2V_VALIDATE_VMS, V2V_VM_STEP_RESET, QUERY_V2V_PLAN_VMS } from './PlanWizardVMStepConstants';
import { _formatConflictVms, _formatInvalidVms, _formatValidVms, _formatPreselectedVms } from './helpers';

const initialState = Immutable({
  isValidatingVms: false,
  isRejectedValidatingVms: false,
  validationServiceCalled: false,
  errorValidatingVms: null,
  valid_vms: [],
  invalid_vms: [],
  conflict_vms: [],
  preselected_vms: [],
  isQueryingVms: false,
  isVmsQueryRejected: false,
  vmsQueryError: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case `${V2V_VALIDATE_VMS}_PENDING`:
      return state.set('isValidatingVms', true).set('isRejectedValidatingVms', false);
    case `${V2V_VALIDATE_VMS}_FULFILLED`: {
      const { payload } = action;
      if (payload && payload.data) {
        return state
          .set('valid_vms', _formatValidVms(payload.data.valid_vms))
          .set('invalid_vms', _formatInvalidVms(payload.data.invalid_vms))
          .set('conflict_vms', _formatConflictVms(payload.data.conflict_vms))
          .set('validationServiceCalled', true)
          .set('isRejectedValidatingVms', false)
          .set('isValidatingVms', false);
      }
      return state
        .set('valid_vms', [])
        .set('invalid_vms', [])
        .set('conflict_vms', [])
        .set('isRejectedValidatingVms', false)
        .set('isValidatingVms', false);
    }
    case `${V2V_VALIDATE_VMS}_REJECTED`:
      return state
        .set('errorValidatingVms', action.payload)
        .set('isRejectedValidatingVms', true)
        .set('isValidatingVms', false)
        .set('isCSVParseError', false);
    case `${V2V_VALIDATE_VMS}_CSV_PARSE_ERROR`:
      return state
        .set('errorParsingCSV', action.payload)
        .set('isRejectedValidatingVms', true)
        .set('isCSVParseError', true)
        .set('isValidatingVms', false);
    case `${QUERY_V2V_PLAN_VMS}_PENDING`:
      return state
        .set('isQueryingVms', true)
        .set('isVmsQueryRejected', false)
        .set('vmsQueryError', null)
        .set('preselected_vms', []);
    case `${QUERY_V2V_PLAN_VMS}_FULFILLED`: {
      const { payload } = action;
      if (payload && payload.data) {
        return state
          .set('isQueryingVms', false)
          .set('isVmsQueryRejected', false)
          .set('vmsQueryError', null)
          .set('preselected_vms', _formatPreselectedVms(action.payload.data.results));
      }
      return state
        .set('isQueryingVms', false)
        .set('isVmsQueryRejected', false)
        .set('vmsQueryError', null)
        .set('preselected_vms', []);
    }
    case `${QUERY_V2V_PLAN_VMS}_REJECTED`:
      return state
        .set('isQueryingVms', false)
        .set('isVmsQueryRejected', true)
        .set('vmsQueryError', action.payload)
        .set('preselected_vms', []);
    case V2V_VM_STEP_RESET:
      return state
        .set('validationServiceCalled', false)
        .set('valid_vms', [])
        .set('invalid_vms', [])
        .set('conflict_vms', [])
        .set('preselected_vms', [])
        .set('isRejectedValidatingVms', false)
        .set('isValidatingVms', false);

    default:
      return state;
  }
};
