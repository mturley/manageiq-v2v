import { connect } from 'react-redux';
import PlanWizardScheduleStep from './PlanWizardScheduleStep';
import { getTargetProviderType, getWarmMigrationCompatibility } from '../../PlanWizardSelectors';
import { showAlertAction, hideAlertAction } from '../../PlanWizardActions';

const mapStateToProps = ({ planWizardVMStep, overview, form, targetResources, settings }) => {
  const targetProviderType = getTargetProviderType({ form, overview });
  return {
    targetProvider: targetProviderType, // TODO rename this prop to targetProviderType
    migration_plan_choice_radio:
      form.planWizardScheduleStep &&
      form.planWizardScheduleStep.values &&
      form.planWizardScheduleStep.values.migration_plan_choice_radio,
    migration_plan_type_radio:
      form.planWizardScheduleStep &&
      form.planWizardScheduleStep.values &&
      form.planWizardScheduleStep.values.migration_plan_type_radio,
    initialValues: {
      migration_plan_choice_radio: 'migration_plan_later',
      migration_plan_type_radio: 'migration_type_cold'
    },
    warmMigrationCompatibility: getWarmMigrationCompatibility({
      planWizardVMStep,
      form,
      overview,
      targetResources,
      settings,
      targetProviderType
    })
  };
};

export default connect(
  mapStateToProps,
  { showAlertAction, hideAlertAction }
)(PlanWizardScheduleStep);
