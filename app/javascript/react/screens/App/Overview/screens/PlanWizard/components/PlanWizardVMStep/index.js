import { connect } from 'react-redux';
import PlanWizardVMStep from './PlanWizardVMStep';
import * as PlanWizardVMStepActions from './PlanWizardVMStepActions';

import reducer from './PlanWizardVMStepReducer';
import { findEditingPlan } from '../../PlanWizardSelectors';

export const reducers = { planWizardVMStep: reducer };

const mapStateToProps = ({ planWizard, planWizardVMStep, form, overview }, ownProps) => ({
  ...planWizardVMStep,
  ...ownProps.data,
  vm_choice_radio: form.planWizardGeneralStep.values.vm_choice_radio,
  infrastructure_mapping_id: form.planWizardGeneralStep.values.infrastructure_mapping,
  editingPlan: findEditingPlan(overview.transformationPlans, overview.editingPlanId),
  wizardMovingForward: planWizard.wizardMovingForward,
  formSelectedVms: form.planWizardVMStep && form.planWizardVMStep.values.selectedVms
});

export default connect(
  mapStateToProps,
  PlanWizardVMStepActions
)(PlanWizardVMStep);
