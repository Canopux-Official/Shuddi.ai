/**
 * Logic to check if a user can redeem.
 * Current Base: 50 coins
 */
export const validateRedemption = (currentBalance: number, amountToRedeem: number) => {
  const MINIMUM_WITHDRAWAL = 10;

  if (amountToRedeem < MINIMUM_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal is ${MINIMUM_WITHDRAWAL} coins.`);
  }

  if (currentBalance < amountToRedeem) {
    throw new Error("Inadequate balance for this redemption.");
  }

  return true;
};