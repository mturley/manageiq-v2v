import { connect } from 'react-redux';

import PlanWizardInstancePropertiesStep from './PlanWizardInstancePropertiesStep';
import * as PlanWizardInstancePropertiesStepActions from './PlanWizardInstancePropertiesStepActions';
import reducer from './PlanWizardInstancePropertiesStepReducer';
import { getVMStepSelectedVms } from '../PlanWizardAdvancedOptionsStep/PlanWizardAdvancedOptionsStepSelectors';

export const reducers = { planWizardInstancePropertiesStep: reducer };

const mapStateToProps = ({
  planWizardInstancePropertiesStep,
  planWizardVMStep,
  form: {
    planWizardGeneralStep: {
      values: { vm_choice_radio }
    },
    planWizardVMStep: {
      values: { selectedVms }
    },
    planWizardInstancePropertiesStep: instancePropertiesStepForm
  }
}, ownProps) => {
  const allVms =
    vm_choice_radio === 'vms_via_csv'
      ? [...planWizardVMStep.valid_vms, ...planWizardVMStep.invalid_vms, ...planWizardVMStep.conflict_vms]
      : planWizardVMStep.valid_vms;
  return {
    ...planWizardInstancePropertiesStep,
    ...ownProps.data,
    instancePropertiesStepForm,
    vmStepSelectedVms: getVMStepSelectedVms(allVms, selectedVms)
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps.data,
  ...dispatchProps
});

export default connect(
  mapStateToProps,
  PlanWizardInstancePropertiesStepActions,
  mergeProps
)(PlanWizardInstancePropertiesStep);
