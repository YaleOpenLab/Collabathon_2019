from django.db import models


class ProductType(models.Model):
    name = models.CharField(max_length=50)
    price = models.FloatField(null=True)
    help_text = '''Generic type of products, such as soap, plastic bag, 
                    paper bag, Every product has a price based on the official
                    US Producer Price Index (2013)''' 

class Property(models.Model):
    name = models.CharField(max_length=50)
    unit = models.CharField(max_length=50)
    help_text = '''Every type is expressed by one property, e.g. 
                    O_2 emissions are expressed by their mass, measured in kg'''

class EffectType(models.Model): 
    name = models.CharField(max_length=50)
    RESOURCES = (
        ('air', 'air'),
        ('water', 'water'),
        ('soil', 'soil'),
    )
    resource = models.CharField(max_length=10, choices=RESOURCES)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    help_text = '''One particular type of sustainability effect for the lifecycle of a product.
                    The most obvious is O_2 emissions, but this model allows 
                    for tracking other type of effects,
                    such as methane emissions, water/soil polution, etc. 
                    Every type has an effect to one resource, e.g. O_2 emissions affect the air'''   
    
class Effect(models.Model):
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    effect_type = models.ForeignKey(EffectType, on_delete=models.CASCADE)
    value = models.FloatField()
    help_text = '''A measured value for the sustainability effect of the lifecycle of a product. 
                    E.g. a sustainability effect of one piece of soap would be the CO_2 emissions having a mass of 0.16 grams. 
                    This would be stored here as: 'value': 0.16, 'product_type'->'soap', 'effect_type'->'O_2 emissions' 
                    One product may have several effects measured, each of them belongs to a different type'''
    
    
