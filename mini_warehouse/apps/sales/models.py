from django.db import models
from django.utils import timezone

class Sale(models.Model):
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='sales'
    )
    quantity = models.PositiveIntegerField(verbose_name='Количество')
    sold_at = models.DateTimeField(default=timezone.now)

    def price(self):
        return self.product.sale_price

    def total(self):
        return self.quantity * self.product.sale_price

    def __str__(self):
        return f'{self.product} x {self.quantity}'
