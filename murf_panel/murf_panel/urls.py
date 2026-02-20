# myproject/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shop_api.urls')),  # Include shop_api URLs
    path('', include('frontend.urls')),     # Include frontend URLs
]
