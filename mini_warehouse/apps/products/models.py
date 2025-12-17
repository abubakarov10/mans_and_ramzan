from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    stock = models.PositiveIntegerField(default=0)
    purchase_price = models.FloatField(default=0)
    sale_price = models.FloatField(default=0)

    def __str__(self):
        return self.name


