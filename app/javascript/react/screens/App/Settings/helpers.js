import { FINISHED, ERROR } from './screens/ConversionHostsSettings/ConversionHostsSettingsConstants';
import { RHV, OPENSTACK } from '../../../../common/constants';

export const getFormValuesFromApiSettings = payload => ({
  max_concurrent_tasks_per_host: payload.transformation.limits.max_concurrent_tasks_per_host,
  max_concurrent_tasks_per_ems: payload.transformation.limits.max_concurrent_tasks_per_ems
  /* FIXME: remove the comment once backend is ready
  cpu_limit_per_host: payload.transformation.limits.cpu_limit_per_host,
  network_limit_per_host: payload.transformation.limits.network_limit_per_host
  */
});

export const getApiSettingsFromFormValues = values => ({
  transformation: {
    limits: {
      max_concurrent_tasks_per_host: values.max_concurrent_tasks_per_host,
      max_concurrent_tasks_per_ems: values.max_concurrent_tasks_per_ems
      /* FIXME: remove the comment once backend is ready
      cpu_limit_per_host: values.cpu_limit_per_host,
      network_limit_per_host: values.network_limit_per_host
      */
    }
  }
});

export const parseConversionHostTasksMetadata = tasks => {
  // Example task name: "Configuring a conversion_host: operation=enable resource=(name: ims-conversion-host type: ManageIQ::Providers::Openstack::CloudManager::Vm id: 42000000000113)"
  const taskNameRegex = /operation=(\w+)\s+resource=\(name:\s(.+)\stype:\s+([\w:]+)\s+id:\s(.+)\)/;
  if (!tasks) return [];
  return tasks.map(task => {
    const result = taskNameRegex.exec(task.name);
    if (!result) return { ...task, meta: {} };
    const [, operation, resourceName, resourceType, resourceId] = result;
    return {
      ...task,
      meta: {
        isTask: true, // To distinguish when part of combinedListItems
        operation,
        resourceName,
        resourceType,
        resourceId,
        unparsedTaskName: task.name
      },
      name: resourceName, // For sorting and filtering,
      // TODO remove this when there are tasks with real context_data:
      context_data: {
        request_params: {
          vmware_vddk_package_url: 'mock/path',
          resource_type: 'ManageIQ::Providers::Redhat::InfraManager::Host',
          //resource_type: 'ManageIQ::Providers::Openstack::CloudManager::Vm',
          resource_id: '123456',
          name: 'mock-name'
        }
      }
    };
  });
};

export const indexConversionHostTasksByResource = tasksWithMetadata => {
  const tasksByResource = {};
  tasksWithMetadata.forEach(task => {
    if (!task.meta) return;
    const { resourceType: type, resourceId: id, operation } = task.meta;
    if (!tasksByResource[type]) tasksByResource[type] = {};
    if (!tasksByResource[type][id]) tasksByResource[type][id] = {};
    if (!tasksByResource[type][id][operation]) tasksByResource[type][id][operation] = [];
    tasksByResource[type][id][operation].push(task);
  });
  return tasksByResource;
};

const getActiveConversionHostEnableTasks = (tasksWithMetadata, conversionHosts) => {
  // Start with enable tasks that are either unfinished or finished with errors, and don't match any enabled hosts.
  const tasks = tasksWithMetadata.filter(
    task =>
      task.meta.operation === 'enable' &&
      (task.state !== FINISHED || task.status === ERROR) &&
      conversionHosts.every(
        ch => ch.resource.type !== task.meta.resourceType || ch.resource.id !== task.meta.resourceId
      )
  );
  // Filter to only the latest task for each resource (filter out old failures if a new task exists)
  return tasks.filter((task, index) =>
    tasks.every(
      (otherTask, otherIndex) =>
        otherIndex === index ||
        otherTask.meta.resourceType !== task.meta.resourceType ||
        otherTask.meta.resourceId !== task.meta.resourceId ||
        otherTask.updated_on <= task.updated_on
    )
  );
};

const attachTasksToConversionHosts = (conversionHosts, tasksByResource) =>
  conversionHosts.filter(conversionHost => !!conversionHost.resource).map(conversionHost => {
    const { type, id } = conversionHost.resource;
    return {
      ...conversionHost,
      meta: {
        tasksByOperation: (tasksByResource[type] && tasksByResource[type][id]) || {}
      }
    };
  });

export const getCombinedConversionHostListItems = (conversionHosts, tasksWithMetadata, tasksByResource) => {
  const activeEnableTasks = getActiveConversionHostEnableTasks(tasksWithMetadata, conversionHosts);
  const conversionHostsWithTasks = attachTasksToConversionHosts(conversionHosts, tasksByResource);
  return [...activeEnableTasks, ...conversionHostsWithTasks];
};

export const getConversionHostSshKeyInfoMessage = selectedProviderType => {
  if (selectedProviderType === RHV) {
    return __('RHV-M deploys a common SSH public key on all hosts when configuring them. This allows commands and playbooks to be run from RHV-M. The associated private key is in the file /etc/pki/ovirt-engine/keys/engine_id_rsa on RHV-M.'); // prettier-ignore
  }
  if (selectedProviderType === OPENSTACK) {
    return __('This is the private key file used to connect to the conversion host instance for the OpenStack User.');
  }
  return '';
};
