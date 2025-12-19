# from django.db import models
#
# class Product(models.Model):
#     name = models.CharField(max_length=255, verbose_name='Название')
#     stock = models.PositiveIntegerField(default=0, verbose_name='Остаток')
#     purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
#     sale_price = models.DecimalField(max_digits=10, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return self.name

from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
