import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field, reduxForm } from 'redux-form';
import { required } from 'redux-form-validators';
import { Modal, Button, Form, Alert, Spinner, noop } from 'patternfly-react';
import { FormField } from '../../../common/forms/FormField';
import { validation } from '../../../../../../common/constants';
import { asyncValidate, onChange } from '../../screens/PlanWizard/components/PlanWizardGeneralStep/helpers';

class EditPlanTitleModal extends React.Component {
  onSubmit = () => {
    const {
      editPlanTitleModal,
      editingPlan,
      editMigrationPlansAction,
      editMigrationPlansUrl,
      hideEditPlanTitleModalAction,
      fetchTransformationPlansAction,
      fetchTransformationPlansUrl,
      fetchArchivedTransformationPlansUrl
    } = this.props;
    const {
      values: { name, description }
    } = editPlanTitleModal;
    const resource = { name, description };
    editMigrationPlansAction(editMigrationPlansUrl, editingPlan.id, resource).then(() => {
      hideEditPlanTitleModalAction();
      fetchTransformationPlansAction({
        url: fetchTransformationPlansUrl,
        archived: false
      });
      fetchTransformationPlansAction({
        url: fetchArchivedTransformationPlansUrl,
        archived: true
      });
    });
  };

  render() {
    const {
      editPlanTitleModalVisible,
      hideEditPlanTitleModalAction,
      editPlanTitleModal,
      alertType,
      alertText,
      hideAlertAction,
      savingPlan
    } = this.props;

    const disableConfirmButton = savingPlan || !!editPlanTitleModal.syncErrors || !!editPlanTitleModal.asyncErrors;
    const alertClasses = cx('modal-alert--alert', {
      'is-visible': alertText
    });

    const formBody = (
      <Form horizontal>
        <Field
          name="name"
          label={__('Name')}
          required
          component={FormField}
          type="text"
          help={validation.name.help}
          maxLength={validation.name.maxLength}
          maxLengthWarning={validation.name.maxLengthWarning}
          validate={[
            required({
              msg: validation.name.requiredMessage
            })
          ]}
        />
        <Field
          name="description"
          label={__('Description')}
          component={FormField}
          type="textarea"
          help={validation.description.help}
          maxLength={validation.description.maxLength}
          maxLengthWarning={validation.description.maxLengthWarning}
        />
      </Form>
    );

    const spinner = (
      <div style={{ marginTop: 15 }}>
        <Spinner loading size="lg" />
        <h2 style={{ textAlign: 'center' }}>{__('Saving...')}</h2>
      </div>
    );

    return (
      <Modal show={editPlanTitleModalVisible} onHide={hideEditPlanTitleModalAction}>
        <Modal.Header>
          <Modal.CloseButton onClick={hideEditPlanTitleModalAction} />
          <Modal.Title>{__('Edit Migration Plan')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!savingPlan ? formBody : spinner}
          <div className="modal-alert">
            <Alert className={alertClasses} type={alertType} onDismiss={hideAlertAction}>
              {alertText}
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" className="btn-cancel" onClick={hideEditPlanTitleModalAction}>
            {__('Cancel')}
          </Button>
          <Button bsStyle="primary" onClick={this.onSubmit} disabled={disableConfirmButton}>
            {__('Save')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditPlanTitleModal.propTypes = {
  editPlanTitleModalVisible: PropTypes.bool,
  hideEditPlanTitleModalAction: PropTypes.func,
  editPlanTitleModal: PropTypes.object,
  alertType: PropTypes.string,
  alertText: PropTypes.string,
  hideAlertAction: PropTypes.func,
  editingPlan: PropTypes.object,
  editMigrationPlansAction: PropTypes.func,
  editMigrationPlansUrl: PropTypes.string,
  savingPlan: PropTypes.bool.isRequired,
  fetchTransformationPlansAction: PropTypes.func,
  fetchTransformationPlansUrl: PropTypes.string,
  fetchArchivedTransformationPlansUrl: PropTypes.string
};

EditPlanTitleModal.defaultProps = {
  editPlanTitleModalVisible: false,
  hideEditPlanTitleModalAction: noop,
  editPlanTitleModal: {},
  alertType: 'error',
  alertText: '',
  hideAlertAction: noop,
  editMigrationPlansUrl: '/api/service_templates'
};

export default reduxForm({
  form: 'editPlanTitleModal',
  asyncValidate,
  asyncBlurFields: ['name'],
  onChange
})(EditPlanTitleModal);
