import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51RR4GGEKdAqLoXLUItn0GVSgw0bVYNMpuTDs5tBPS6KryOPPKCJIdqbNyYL18Fgd6YZbMl4RuAPdA6Sx9Oigmn3x00KOBLIk3u',
    );

    // Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    // Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
