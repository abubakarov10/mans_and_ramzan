from django.contrib import messages
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.http import require_POST

from .forms import ProductForm
from .models import Product


def product_list(request):
    products = Product.objects.annotate(sales_count=Count("sales")).order_by("name")
    return render(request, "products/list.html", {"products": products})


def product_create(request):
    form = ProductForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Товар добавлен.")
        return redirect("products:list")
    return render(request, "products/form.html", {"form": form, "title": "Добавить товар"})


def product_edit(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    form = ProductForm(request.POST or None, instance=product)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Товар обновлён.")
        return redirect("products:list")
    return render(
        request,
        "products/form.html",
        {"form": form, "title": f"Редактировать: {product.name}"},
    )


def product_delete(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == "POST":
        if product.sales.exists():
            messages.error(request, "Нельзя удалить товар с продажами.")
        else:
            product.delete()
            messages.success(request, "Товар удалён.")
    return redirect(reverse("products:list"))


# ✅ ✅ ✅ ВОТ ЭТО НОВОЕ: добавление товара из панели на главной (AJAX)
@require_POST
def quick_add_product(request):
    name = (request.POST.get("name") or "").strip()
    category = (request.POST.get("category") or "").strip()
    stock = request.POST.get("stock")
    sale_price = request.POST.get("sale_price")

    if not name or not category or stock is None or sale_price is None:
        return JsonResponse({"ok": False, "error": "Заполни все поля"}, status=400)

    try:
        stock = int(stock)
        sale_price = float(sale_price)
    except ValueError:
        return JsonResponse({"ok": False, "error": "Неверные числа"}, status=400)

    product = Product.objects.create(
        name=name,
        stock=stock,
        sale_price=sale_price,
        # если у тебя есть purchase_price и он обязателен — ставим 0
        purchase_price=getattr(Product, "purchase_price", 0) and 0,
    )

    return JsonResponse(
        {
            "ok": True,
            "product": {
                "id": product.id,
                "name": product.name,
                "category": category,  # если нет поля category в модели — это чисто для вывода
                "stock": product.stock,
                "sale_price": float(product.sale_price),
            },
        }
    )
