// apps/client/src/i18n/request.ts

import {cookies, headers} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const supportedLocales = ['en', 'fr'];
  let detectedLocale: string | undefined;

  // 1) Check the 'locale' cookie first
  const cookieLocale = (await cookies()).get('locale')?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    detectedLocale = cookieLocale;
  }

  // 2) If no cookie, check accept-language header for fallback
  if (!detectedLocale) {
    const acceptLanguage = (await headers()).get('accept-language') || '';
    const firstLang = acceptLanguage.split(',')[0].split('-')[0]; 
    if (supportedLocales.includes(firstLang)) {
      detectedLocale = firstLang;
    }
  }

  // 3) Default to 'en' if nothing was detected
  if (!detectedLocale) {
    detectedLocale = 'en';
  }

  // 4) Load messages
  const messages = (await import(`../../messages/${detectedLocale}.json`)).default;

  return {
    locale: detectedLocale,
    messages,
  };
});
