# # myapp/views.py

from .views import *

# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from rest_framework.views import APIView
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .shopify_service import get_orders
# from rest_framework import status

# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.exceptions import InvalidToken
# from rest_framework.exceptions import AuthenticationFailed

# # Public route - no JWT required
# class OrderListView(APIView):
#     """Fetch all orders """
#     def get(self, request):
#         limit = request.GET.get("limit", 10)
#         page_info = request.GET.get("page_info", None)
        
#         data = get_orders(limit=int(limit), page_info=page_info)
        
#         return Response(data, status=status.HTTP_200_OK)

# # Private route - JWT required
# class PrivateView(APIView):
#     permission_classes = [IsAuthenticated]  # Require JWT for access

#     def get(self, request):
#         return Response({"message": "This is a private route, only accessible with JWT!"})
    

# # Custom Token Obtain View to modify the response format and handle failed authentication
# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class = TokenObtainPairSerializer

#     def post(self, request, *args, **kwargs):
#         try:
#             # Attempt to obtain the token by calling the parent class's post method
#             response = super().post(request, *args, **kwargs)
#             data = response.data
#             # If the authentication is successful, customize the response
#             return Response({
#                 'status': 'success',
#                 'message': 'Token obtained successfully',
#                 'data': {
#                     'access_token': data['access'],
#                     'refresh_token': data['refresh']
#                 }
#             })

#         except AuthenticationFailed as e:
#             # If authentication fails, catch the exception and return a custom response
#             return Response({
#                 'status': 'error',
#                 'message': 'Invalid credentials',
#                 'error': str(e),
#                 'data': {}
#             }, status=401)


# # Custom Token Refresh View to modify the response format
# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         # Use default refresh token serializer
#         refresh = request.data.get('refresh')
#         try:
#             token = RefreshToken(refresh)
#             new_access_token = str(token.access_token)
#             return Response({
#                 'status': 'success',
#                 'message': 'Token refreshed successfully',
#                 'data': {
#                     'access_token': new_access_token
#                 }
#             })
#         except InvalidToken:
#             return Response({
#                 'status': 'error',
#                 'message': 'Invalid refresh token',
#                 'data': {}
#             }, status=400)
