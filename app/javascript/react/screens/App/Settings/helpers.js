export const getFormValuesFromApiSettings = payload => ({
  max_concurrent_tasks_per_host: payload.transformation.limits.max_concurrent_tasks_per_host,
  max_concurrent_tasks_per_ems: payload.transformation.limits.max_concurrent_tasks_per_ems,
/* FIXME: remove the comment once backend is ready
  cpu_limit_per_host: payload.transformation.limits.cpu_limit_per_host,
  network_limit_per_host: payload.transformation.limits.network_limit_per_host
*/
});

export const getApiSettingsFromFormValues = values => ({
  transformation: {
    limits: {
      max_concurrent_tasks_per_host: values.max_concurrent_tasks_per_host,
      max_concurrent_tasks_per_ems: values.max_concurrent_tasks_per_ems,
/* FIXME: remove the comment once backend is ready
      cpu_limit_per_host: values.cpu_limit_per_host,
      network_limit_per_host: values.network_limit_per_host
*/
    }
  }
});
