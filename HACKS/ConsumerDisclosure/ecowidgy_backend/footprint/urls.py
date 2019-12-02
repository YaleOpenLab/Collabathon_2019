'''
Created on Nov 23, 2019

@author: Eleftherios Avramidis, Open Source Lab by DFKI
'''

from django.urls import path

from .views import HomePageView, SearchResultsView, search_results

urlpatterns = [
    #path('search/', SearchResultsView.as_view(), name='search_results'),
    path('search/', search_results, name='search_results'),
    path('', HomePageView.as_view(), name='home'),
]