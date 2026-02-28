import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
      const authService = inject(AuthService);
      const router = inject(Router);

      const user = authService.currentUser();

      if (!user) {
            return router.createUrlTree(['/login']);
      }

      const expectedRole = route.data['role'];
      if (expectedRole && user.role !== expectedRole) {
            // Redirect if role mismatch
            return router.createUrlTree(['/login']);
      }

      return true;
};
