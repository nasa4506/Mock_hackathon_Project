import { HttpInterceptorFn } from '@angular/common/http';

/**
 * JWT Interceptor (functional style for Angular 18+)
 *
 * Automatically attaches the JWT token from localStorage to every
 * outgoing HTTP request as a Bearer token in the Authorization header.
 *
 * How it works:
 * 1. AuthService stores the JWT in localStorage['token'] after login
 * 2. This interceptor reads it and clones the request with the header
 * 3. The backend validates the token via ASP.NET Core JwtBearer middleware
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
      const token = localStorage.getItem('token');

      if (token) {
            // Clone the request and add the Authorization header
            const cloned = req.clone({
                  setHeaders: {
                        Authorization: `Bearer ${token}`
                  }
            });
            return next(cloned);
      }

      // No token — pass the request through unchanged (e.g., login request)
      return next(req);
};
