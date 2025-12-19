from django.shortcuts import redirect
from .models import Sale
from apps.products.models import Product

def quick_sale(request, product_id):
    product = Product.objects.get(id=product_id)
    Sale.objects.create(product=product, quantity=1)
    product.stock -= 1
    product.save()
    return redirect('/')
