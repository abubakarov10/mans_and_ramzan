from django.urls import path
from . import views  # <- обязательно импортируем views

app_name = 'sales'  # пространство имён приложения

urlpatterns = [
    path('', views.sales_list, name='list'),
    path('new/', views.sales_create, name='new'),
]
