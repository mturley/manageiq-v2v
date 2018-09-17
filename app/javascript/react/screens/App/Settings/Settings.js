import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Breadcrumb, Form, Grid } from 'patternfly-react';
import Toolbar from '../../../config/Toolbar';
import { FormField } from '../common/forms/FormField';

class Settings extends React.Component {
  componentDidMount() {
    const { fetchSettingsAction } = this.props;
    fetchSettingsAction('TODO: url here'); // TODO
  }
  render() {
    const toolbarContent = (
      <Toolbar>
        <Breadcrumb.Item href="/dashboard/maintab?tab=compute">{__('Compute')}</Breadcrumb.Item>
        <Breadcrumb.Item href="#/">{__('Migration')}</Breadcrumb.Item>
        <Breadcrumb.Item active>{__('Migration Settings')}</Breadcrumb.Item>
      </Toolbar>
    );

    const { settingsForm } = this.props;
    const throttlingEnabled = settingsForm && settingsForm.values && settingsForm.values.throttlingEnabled;

    const settingsContent = (
      <div className="migration-settings">
        <h2>{__('Resource Utilization Limits for Migrations')}</h2>
        <Form horizontal>
          <Field
            name="throttlingEnabled"
            label={__('Migration throttling')}
            component={FormField}
            type="switch"
            labelWidth="3"
          />
          <div className={!throttlingEnabled ? 'fields-disabled' : ''}>
            <Form.FormGroup>
              <Grid.Col componentClass={Form.ControlLabel} sm={3}>
                {__('Total network throughput')}
              </Grid.Col>
              <Grid.Col sm={9}>
                <Field name="networkThroughput" component="input" disabled={!throttlingEnabled} />
                {__(' MB / s')}
              </Grid.Col>
            </Form.FormGroup>
            <Form.FormGroup>
              <Grid.Col componentClass={Form.ControlLabel} sm={3}>
                {__('Block storage I/O bandwidth')}
              </Grid.Col>
              <Grid.Col sm={9}>
                <Field name="blockStorageBandwidth" component="input" disabled={!throttlingEnabled} />
                {__(' KB / s')}
              </Grid.Col>
            </Form.FormGroup>
            <Form.FormGroup>
              <Grid.Col componentClass={Form.ControlLabel} sm={3}>
                {__('CPU utilization')}
              </Grid.Col>
              <Grid.Col sm={9}>
                <Field name="cpuUtilization" component="input" disabled={!throttlingEnabled} />
                {__(' % (for each conversion host)')}
              </Grid.Col>
            </Form.FormGroup>
          </div>
        </Form>
      </div>
    );

    return (
      <React.Fragment>
        {toolbarContent}
        {settingsContent}
      </React.Fragment>
    );
  }
}

Settings.propTypes = {
  fetchSettingsAction: PropTypes.func,
  settingsForm: PropTypes.object
};

export default reduxForm({
  form: 'settings'
})(Settings);
