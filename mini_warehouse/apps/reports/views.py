from django.shortcuts import render

def profit_report(request):
    return render(request, 'reports/profit.html', {})

