from django.contrib import admin
from django.urls import include, path

from .views import about, dashboard

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", dashboard, name="dashboard"),
    path("about/", about, name="about"),
    path("products/", include("apps.products.urls")),
    path("sales/", include("apps.sales.urls")),
    path("reports/", include("apps.reports.urls")),
]
