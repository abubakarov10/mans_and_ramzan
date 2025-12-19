from django.urls import path

from .views import sales_create, sales_list

app_name = 'sales'

urlpatterns = [
    path('', sales_list, name='list'),
    path('new/', sales_create, name='create'),
]
