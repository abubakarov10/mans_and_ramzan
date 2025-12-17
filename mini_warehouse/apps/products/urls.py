from django.urls import path
from . import views  # <- обязательно импортируем views

app_name = 'products'  # пространство имён приложения

urlpatterns = [
    path('', views.product_list, name='list'),
    path('new/', views.product_create, name='new'),
    path('<int:pk>/edit/', views.product_edit, name='edit'),
    path('<int:pk>/delete/', views.product_delete, name='delete'),
]
