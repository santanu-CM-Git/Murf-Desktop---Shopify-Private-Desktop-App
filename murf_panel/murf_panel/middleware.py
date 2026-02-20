from django.http import JsonResponse, HttpResponseRedirect
from django.utils.deprecation import MiddlewareMixin
from shop_api.utils import set_current_user

class JsonErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Get the current domain dynamically
        frontend_url = f"{request.scheme}://{request.get_host()}"

        # Apply JSON errors for API routes
        if request.path.startswith("/api/"):
            error_messages = {
                404: {"error": "Not Found", "message": "API endpoint not found."},
                500: {"error": "Server Error", "message": "An internal server error occurred."},
                403: {"error": "Forbidden", "message": "You do not have permission to access this API."},
            }
            if response.status_code in error_messages:
                return JsonResponse(error_messages[response.status_code], status=response.status_code)

        # Redirect non-API errors to frontend error pages dynamically
        if response.status_code == 404:
            return HttpResponseRedirect(f"{frontend_url}/404")
        elif response.status_code == 500:
            return HttpResponseRedirect(f"{frontend_url}/500")
        elif response.status_code == 403:
            return HttpResponseRedirect(f"{frontend_url}/403")

        return response
    

class CurrentUserMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.user.is_authenticated:
            set_current_user(request.user)
        return None
