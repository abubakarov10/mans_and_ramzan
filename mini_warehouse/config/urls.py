from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path


def dashboard(request):
    return redirect('products:list')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard),
    path('products/', include('apps.products.urls')),
    path('sales/', include('apps.sales.urls')),
    path('reports/', include('apps.reports.urls')),
]
