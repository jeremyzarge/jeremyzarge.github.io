/**
 * Type definitions for the VitePotLock application
 */

export type Apartment = {
  id: string;
  name: string;
  address: string;
};

export type Allergies = {
  gluten_free: boolean;
  dairy_free: boolean;
  vegan: boolean;
  vegetarian: boolean;
  nut_allergy: boolean;
  custom: string[];
};

export type CanBring = {
  drinks: boolean;
  dessert: boolean;
  salad: boolean;
  main_dish: boolean;
  snacks: boolean;
  sides: boolean;
  utensils: boolean;
};

export type UserProfile = {
  uid: string;
  first_name: string;
  last_name: string;
  apartment: string;
  can_bring: CanBring;
  allergies: Allergies;
  placeholder: boolean;
};

export type MealParticipant = {
  food: string;
  specifics: string;
  role: "host" | "guest";
  accepted: boolean;  // true = full participant, false = invited only
};

export type MealMessage = {
  user: string;
  text: string;
  timestamp: number;
};

export type Meal = {
  title: string;
  host_apartment_id: string;
  participants: Record<string, MealParticipant>;
  datetime: string;
  created_at: string;
  instructions: string;
  allowGuestsFoodSelection: boolean;
  messages: Record<string, MealMessage>;
};

/**
 * Legacy format for backwards compatibility
 */
export type LegacyMeal = {
  title: string;
  host_apartment_id: string;
  hosts: Record<string, { food: string }>;
  guests: Record<string, { food: string }>;
  datetime: string;
  created_at: string;
  instructions: string;
  allowGuestsFoodSelection: boolean;
  messages: Record<string, MealMessage>;
};

/**
 * User with ID included (used in components)
 */
export type UserWithId = UserProfile & { id: string };

/**
 * Apartment with additional computed properties
 */
export type ApartmentWithData = Apartment & {
  avgBalance: number;
};

/**
 * Friend/relationship types
 */
export type RelationshipStatus = "friend" | "request_sent" | "request_received";

export type UserRelationship = {
  status: RelationshipStatus;
  timestamp: number;
};
