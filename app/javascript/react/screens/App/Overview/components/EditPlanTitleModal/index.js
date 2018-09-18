import { connect } from 'react-redux';
import EditPlanTitleModal from './EditPlanTitleModal';
import { findEditingPlan } from '../../screens/PlanWizard/PlanWizardSelectors';
import * as EditPlanTitleActions from './EditPlanTitleActions';

import reducer from './EditPlanTitleReducer';

export const reducers = { editPlanTitle: reducer };

const mapStateToProps = ({ editPlanTitle, overview, form: { editPlanTitleModal } }) => {
  const plans = [...overview.transformationPlans, ...overview.archivedTransformationPlans];
  const editingPlan = findEditingPlan(plans, overview.editingPlanId);
  return {
    ...editPlanTitle,
    editPlanTitleModal,
    initialValues: {
      name: editingPlan ? editingPlan.name : '',
      description: editingPlan ? editingPlan.description : ''
    },
    enableReinitialize: true,
    editingPlan
  };
};

export default connect(
  mapStateToProps,
  EditPlanTitleActions
)(EditPlanTitleModal);
