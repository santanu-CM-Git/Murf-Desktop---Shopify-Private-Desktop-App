from rest_framework import serializers
from shop_api.models import ShopifyStore

class ShopifyStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopifyStore
        fields = ['id', 'store_url', 'admin_api_key', 'is_primary']
        read_only_fields = ['id', 'is_primary']

    def validate_store_url(self, value):
        """Ensure the store URL is a valid Shopify store URL."""
        if not value.endswith('.myshopify.com'):
            raise serializers.ValidationError("Store URL must end with '.myshopify.com'")
        return value

    def validate_admin_api_key(self, value):
        """Validate the Shopify Admin API key (placeholder for actual validation)."""
        if len(value) < 10:
            raise serializers.ValidationError("Admin API key is too short")
        return value

class SetPrimaryStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopifyStore
        fields = ['is_primary']