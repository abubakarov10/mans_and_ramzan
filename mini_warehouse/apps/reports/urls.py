from django.urls import path

from .views import profit_report

app_name = 'reports'

urlpatterns = [
    path('profit/', profit_report, name='profit'),
]
