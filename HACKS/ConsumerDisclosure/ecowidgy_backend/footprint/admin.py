from django.contrib import admin

# Register your models here.
from .models import ProductType, Property, EffectType, Effect   

class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "price")

class PropertyAdmin(admin.ModelAdmin):
    list_display = ("name", "unit",)
    
class EffectTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "property",)

class EffectAdmin(admin.ModelAdmin):
    list_display = ("product_type", "effect_type",)
    
admin.site.register(ProductType, ProductTypeAdmin)
admin.site.register(Property, PropertyAdmin)
admin.site.register(EffectType, EffectTypeAdmin)
admin.site.register(Effect, EffectAdmin)