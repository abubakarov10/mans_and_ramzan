from django.db.models import Count, DecimalField, F, Sum, Value
from django.db.models.functions import Coalesce
from django.shortcuts import render

from apps.sales.models import Sale

from .forms import ProfitReportForm


def profit_report(request):
    form = ProfitReportForm(request.GET or None)
    sales = Sale.objects.select_related('product')

    if form.is_valid():
        date_from = form.cleaned_data.get('date_from')
        date_to = form.cleaned_data.get('date_to')
        if date_from:
            sales = sales.filter(sold_at__gte=date_from)
        if date_to:
            sales = sales.filter(sold_at__lte=date_to)

    revenue_expr = F('quantity') * F('product__sale_price')
    cost_expr = F('quantity') * F('product__purchase_price')
    zero_decimal = Value(0, output_field=DecimalField(max_digits=12, decimal_places=2))

    aggregates = sales.aggregate(
        revenue=Coalesce(Sum(revenue_expr, output_field=DecimalField(max_digits=12, decimal_places=2)), zero_decimal),
        cost=Coalesce(Sum(cost_expr, output_field=DecimalField(max_digits=12, decimal_places=2)), zero_decimal),
        items_sold=Coalesce(Sum('quantity'), 0),
        sales_count=Coalesce(Count('id'), 0),
    )
    aggregates['profit'] = aggregates['revenue'] - aggregates['cost']
    if aggregates['sales_count']:
        aggregates['average_ticket'] = aggregates['revenue'] / aggregates['sales_count']
    else:
        aggregates['average_ticket'] = zero_decimal.value

    context = {
        'form': form,
        'metrics': aggregates,
        'average_ticket': aggregates['average_ticket'],
    }
    return render(request, 'reports/profit.html', context)
