from datetime import date

from django.db.models import F, Sum
from django.shortcuts import render
from django.utils import timezone

from apps.products.models import Product
from apps.sales.models import Sale


def dashboard(request):
    today = timezone.localdate()

    products_count = Product.objects.count()

    # Sale.sold_at у тебя DateField (по ошибке было видно), поэтому фильтр ТАК:
    sales_today_qs = Sale.objects.filter(sold_at=today)

    sales_today = sales_today_qs.count()

    revenue_today = (
        sales_today_qs.aggregate(total=Sum(F("quantity") * F("product__sale_price")))["total"]
        or 0
    )

    # "Эффективность" пока оставим 100% (чтоб не падало и не ломало)
    efficiency = 100

    popular_products = (
        Product.objects.order_by("-stock", "name")[:10]  # можешь поменять сортировку
    )

    context = {
        "products_count": products_count,
        "revenue_today": revenue_today,
        "sales_today": sales_today,
        "efficiency": efficiency,
        "popular_products": popular_products,
    }
    return render(request, "dashboard.html", context)


def about(request):
    return render(request, "about.html")
