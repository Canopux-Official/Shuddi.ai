type RazorpayOptions = {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  onSuccess: () => void;
  onDismiss: () => void;
};

export const openRazorpayCheckout = ({
  orderId,
  amount,
  currency,
  name,
  onSuccess,
  onDismiss,
}: RazorpayOptions) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    order_id: orderId,
    amount,
    currency,
    name,
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
