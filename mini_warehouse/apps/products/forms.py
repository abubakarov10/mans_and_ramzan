from django import forms

from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'stock', 'purchase_price', 'sale_price']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'stock': forms.NumberInput(attrs={'min': 0, 'class': 'form-control'}),
            'purchase_price': forms.NumberInput(attrs={'min': 0, 'step': '0.01', 'class': 'form-control'}),
            'sale_price': forms.NumberInput(attrs={'min': 0, 'step': '0.01', 'class': 'form-control'}),
        }
