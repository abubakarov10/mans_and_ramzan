from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

def dashboard(request):
    return render(request, 'base.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard),
    path('products/', include('apps.products.urls')),
    path('sales/', include('apps.sales.urls')),
    path('reports/', include('apps.reports.urls')),
]
