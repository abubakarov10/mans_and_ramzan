from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    stock = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name