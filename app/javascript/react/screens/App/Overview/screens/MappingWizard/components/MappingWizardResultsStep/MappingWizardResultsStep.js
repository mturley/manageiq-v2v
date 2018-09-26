import React from 'react';
import PropTypes from 'prop-types';
import { noop, Button, Spinner } from 'patternfly-react';

import { transformationHasBeenEdited } from './helpers';

class MappingWizardResultsStep extends React.Component {
  componentDidMount() {
    const {
      postMappingsUrl,
      postTransformMappingsAction,
      transformationsBody,
      editingMapping,
      updateTransformationMappingAction,
      targetProvider
    } = this.props;

    if (editingMapping) {
      if (transformationHasBeenEdited(editingMapping, transformationsBody, targetProvider)) {
        updateTransformationMappingAction(postMappingsUrl, editingMapping.id, transformationsBody);
      }
    } else {
      postTransformMappingsAction(postMappingsUrl, transformationsBody);
    }
  }

  renderLoadingState = (title, message) => (
    <div className="wizard-pf-process blank-slate-pf">
      <Spinner loading size="lg" className="blank-slate-pf-icon" />
      <h3 className="blank-slate-pf-main-action">{title}</h3>
      <p className="blank-slate-pf-secondary-action">{message}</p>
    </div>
  );

  renderErrorState = (title, message) => (
    <div className="wizard-pf-complete blank-slate-pf">
      <div className="wizard-pf-success-icon">
        <span className="pficon pficon-error-circle-o" />
      </div>
      <h3 className="blank-slate-pf-main-action">{title}</h3>
      <p className="blank-slate-pf-secondary-action">{message}</p>
    </div>
  );

  render() {
    const {
      isPostingMappings,
      isRejectedPostingMappings,
      isUpdatingMapping,
      transformationMappingsResult,
      errorPostingMappings, // eslint-disable-line no-unused-vars
      transformationsBody,
      continueToPlanAction
    } = this.props;

    if (isPostingMappings) {
      return this.renderLoadingState(
        __('Creating Infrastructure Mapping...'),
        __('Please wait while infrastructure mapping is created.')
      );
    } else if (isRejectedPostingMappings) {
      return this.renderErrorState(
        __('Error Creating Infrastructure Mapping'),
        __("We're sorry, something went wrong. Please try again.")
      );
    } else if (isUpdatingMapping) {
      return this.renderLoadingState(
        __('Saving Infrastructure Mapping...'),
        __('Please wait while infrastructure mapping is saved.')
      );
    } else if (transformationMappingsResult) {
      return (
        <div className="wizard-pf-complete blank-slate-pf">
          <div className="wizard-pf-success-icon">
            <span className="glyphicon glyphicon-ok-circle" />
          </div>
          <h3 className="blank-slate-pf-main-action">
            {sprintf(__('All mappings in %s have been mapped.'), transformationsBody.name)}
          </h3>
          <p className="blank-slate-pf-secondary-action">
            <Button bsStyle="link" onClick={() => continueToPlanAction(transformationMappingsResult.id)}>
              {__('Continue to the plan wizard')}
            </Button>
            {__('to create a migration plan using the infrastructure mapping.')}
          </p>
        </div>
      );
    }
    return null;
  }
}
MappingWizardResultsStep.propTypes = {
  postMappingsUrl: PropTypes.string,
  postTransformMappingsAction: PropTypes.func,
  transformationsBody: PropTypes.object,
  isPostingMappings: PropTypes.bool,
  isRejectedPostingMappings: PropTypes.bool,
  errorPostingMappings: PropTypes.object,
  transformationMappingsResult: PropTypes.object,
  continueToPlanAction: PropTypes.func,
  editingMapping: PropTypes.object,
  updateTransformationMappingAction: PropTypes.func,
  isUpdatingMapping: PropTypes.bool
};
MappingWizardResultsStep.defaultProps = {
  postMappingsUrl: 'api/transformation_mappings',
  postTransformMappingsAction: noop,
  transformationsBody: {},
  isPostingMappings: true,
  isRejectedPostingMappings: false,
  errorPostingMappings: null,
  transformationMappingsResult: null,
  continueToPlanAction: noop
};
export default MappingWizardResultsStep;
