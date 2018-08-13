import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import PlanWizardInstancePropertiesStepTable from './components/PlanWizardInstancePropertiesStepTable';
import { OSP_TENANT } from '../../../../OverviewConstants';
import { fetchOpenstackFlavorsAction, fetchOpenstackSecurityGroupsAction } from './PlanWizardInstancePropertiesStepActions';

class PlanWizardInstancePropertiesStep extends Component {
  componentDidMount() {
    const {
      selectedMapping,
      fetchOpenstackAttributesUrl,
      fetchOpenstackSecurityGroupsParams,
      fetchOpenstackFlavorsParams,
    } = this.props;

    const targetTenant = selectedMapping && selectedMapping.transformation_mapping_items &&
      selectedMapping.transformation_mapping_items.find(item => item.destination_type === OSP_TENANT);

    console.log('dispatch', dispatch);
    if (targetTenant) {
      fetchOpenstackSecurityGroupsAction(
        fetchOpenstackAttributesUrl,
        targetTenant.destination_id,
        fetchOpenstackSecurityGroupsParams
      );
      fetchOpenstackFlavorsAction(
        fetchOpenstackAttributesUrl,
        targetTenant.destination_id,
        fetchOpenstackFlavorsParams
      );
    }
  }

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
  fetchOpenstackAttributesUrl: PropTypes.string,
  fetchOpenstackSecurityGroupsParams: PropTypes.string,
  fetchOpenstackFlavorsParams: PropTypes.string,
  selectedMapping: PropTypes.object
};

export default reduxForm({
  form: 'planWizardInstancePropertiesStep',
  initialValues: {

  },
  destroyOnUnmount: false
})(PlanWizardInstancePropertiesStep);
