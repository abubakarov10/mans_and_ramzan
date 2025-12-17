from django.shortcuts import render

def sales_list(request):
    return render(request, 'sales/list.html', {})

def sales_create(request):
    return render(request, 'sales/form.html', {})

