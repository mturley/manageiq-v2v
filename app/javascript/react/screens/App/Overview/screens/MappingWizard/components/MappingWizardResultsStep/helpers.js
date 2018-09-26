const sourceHrefSlugs = {
  EmsCluster: '/api/clusters/',
  Storage: '/api/data_stores/',
  Lan: '/api/lans/'
};

const destinationHrefSlugs = {
  openstack: {
    CloudTenant: '/api/cloud_tenants/',
    CloudVolume: '/api/cloud_volumes/',
    CloudNetwork: '/api/cloud_networks/'
  },
  rhevm: {
    EmsCluster: '/api/clusters/',
    Storage: '/api/data_stores/',
    Lan: '/api/lans/'
  }
};

const normalizeTransformationItem = (transformationItem, targetProvider) => ({
  source: sourceHrefSlugs[transformationItem.source_type] + transformationItem.source_id,
  destination:
    destinationHrefSlugs[targetProvider][transformationItem.destination_type] + transformationItem.destination_id
});

export const transformationHasBeenEdited = (transformation, postBody, targetProvider) => {
  console.log('target provideer', targetProvider);
  transformation.transformation_mapping_items.forEach(item =>
    console.log(normalizeTransformationItem(item, targetProvider))
  );
  console.log('post body', postBody);
};
