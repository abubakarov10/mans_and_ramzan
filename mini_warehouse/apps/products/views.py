from django.shortcuts import render

def product_list(request):
    return render(request, 'products/list.html', {})

def product_create(request):
    return render(request, 'products/form.html', {})

def product_edit(request, pk):
    return render(request, 'products/form.html', {})

def product_delete(request, pk):
    return render(request, 'products/list.html', {})

