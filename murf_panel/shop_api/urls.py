# myapp/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    # #######################   Order Route Start    #####################
    path("orders/current-month-sale", CurrentMonthSaleAPIView.as_view(), name="current_month_sale"),
    path("orders/export-orders-excel", ExportOrdersView.as_view(), name="export_orders_excel"),
    path("orders/export-orders-qb", QBExportOrdersView.as_view(), name="qb_export_orders_excel"),
    path('orders', OrderListView.as_view(), name='public-view'),  # Public route
    path('orders/total', OrderCountView.as_view(), name='total-orders'),  # Public route
    # #######################   Order Route End    #####################
   
    path('private/', PrivateView.as_view(), name='private-view'),  # Private route (JWT required)
    
    # JWT authentication endpoints (customized)
    path('token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('profile', UserDataView.as_view(), name='user_data'),
     path('change-password', ChangePasswordView.as_view(), name='change_password'),

    # Department endpoints
    path('departments', DepartmentListCreateView.as_view(), name='department_list_create'),
    path('departments/<int:pk>', DepartmentDetailView.as_view(), name='department_detail'),

    # Staff endpoints
    path('staff', StaffMemberListCreateView.as_view(), name='staff_list_create'),
    path('staff/<int:pk>', StaffMemberDetailView.as_view(), name='staff_detail'),

    #   account-mappings 
    path('account-mappings', AccountMappingListCreateView.as_view(), name='account_mapping_create'),
    path('account-mappings/<int:pk>', AccountMappingDetailView.as_view(), name='account_mapping_detail'),

    #   Shopify store
    path('stores', ShopifyStoreAPIView.as_view(), name='store'),
    path('stores/<int:pk>/set_primary/', SetPrimaryStoreAPIView.as_view(), name='set-primary-store'),

    # Source Name Mapping
    path('source-name-mappings', SourceNameMappingAPIView.as_view(), name='source-name-mapping'),
    path('source-name-mappings/<int:pk>', SourceNameMappingDetailAPIView.as_view(), name='source-name-mapping-detail'),
]
