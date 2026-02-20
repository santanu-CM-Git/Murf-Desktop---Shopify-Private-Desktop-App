
# from django.urls import path
# from .views import index

# urlpatterns = [
#     path('', index),
#     path('login', index),
#     path('chart', index),
#     path('export', index),

#     # path('covid-view/<str:covidId>', index),

#     path('404', index),
#     path('403', index),
#     path('500', index),
# ]

from django.urls import re_path
from .views import index

urlpatterns = [
    re_path(r'^.*$', index),
]
