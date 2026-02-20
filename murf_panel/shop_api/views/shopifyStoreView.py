# DEMO VERSION - Implementation code removed for copy protection
# This file demonstrates the structure of Shopify Store API views

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from shop_api.models import ShopifyStore
from shop_api.serializers import ShopifyStoreSerializer, SetPrimaryStoreSerializer

class ShopifyStoreAPIView(APIView):
    """
    API endpoint for managing Shopify stores.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        List all Shopify stores for the authenticated user.
        Implementation removed for demo version.
        """
        # Implementation removed for copy protection
        return Response({
            "status": "error",
            "message": "Demo version - functionality disabled"
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    def post(self, request):
        """
        Add a new Shopify store for the authenticated user.
        Implementation removed for demo version.
        """
        # Implementation removed for copy protection
        return Response({
            "status": "error",
            "message": "Demo version - functionality disabled"
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class SetPrimaryStoreAPIView(APIView):
    """
    API endpoint to set a store as primary.
    """
    def patch(self, request, pk):
        """
        Set a store as the primary store for the authenticated user.
        Implementation removed for demo version.
        """
        # Implementation removed for copy protection
        return Response({
            "status": "error",
            "message": "Demo version - functionality disabled"
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
