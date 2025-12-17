from django.contrib import admin
from django.urls import path, include  # подключаем include для приложений

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.products.urls')),   # главная страница → список товаров
    path('products/', include('apps.products.urls')),
    path('sales/', include('apps.sales.urls')),
    path('reports/', include('apps.reports.urls')),
]
