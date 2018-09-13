export const getVMStepSelectedVms = (allVms, selectedVms) => allVms.filter(vm => selectedVms.includes(vm.id));

// Property can be 'pre_service' or 'post_service'.
// Returns an array of vm ids which have a truthy value for that property in the plan being edited.
export const getVmIdsWithProperty = (editingPlan, property, vmStepSelectedVms) => {
  const actions =
    editingPlan && editingPlan.options && editingPlan.options.config_info && editingPlan.options.config_info.actions;
  if (!actions) return [];
  const actionsWithProperty = actions.filter(action => action[property]);
  const vmIds = actionsWithProperty.map(action => action.vm_id);
  return vmIds.filter(id => vmStepSelectedVms.some(vm => vm.id === id));
};

export const preselectPlaybooksForVms = (editingPlan, vms) => {
  const vmIdsWithPreService = getVmIdsWithProperty(editingPlan, 'pre_service', vms);
  const vmIdsWithPostService = getVmIdsWithProperty(editingPlan, 'post_service', vms);
  return vms.map(vm => ({
    ...vm,
    preMigration: vmIdsWithPreService.some(id => id === vm.id),
    postMigration: vmIdsWithPostService.some(id => id === vm.id)
  }));
};
