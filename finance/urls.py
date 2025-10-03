from django.urls import path
from . import views


urlpatterns = [
    path('', views.cash_list_create, name='cash'),
    path('<int:pk>/edit/', views.cash_edit, name='cash_edit'),
    path('<int:pk>/delete/', views.cash_delete, name='cash_delete'),
    
    # Bill splitting URLs
    path('bill-split/', views.bill_split_home, name='bill_split_home'),
    path('bill-split/create/', views.create_bill_split, name='create_bill_split'),
    path('bill-split/from-transaction/<int:tx_pk>/', views.create_bill_from_transaction, name='create_bill_from_transaction'),
    path('bill-split/<int:pk>/', views.bill_split_detail, name='bill_split_detail'),
    path('bill-split/mark-payment/<int:pk>/', views.mark_payment, name='mark_payment'),
    path('bill-split/add-person/', views.add_person, name='add_person'),
]



