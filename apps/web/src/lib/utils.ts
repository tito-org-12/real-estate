import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const PILOT_CITY = "Riyadh";
export const PILOT_CURRENCY_CODE = "SAR";
export const PILOT_LOCALE = "en-SA";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
	return new Intl.NumberFormat(PILOT_LOCALE, {
		style: "currency",
		currency: PILOT_CURRENCY_CODE,
		maximumFractionDigits: 0,
	}).format(amount);
}
