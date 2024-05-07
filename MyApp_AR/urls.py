from django.urls import path
from . import views

urlpatterns = [
   path('', views.app, name='app'),
   path('api/gl/', views.getAllGlasses, name='all_glasses'),
   path('api/gl/<str:sku>/', views.getGlassesBySKU, name='get_glasses_by_sku'),
]