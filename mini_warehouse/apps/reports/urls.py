from django.urls import path
from . import views  # <- обязательно локальный импорт views

app_name = 'reports'  # пространство имён приложения

urlpatterns = [
    path('profit/', views.profit_report, name='profit'),
]
