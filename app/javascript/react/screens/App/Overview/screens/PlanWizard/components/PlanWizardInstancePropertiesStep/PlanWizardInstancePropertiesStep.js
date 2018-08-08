import React, { Component } from 'react';
import PlanWizardInstancePropertiesStepTable from './components/PlanWizardInstancePropertiesStepTable';

class PlanWizardInstancePropertiesStep extends Component {
  render() {
    return (
      <PlanWizardInstancePropertiesStepTable
        rows={[]}
      />
    );
  }
}

PlanWizardInstancePropertiesStep.propTypes = {};

export default PlanWizardInstancePropertiesStep;
