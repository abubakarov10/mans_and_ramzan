from django.contrib import messages
from django.db.models import Count
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from .forms import ProductForm
from .models import Product


def product_list(request):
    products = Product.objects.annotate(sales_count=Count('sales')).order_by('name')
    return render(request, 'products/list.html', {'products': products})


def product_create(request):
    form = ProductForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Товар добавлен.')
        return redirect('products:list')
    return render(request, 'products/form.html', {'form': form, 'title': 'Добавить товар'})


def product_edit(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    form = ProductForm(request.POST or None, instance=product)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Товар обновлён.')
        return redirect('products:list')
    return render(
        request,
        'products/form.html',
        {'form': form, 'title': f'Редактировать: {product.name}'},
    )


def product_delete(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        if product.sales.exists():
            messages.error(request, 'Нельзя удалить товар с продажами.')
        else:
            product.delete()
            messages.success(request, 'Товар удалён.')
    return redirect(reverse('products:list'))
