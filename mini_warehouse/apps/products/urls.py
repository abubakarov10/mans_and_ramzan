from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.product_list, name='list'),         # список товаров
    path('new/', views.product_create, name='new'),    # добавить товар
    path('<int:pk>/edit/', views.product_edit, name='edit'),   # редактировать
    path('<int:pk>/delete/', views.product_delete, name='delete'),  # удалить
]


