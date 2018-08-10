import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import PlanWizardInstancePropertiesStepTable from './components/PlanWizardInstancePropertiesStepTable';

class PlanWizardInstancePropertiesStep extends Component {
  render() {
    const { vmStepSelectedVms } = this.props;
    return (
      <Field
        name="ospInstanceProperties"
        component={PlanWizardInstancePropertiesStepTable}
        rows={vmStepSelectedVms}
      />
    );
  }
}

PlanWizardInstancePropertiesStep.propTypes = {
  vmStepSelectedVms: PropTypes.array,
};

export default reduxForm({
  form: 'planWizardInstancePropertiesStep',
  initialValues: {

  },
  destroyOnUnmount: false
})(PlanWizardInstancePropertiesStep);
