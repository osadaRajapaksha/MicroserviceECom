variable "location" {
  description = "The Azure Region to deploy resources"
  type        = string
  default     = "East US"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "MicroserviceECom-rg"
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
  default     = "MyEcomCluster"
}

variable "vnet_address_space" {
  description = "The address space for the VNet"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "node_vm_size" {
  description = "VM size for AKS node pool"
  type        = string
  default     = "Standard_D2_v2"
}

variable "acr_repositories" {
  description = "List of ACR repositories to create"
  type        = list(string)
  default = [
    "discovery-server",
    "api-gateway",
    "product-service",
    "order-service",
    "inventory-service"
  ]
}
