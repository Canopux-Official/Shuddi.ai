import { useState, useRef } from 'react';
import type { Foundation } from '../types/types';
import { createPaymentOrder, getPaymentStatus } from '../../../apis/donation/payment.api';
import { openRazorpayCheckout } from '../utils/razorpay';

export type DonationState =
  | 'IDLE'
  | 'CREATING_ORDER'
  | 'OPENING_CHECKOUT'
  | 'PAYMENT_PROCESSING'
  | 'SUCCESS'
  | 'FAILED';

export const useDonationPayment = () => {
  const [donationState, setDonationState] = useState<DonationState>('IDLE');
  const currentOrderIdRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  // ------------------------
  // Public API
  // ------------------------

  const startDonation = async (
    foundation: Foundation,
    amount: number,
    onSuccess?: () => void,
    onFailure?: () => void
  ) => {
    if (!foundation || amount <= 0) return;

    try {
      setDonationState('CREATING_ORDER');

      const { orderId, currency, amount: orderAmount } =
        await createPaymentOrder({
          campaignId: foundation.id,
          amount,
        });

      currentOrderIdRef.current = orderId;
      setDonationState('OPENING_CHECKOUT');

      openRazorpayCheckout({
        orderId,
        amount: orderAmount,
        currency,
        name: foundation.name,
        onSuccess: () => {
          setDonationState('PAYMENT_PROCESSING');
          startPolling(orderId, onSuccess, onFailure);
        },
        onDismiss: () => {
          failDonation(onFailure);
        },
      });
    } catch (err) {
      console.error('Donation start failed:', err);
      failDonation(onFailure);
    }
  };

  const resetDonation = () => {
    clearPolling();
    currentOrderIdRef.current = null;
    setDonationState('IDLE');
  };

  // ------------------------
  // Internal helpers
  // ------------------------

  const startPolling = (
    orderId: string,
    onSuccess?: () => void,
    onFailure?: () => void
  ) => {
    const startTime = Date.now();

    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const { status } = await getPaymentStatus(orderId);

        if (status === 'SUCCESS') {
          clearPolling();
          setDonationState('SUCCESS');
          onSuccess?.();
          resetDonation();
        }

        if (status === 'FAILED') {
          failDonation(onFailure);
        }

        // Safety timeout (30s)
        if (Date.now() - startTime > 30000) {
          failDonation(onFailure);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2500);
  };

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const failDonation = (onFailure?: () => void) => {
    clearPolling();
    setDonationState('FAILED');
    onFailure?.();
    resetDonation();
  };

  return {
    donationState,
    startDonation,
    resetDonation,
  };
};
