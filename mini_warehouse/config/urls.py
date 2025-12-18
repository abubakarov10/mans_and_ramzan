from django.contrib import admin
from django.urls import path, include
from apps.products import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.product_list, name='home'),  # Главная показывает список товаров
    path('products/', include('apps.products.urls')),
]
