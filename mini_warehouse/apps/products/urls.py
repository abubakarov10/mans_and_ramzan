from django.urls import path

from .views import product_create, product_delete, product_edit, product_list

app_name = 'products'

urlpatterns = [
    path('', product_list, name='list'),
    path('new/', product_create, name='create'),
    path('<int:product_id>/edit/', product_edit, name='edit'),
    path('<int:product_id>/delete/', product_delete, name='delete'),
]
