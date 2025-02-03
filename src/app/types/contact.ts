export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  vatNumber?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  tags: number[];
}
