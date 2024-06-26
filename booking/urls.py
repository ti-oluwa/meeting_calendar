from django.urls import path

from . import views


app_name = "booking"

urlpatterns = [
    path("calendar/", views.session_calendar_view, name="calendar"),
    path("links/<str:identifier>/", views.session_link_view, name="session_link"),
    path("book-session/", views.session_booking_view, name="book_session"),
    path("update-session/", views.session_update_view, name="update_session"),
]
