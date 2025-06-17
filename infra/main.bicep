targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = 'eastus'
// param appLocation string = 'eastasia'

param openAiServiceName string = 'cog-t2zsveh4suvfe'
param openAiResourceGroupName string = 'rg-innochat'
param openAIEmbeddingDeploymentName string = 'embedding'
param openAIChatDeploymentName string = 'chat'
param openAIChatModelName string = 'gpt-35-turbo'

param searchServiceName string =  'gptkb-7eddyrxvmdlco'
param searchServiceResourceGroupName string = 'rg-innochat'
param searchIndexName string = 'clic-index'

// param appServicePlanName string = 'ASP-rgclicsearch-a620'
// param webappName string = 'clicsearch'

// Tags that should be applied to all resources.
// 
// Note that 'azd-service-name' tags should be applied separately to service host resources.
// Example usage:
//   tags: union(tags, { 'azd-service-name': <service name in azure.yaml> })
var tags = {
  'azd-env-name': environmentName
}

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

// // Create an App Service Plan to group applications under the same payment plan and SKU
// module appServicePlan 'host/appserviceplan.bicep' = {
//   name: 'appserviceplan'
//   scope: rg
//   params: {
//     name: appServicePlanName
//     location: appLocation
//     tags: tags
//     sku: {
//       name: 'B1'
//       capacity: 1
//     }
//     kind: 'linux'
//   }
// }

// // The application frontend
// module webapp 'host/appservice.bicep' = {
//   name: 'web'
//   scope: rg
//   params: {
//     name: webappName
//     location: location
//     tags: union(tags, { 'azd-service-name': 'backend' })
//     appServicePlanId: appServicePlan.outputs.id
//     runtimeName: 'python'
//     runtimeVersion: '3.10'
//     scmDoBuildDuringDeployment: true
//     managedIdentity: true
//     appSettings: {
//       AZURE_OPENAI_EMB_DEPLOYMENT: openAIEmbeddingDeploymentName
//       AZURE_OPENAI_RESOURCE_GROUP: openAiResourceGroupName
//       AZURE_OPENAI_SERVICE: openAiServiceName
//       AZURE_RESOURCE_GROUP: rg.name
//       AZURE_SEARCH_INDEX: searchIndexName
//       AZURE_SEARCH_SERVICE: searchServiceName
//       AZURE_SEARCH_SERVICE_RESOURCE_GROUP: searchServiceResourceGroupName
//     }
//   }
// }


output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = rg.name

output AZURE_OPENAI_SERVICE string = openAiServiceName
output AZURE_OPENAI_RESOURCE_GROUP string = openAiResourceGroupName
output AZURE_OPENAI_EMB_DEPLOYMENT string = openAIEmbeddingDeploymentName
output AZURE_OPENAI_CHATGPT_DEPLOYMENT string = openAIChatDeploymentName
output AZURE_OPENAI_CHATGPT_MODEL string = openAIChatModelName

output AZURE_SEARCH_INDEX string = searchIndexName
output AZURE_SEARCH_SERVICE string = searchServiceName
output AZURE_SEARCH_SERVICE_RESOURCE_GROUP string = searchServiceResourceGroupName

// output WEBAPP_URI string = webapp.outputs.uri
