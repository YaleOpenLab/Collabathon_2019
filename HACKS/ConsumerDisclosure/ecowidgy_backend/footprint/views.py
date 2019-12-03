"""
@author: Eleftherios Avramidis, Open Source Lab by DFKI
"""

from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.db.models.query_utils import Q

from .models import Effect

def search_results(request):
    requested_product_type = request.GET.get('product')
    requested_product_quantity = float(request.GET.get('quantity'))
    effect = Effect.objects.filter(
        Q(product_type__name__icontains=requested_product_type,
          effect_type__name="Carbon dioxide")
        )[0]
    footprint = 1.0 * requested_product_quantity * effect.product_type.price * effect.value
    print(footprint)
    context = {'product_type': requested_product_type,
               'product_quantity': requested_product_quantity,
               'single_price':  round(effect.product_type.price, 2),
               'single_footprint':  round(effect.value, 3),
               'unit': effect.effect_type.property.unit,
               'total_footprint': round(footprint, 3),
               }
    
    return render(request, 'search_results.html', context)
    

class HomePageView(TemplateView):
    template_name = 'home.html'

class SearchResultsView(ListView):
    model = Effect
    template_name = 'search_results.html'
    
    def get_queryset(self): # new
        requested_product_type = self.request.GET.get('product')
        requested_product_quantity = self.request.GET.get('quantity')
        object_list = Effect.objects.filter(
            Q(product_type__name__icontains=requested_product_type)
            )
        
        return object_list
    