import { getMappingType } from '../../../Mappings/components/InfrastructureMappingsList/helpers';
import { TRANSFORMATION_MAPPING_ITEM_DESTINATION_TYPES } from '../../../../../../common/constants';

export const findEditingPlan = (transformationPlans, editingPlanId) =>
  editingPlanId && transformationPlans.find(plan => plan.id === editingPlanId);

export const planWizardOverviewFilter = overview => ({
  hidePlanWizard: overview.hidePlanWizard,
  transformationMappings: overview.transformationMappings,
  editingPlan: findEditingPlan(overview.transformationPlans, overview.editingPlanId)
});

export const planWizardFormFilter = form => ({
  planWizardGeneralStep: form.planWizardGeneralStep,
  planWizardVMStep: form.planWizardVMStep,
  planWizardInstancePropertiesStep: form.planWizardInstancePropertiesStep,
  planWizardAdvancedOptionsStep: form.planWizardAdvancedOptionsStep,
  planWizardScheduleStep: form.planWizardScheduleStep
});

export const getTargetProviderType = ({ form, overview: { transformationMappings } }) => {
  const mappingId =
    form.planWizardGeneralStep &&
    form.planWizardGeneralStep.values &&
    form.planWizardGeneralStep.values.infrastructure_mapping;
  const selectedMapping = transformationMappings.find(mapping => mapping.id === mappingId);
  return selectedMapping && getMappingType(selectedMapping.transformation_mapping_items);
};

export const getWarmMigrationCompatibility = ({
  planWizardVMStep: { valid_vms, invalid_vms, conflict_vms },
  overview: { transformationMappings },
  form: {
    planWizardGeneralStep: { values: generalStepValues },
    planWizardVMStep: { values: vmStepValues }
  },
  targetResources: { isFetchingTargetClusters, targetClusters },
  settings: { isFetchingConversionHosts, conversionHosts },
  targetProviderType
}) => {
  if (isFetchingTargetClusters || isFetchingConversionHosts) {
    return { isFetchingTargetValidationData: true, shouldEnableWarmMigration: false };
  }

  const vms = [...valid_vms, ...invalid_vms, ...conflict_vms].filter(vm => vmStepValues.selectedVms.includes(vm.id));
  const isEveryVmCompatible = vms.every(vm => vm.warm_migration_compatible);

  const selectedMapping = transformationMappings.find(map => map.id === generalStepValues.infrastructure_mapping);
  const targetClusterType = TRANSFORMATION_MAPPING_ITEM_DESTINATION_TYPES[targetProviderType].cluster;
  const targetClustersInSelectedMapping = selectedMapping.transformation_mapping_items
    .filter(mappingItem => mappingItem.destination_type === targetClusterType)
    .map(mappingItem => targetClusters.find(cluster => cluster.id === mappingItem.destination_id));

  console.log('warm migration compat?', {
    selectedMapping,
    targetProviderType,
    targetClusters,
    conversionHosts,
    targetClustersInSelectedMapping,
    vms
  });

  // * Figure out a list of the target clusters associated with the selected VMs
  //   - For each mapping item of the corresponding destination_type (EmsCluster or CloudTenant) find the matching cluster by destination_id (use TRANSFORMATION_MAPPING_ITEM_DESTINATION_TYPES)
  //   - Filter by associated VM? how does this work? <----- ???
  // * For every cluster (.every()):
  //   - Figure out the EMS id of each target cluster (use ems_id of the loaded cluster object)
  //   - Find conversion hosts whose resource have that EMS id
  //   - Check that there is at least one configured for VDDK

  const shouldEnableWarmMigration = isEveryVmCompatible; // TODO && ...
  return { isFetchingTargetValidationData: false, isEveryVmCompatible, shouldEnableWarmMigration };
};
