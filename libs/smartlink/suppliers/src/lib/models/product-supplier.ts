import { Entity } from '@smartlink/common';
import { Phone } from './phone';
import { Rating } from './ratings';
import { Contact, Preferred } from './supplier';

export interface ProductSupplier extends Entity {
  AsiNumber: string;
  Email?: string;
  Phone: Phone;
  Artwork: Contact;
  Orders: Contact;
  Ratings?: any;
  Preferred?: Preferred;
  Websites?: string[];
  Rating: Rating;
}
