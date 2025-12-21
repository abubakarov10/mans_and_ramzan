from django.urls import path

from .views import (
    product_create,
    product_delete,
    product_edit,
    product_list,
    quick_add_product,
)

app_name = "products"

urlpatterns = [
    path("", product_list, name="list"),
    path("create/", product_create, name="create"),
    path("<int:product_id>/edit/", product_edit, name="edit"),
    path("<int:product_id>/delete/", product_delete, name="delete"),

    # ✅ для панели на главной
    path("quick-add/", quick_add_product, name="quick_add"),
]
