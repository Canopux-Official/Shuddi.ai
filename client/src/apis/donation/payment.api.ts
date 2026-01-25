// src/api/payments.api.ts
import axios from 'axios';

export const createPaymentOrder = async ({
  campaignId,
  amount,
}: {
  campaignId: string;
  amount: number;
}) => {
  const { data } = await axios.post('/api/payments/create-order', {
    campaignId,
    amount,
  });
  return data;
};

export const getPaymentStatus = async (orderId: string) => {
  const { data } = await axios.get(`/api/payments/status?orderId=${orderId}`);
  return data;
};
