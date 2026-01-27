// src/api/payments.api.ts
import axios from 'axios';

export const createPaymentOrder = async ({
  campaignId,
  amount,
}: {
  campaignId: string;
  amount: number;
}) => {
  try {
    const { data } = await axios.post(
      '/api/donation/order',
      {
        campaignId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      }
    );
    return data;
  } catch (error: any) {
    // Axios error shape
    const status = error?.response?.status;

    if (status === 401) {
      alert('Please login to donate.');
    } else {
      alert('Something went wrong while creating donation.');
    }

    // Re-throw so caller knows it failed
    throw error;
  }
};

export const getPaymentStatus = async (orderId: string) => {
  try {
    const token = localStorage.getItem('authToken');

    const { data } = await axios.get(
      `/api/donation/status?orderId=${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      alert('Session expired. Please login again.');
    }
    throw error;
  }
};

