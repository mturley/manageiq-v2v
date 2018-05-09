import React from 'react';
import PropTypes from 'prop-types';
import { bindMethods, noop, Button, Icon, Wizard } from 'patternfly-react';
import { createMigrationPlans } from './helpers';
import PlanWizardBody from './PlanWizardBody';

import componentRegistry from '../../../../../../components/componentRegistry';
import PlanWizardGeneralStep from '../PlanWizard/components/PlanWizardGeneralStep';
import PlanWizardOptionsStep from '../PlanWizard/components/PlanWizardOptionsStep';

const planWizardSteps = [
  'planWizardGeneralStep',
  'planWizardVMStep',
  'planWizardOptionsStep',
  'planWizardResultsStep'
];

class PlanWizard extends React.Component {
  constructor() {
    super();
    this.planWizardVMStepContainer = componentRegistry.markup(
      'PlanWizardVMStepContainer'
    );
    this.planWizardResultsStepContainer = componentRegistry.markup(
      'PlanWizardResultsStepContainer'
    );
    this.state = { activeStepIndex: 0 };
    bindMethods(this, ['prevStep', 'nextStep', 'goToStep']);
  }

  prevStep() {
    const { resetVmStepAction } = this.props;
    const { activeStepIndex } = this.state;

    if (activeStepIndex === 1) {
      // reset all vm step values if going back from that step
      resetVmStepAction();
    }
    this.setState({ activeStepIndex: Math.max(activeStepIndex - 1, 0) });
  }

  nextStep() {
    const { activeStepIndex } = this.state;
    const {
      planWizardGeneralStep,
      planWizardVMStep,
      planWizardOptionsStep,
      setPlansBodyAction,
      setPlanScheduleAction,
      setMigrationsFilterAction
    } = this.props;

    if (activeStepIndex === 2) {
      const plansBody = createMigrationPlans(
        planWizardGeneralStep,
        planWizardVMStep
      );

      setPlanScheduleAction(
        planWizardOptionsStep.values.migration_plan_choice_radio
      );
      setPlansBodyAction(plansBody);
      console.log('uhh.. set plansBody action?', plansBody);

      if (
        planWizardOptionsStep.values.migration_plan_choice_radio ===
        'migration_plan_now'
      ) {
        setMigrationsFilterAction('Migration Plans in Progress');
      } else if (
        planWizardOptionsStep.values.migration_plan_choice_radio ===
        'migration_plan_later'
      ) {
        setMigrationsFilterAction('Migration Plans Not Started');
      }
    }

    this.setState({
      activeStepIndex: Math.min(activeStepIndex + 1, planWizardSteps.length - 1)
    });
  }

  goToStep(activeStepIndex) {
    this.setState({ activeStepIndex });
  }

  render() {
    const {
      hidePlanWizard,
      hidePlanWizardAction,
      planWizardExitedAction,
      planWizardGeneralStep,
      planWizardVMStep,
      planWizardOptionsStep
    } = this.props;

    const { activeStepIndex, plansBody } = this.state;
    const activeStep = (activeStepIndex + 1).toString();
    const onFirstStep = activeStepIndex === 0;
    const onFinalStep = activeStepIndex === planWizardSteps.length - 1;

    const currentStepProp = !onFinalStep && planWizardSteps[activeStepIndex];
    const currentStepForm = !onFinalStep && this.props[currentStepProp];

    const disableNextStep =
      (!onFinalStep && !!currentStepForm.syncErrors) ||
      (activeStepIndex === 1 &&
        (!this.props.planWizardVMStep.values ||
          !this.props.planWizardVMStep.values.selectedVms ||
          this.props.planWizardVMStep.values.selectedVms.length === 0));

    const old = true;

    if (old) {
      return (
        <Wizard
          show={!hidePlanWizard}
          onClose={hidePlanWizardAction}
          onExited={planWizardExitedAction}
        >
          <Wizard.Header
            onClose={hidePlanWizardAction}
            title={__('Migration Plan Wizard')}
          />

          <Wizard.Body>
            <PlanWizardBody
              loaded
              activeStepIndex={activeStepIndex}
              activeStep={activeStep}
              goToStep={this.goToStep}
              disableNextStep={disableNextStep}
              planWizardGeneralStep={planWizardGeneralStep}
              planWizardVMStep={planWizardVMStep}
              planWizardOptionsStep={planWizardOptionsStep}
            />
          </Wizard.Body>

          <Wizard.Footer className="wizard-pf-footer">
            <Button
              bsStyle="default"
              className="btn-cancel"
              onClick={hidePlanWizardAction}
            >
              {__('Cancel')}
            </Button>
            <Button
              bsStyle="default"
              onClick={this.prevStep}
              disabled={onFirstStep || onFinalStep}
            >
              <Icon type="fa" name="angle-left" />
              {__('Back')}
            </Button>
            <Button
              bsStyle="primary"
              onClick={onFinalStep ? hidePlanWizardAction : this.nextStep}
              disabled={disableNextStep}
            >
              {onFinalStep
                ? __('Close')
                : activeStepIndex === 2
                  ? __('Create')
                  : __('Next')}
              <Icon type="fa" name="angle-right" />
            </Button>
          </Wizard.Footer>
        </Wizard>
      );
    }
    
    return (
      <Wizard.Pattern
        show={!hidePlanWizard}
        onHide={hidePlanWizardAction}
        onExited={planWizardExitedAction}
        title={__('Migration Plan Wizard')}
        // nextStepDisabled={false}
        steps={[
          {
            title: __('General'),
            render: () => <PlanWizardGeneralStep />
          },
          {
            title: __('VMs'),
            render: () => this.planWizardVMStepContainer
          },
          {
            title: __('Options'),
            render: () => <PlanWizardOptionsStep />,
          },
          {
            title: __('Results'),
            render: () => this.planWizardResultsStepContainer
          }
        ]}
        // loadingTitle={__('Loading Migration Plans...')}
        // loadingMessage={__('This may take a minute.')}
        stepButtonsDisabled
        onStepChanged={this.goToStep}
        loading={false}
        activeStepIndex={activeStepIndex}
      />
    );
  }
}
PlanWizard.propTypes = {
  hidePlanWizard: PropTypes.bool,
  hidePlanWizardAction: PropTypes.func,
  planWizardExitedAction: PropTypes.func,
  planWizardGeneralStep: PropTypes.object,
  planWizardVMStep: PropTypes.object,
  planWizardOptionsStep: PropTypes.object,
  setPlansBodyAction: PropTypes.func,
  setPlanScheduleAction: PropTypes.func,
  resetVmStepAction: PropTypes.func,
  setMigrationsFilterAction: PropTypes.func
};
PlanWizard.defaultProps = {
  hidePlanWizard: true,
  hidePlanWizardAction: noop,
  planWizardExitedAction: noop,
  planWizardGeneralStep: {},
  planWizardVMStep: {},
  planWizardOptionsStep: {},
  setPlansBodyAction: noop,
  setPlanScheduleAction: noop,
  resetVmStepAction: noop
};
export default PlanWizard;
