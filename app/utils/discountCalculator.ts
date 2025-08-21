/**
 * Calculate discounted price (returns integer)
 */
export const discount = (
  price: string | number,
  discountPercentage: string | number
): number => {
  const p = Number(price);
  const d = Number(discountPercentage);

  if (isNaN(p) || isNaN(d)) return 0;
  return Math.round(p - (p * d) / 100);
};

/**
 * Calculate discount percentage (returns integer)
 */
export const discountPercentage = (
  originalPrice: string | number,
  discountPrice: string | number
): number => {
  const o = Number(originalPrice);
  const d = Number(discountPrice);

  if (isNaN(o) || isNaN(d) || o <= 0) return 0;
  return Math.round(((o - d) / o) * 100);
};
