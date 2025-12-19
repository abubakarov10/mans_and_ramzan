# from django.shortcuts import render
#
# def products_list(request):
#     return render(request, 'products/list.html')

from django.shortcuts import render

def product_list(request):
    return render(request, 'products/list.html')
