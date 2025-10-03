from django.apps import AppConfig


class FinanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'finance'

    def ready(self):
        # Import signals to enable automatic MongoDB syncing
        try:
            from . import signals  # noqa: F401
        except Exception:
            # Fail-safe: do not block Django startup if Mongo sync wiring fails
            pass



