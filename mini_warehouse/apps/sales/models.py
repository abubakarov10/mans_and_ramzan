from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class Sale(models.Model):
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT,
        related_name='sales',
    )
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    sold_at = models.DateField(default=timezone.localdate)

    def sale_price(self):
        return self.product.sale_price

    def total(self):
        return self.quantity * self.product.sale_price

    def __str__(self):
        return f'{self.product} x {self.quantity}'
