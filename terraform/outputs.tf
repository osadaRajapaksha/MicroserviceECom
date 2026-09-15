output "cluster_endpoint" {
  description = "Endpoint for AKS control plane."
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.host
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster."
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.cluster_ca_certificate
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "acr_login_server" {
  description = "Login server for the Azure Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

output "cdn_endpoint" {
  description = "Endpoint for the Azure CDN"
  value       = azurerm_cdn_endpoint.frontend.fqdn
}
