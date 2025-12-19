from django.urls import path
from .views import quick_sale

urlpatterns = [
    path('sell/<int:product_id>/', quick_sale, name='quick_sale'),
]
