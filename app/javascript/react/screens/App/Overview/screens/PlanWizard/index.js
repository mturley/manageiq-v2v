import { connect } from 'react-redux';
import PlanWizard from './PlanWizard';
import * as PlanWizardActions from './PlanWizardActions';
import { planWizardOverviewFilter, planWizardFormFilter } from './PlanWizardSelectors';
import { setMigrationsFilterAction, showConfirmModalAction, hideConfirmModalAction } from '../../OverviewActions';

import reducer from './PlanWizardReducer';

export const reducers = { planWizard: reducer };

// TODO [mturley] REMOVE ME -- this is a temporary hack used to force an API error for testing error handling.
const __justKiddingNoErrorsHere__ = form => ({
  ...form,
  planWizardGeneralStep: {
    ...form.planWizardGeneralStep,
    syncErrors: false,
    asyncErrors: false
  }
});

const mapStateToProps = ({ overview, planWizard, form }, ownProps) => {
  const selectedOverview = planWizardOverviewFilter(overview);
  const selectedForms = planWizardFormFilter(__justKiddingNoErrorsHere__(form)); // TODO [mturley] remove __justKiddingNoErrorsHere__
  return {
    ...planWizard,
    ...selectedOverview,
    ...selectedForms,
    ...ownProps.data
  };
};

const actions = {
  ...PlanWizardActions,
  setMigrationsFilterAction,
  showConfirmModalAction,
  hideConfirmModalAction
};

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(stateProps, ownProps.data, dispatchProps);

export default connect(
  mapStateToProps,
  actions,
  mergeProps
)(PlanWizard);
