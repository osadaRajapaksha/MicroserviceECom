resource "random_id" "storage_account" {
  byte_length = 8
}

resource "azurerm_storage_account" "frontend" {
  name                     = "frontend${lower(random_id.storage_account.hex)}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }
}

resource "azurerm_cdn_profile" "frontend" {
  name                = "frontend-cdn-profile"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "frontend" {
  name                = "frontend-cdn-endpoint-${lower(random_id.storage_account.hex)}"
  profile_name        = azurerm_cdn_profile.frontend.name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  origin {
    name      = "frontend-origin"
    host_name = azurerm_storage_account.frontend.primary_web_host
  }

  origin_host_header = azurerm_storage_account.frontend.primary_web_host
}
