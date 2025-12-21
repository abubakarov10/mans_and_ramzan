from django.db import transaction
from django.db.models import DecimalField, ExpressionWrapper, F
from django.shortcuts import redirect, render
from django.urls import reverse

from apps.products.models import Product

from .forms import SaleForm, SalesFilterForm
from .models import Sale


def sales_list(request):
    form = SalesFilterForm(request.GET or None)
    total_expr = ExpressionWrapper(
        F('quantity') * F('product__sale_price'),
        output_field=DecimalField(max_digits=12, decimal_places=2),
    )
    sales = (
        Sale.objects.select_related('product')
        .annotate(total=total_expr)
        .order_by('-sold_at', '-id')
    )

    if form.is_valid():
        date_from = form.cleaned_data.get('date_from')
        date_to = form.cleaned_data.get('date_to')
        if date_from:
            sales = sales.filter(sold_at__gte=date_from)
        if date_to:
            sales = sales.filter(sold_at__lte=date_to)

    return render(request, 'sales/list.html', {'sales': sales, 'form': form})


def sales_create(request):
    form = SaleForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        product = form.cleaned_data['product']
        quantity = form.cleaned_data['quantity']
        sold_at = form.cleaned_data['sold_at']
        with transaction.atomic():
            product = Product.objects.select_for_update().get(pk=product.pk)
            if quantity > product.stock:
                form.add_error('quantity', 'Недостаточно товара на складе.')
            else:
                product.stock -= quantity
                product.save(update_fields=['stock'])
                Sale.objects.create(
                    product=product,
                    quantity=quantity,
                    sold_at=sold_at,
                )
                return redirect(reverse('sales:list'))
    return render(request, 'sales/form.html', {'form': form})
