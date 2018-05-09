import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import ModalWizard from '../../components/ModalWizard'; // TODO:MJT delete this !!
import componentRegistry from '../../../../../../components/componentRegistry';
import PlanWizardGeneralStep from '../PlanWizard/components/PlanWizardGeneralStep';
import PlanWizardOptionsStep from '../PlanWizard/components/PlanWizardOptionsStep';

//// --> TODO:MJT probably just delete this entire file <-- ////

class PlanWizardBody extends React.Component {
  constructor(props) {
    super(props);

    this.planWizardVMStepContainer = componentRegistry.markup(
      'PlanWizardVMStepContainer'
    );
    this.planWizardResultsStepContainer = componentRegistry.markup(
      'PlanWizardResultsStepContainer'
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }
  render() {
    return (
      <ModalWizard.Body // TODO:MJT delete me
        {...this.props}
        loadingTitle={__('Loading Migration Plans...')}
        loadingMessage={__('This may take a minute.')}
        stepButtonsDisabled
        steps={[
          {
            title: __('General'),
            render: () => <PlanWizardGeneralStep />,
            disableGoto: !this.props.planWizardGeneralStep.values
          },
          {
            title: __('VMs'),
            render: () => this.planWizardVMStepContainer,
            disableGoto: !this.props.planWizardVMStep.values
          },
          {
            title: __('Options'),
            render: () => <PlanWizardOptionsStep />,
            disableGoto: true
          },
          {
            title: __('Results'),
            render: () => this.planWizardResultsStepContainer,
            disableGoto: true
          }
        ]}
      />
    );
  }
}

PlanWizardBody.propTypes = {
  loaded: PropTypes.bool,
  activeStepIndex: PropTypes.number,
  activeStep: PropTypes.string,
  goToStep: PropTypes.func,
  disableNextStep: PropTypes.bool,
  plansBody: PropTypes.object, // what the hell is this even? it is not used...
  planWizardGeneralStep: PropTypes.object,
  planWizardVMStep: PropTypes.object
};

PlanWizardBody.defaultProps = {
  loaded: false,
  activeStepIndex: 0,
  activeStep: '1',
  goToStep: noop,
  disableNextStep: true,
  plansBody: {}, // what the hell is this even? it is not used...
  planWizardGeneralStep: {},
  planWizardVMStep: {}
};

export default PlanWizardBody;
