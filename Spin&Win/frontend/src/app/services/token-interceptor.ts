import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from './auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  console.log('>>> Interceptor Running | Browser:', isBrowser);

  if (!isBrowser) {
    console.log('>>> SSR detected, skipping token');
    return next(req);
  }

  const auth = inject(Auth);
  const token = auth.getToken();

  let newReq = req;

  if (token) {
    newReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    // REAL header check
    console.log('>>> Authorization header applied:');
  } else {
    console.log('>>> No token found, sending request without Authorization');
  }

  return next(newReq);
};
