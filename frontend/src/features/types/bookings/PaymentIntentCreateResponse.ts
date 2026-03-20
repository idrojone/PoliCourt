export interface PaymentIntentCreateResponse {
  clientSecret: string;
  orderId: number;
  bookingUuid: string;
}
