import { i18n } from "@lingui/core";

/**
 * Imports the translation of the given locale
 * @param locale any locale string
 */
export async function dynamicActivate(locale: string) {
  const { messages } = await import(`../../po/main/${locale}.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
