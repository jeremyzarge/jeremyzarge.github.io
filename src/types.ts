/**
 * Type definitions for the VitePotLock application
 */

export type Apartment = {
  id: string;
  name: string;
  address: string;
};

export type OneTableConfig = {
  area_id: number;
  full_address: string;
  secondary_address: string;
  neighborhood: string;
  subneighborhood: string;
  lat: number;
  lng: number;
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
  side: boolean;
  utensils: boolean;
  custom?: string[];
};

export type UserProfile = {
  uid: string;
  first_name: string;
  last_name: string;
  apartment: string;
  pending_apartment_request?: string; // aptId of a pending join request
  email?: string;
  can_bring: CanBring;
  allergies: Allergies;
  placeholder: boolean;
  dinner_status?: "free" | "busy";
  lunch_status?: "free" | "busy";
  onetable_token?: string;
  onetable_config?: OneTableConfig;
};

export type ApartmentInvite = {
  aptId: string;
  aptName: string;
  invitedBy: string;
  invitedByName: string;
  timestamp: number;
  type?: "removal";
};

export type MealParticipant = {
  food: string;
  specifics: string;
  role: "host" | "guest";
  accepted?: boolean;  // true = accepted, absent/false = invited only
  additional_items?: Array<{ food: string; specifics: string }>;
};

export type MealMessage = {
  user: string;
  text: string;
  timestamp: number;
};

/** One food-request line item set by the host (e.g. "2 sides"). */
export type FoodRequestItem = {
  food: string;      // catalog key (RTDB "food" node) or custom text
  quantity: number;  // desired total quantity, 0 and up
};

export type Meal = {
  title: string;
  host_apartment_id: string;
  participants: Record<string, MealParticipant>;
  datetime?: string;
  created_at: string;
  instructions: string;
  location?: string;
  allowGuestsFoodSelection: boolean;
  messages: Record<string, MealMessage>;
  onetable_event_id?: number;
  onetable_event_uuid?: string;
  onetable_description?: string;
  onetable_nourishment?: boolean;
  onetable_reservations?: Record<string, number>;
  food_requests?: FoodRequestItem[];
  food_requests_enforced?: boolean; // if true, guests are restricted to food_requests; otherwise they're just suggestions
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
