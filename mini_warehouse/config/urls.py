from django.contrib import admin
from django.shortcuts import render
from django.urls import include, path


def dashboard(request):
    return render(request, 'dashboard.html')


def about(request):
    return render(request, 'about.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard, name='dashboard'),
    path('about/', about, name='about'),
    path('products/', include('apps.products.urls')),
    path('sales/', include('apps.sales.urls')),
    path('reports/', include('apps.reports.urls')),
]
