import type { Meal } from "./types";
import { WORKER_URL, NOTIFICATION_SECRET } from "./notifications";

// OneTable's API has no CORS allowance for browser origins, so requests are
// routed through the Cloudflare Worker (same one used for push), which calls
// OneTable server-side and returns the result with CORS headers attached.

/** Thrown when OneTable rejects a request because the bearer token is expired/invalid. */
export class OneTableAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OneTableAuthError";
  }
}

export function isOneTableAuthError(err: unknown): err is OneTableAuthError {
  return err instanceof OneTableAuthError;
}

export const OT_RECONNECT_MESSAGE =
  "Your OneTable connection has expired. Please reconnect it from your profile.";

const AUTH_ERROR_PATTERN = /unauthenticated|invalid.*token|please log in/i;

async function otRequest(
  token: string,
  operationName: string | undefined,
  variables: Record<string, unknown>,
  query: string
): Promise<any> {
  const resp = await fetch(`${WORKER_URL}/onetable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Notification-Secret": NOTIFICATION_SECRET,
    },
    body: JSON.stringify({ token, operationName, variables, query }),
  });
  if (!resp.ok) throw new Error(`OneTable API error: ${resp.status}`);
  const data = await resp.json();
  const message = data?.errors?.[0]?.message;
  if (message && AUTH_ERROR_PATTERN.test(message)) {
    throw new OneTableAuthError(message);
  }
  return data;
}

export type OTLocation = {
  full_address: string;
  secondary_address?: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  subneighborhood?: string;
};

// ─── Areas ────────────────────────────────────────────────────────────────────
// OneTable's own "area" regions (from their areas query) with each area's center
// point, used to pick the right areaId for wherever a meal is actually hosted.
// "More Cities" (id 8) is OneTable's catch-all area for locations that aren't
// close to any of their named metros.

const OT_MORE_CITIES_AREA_ID = 8;
const OT_NEAREST_AREA_MAX_KM = 100;

const OT_AREAS: Array<{ id: number; label: string; lat: number; lng: number }> = [
  { id: 41, label: "Asheville", lat: 35.9131996, lng: -79.0558445 },
  { id: 13, label: "Atlanta", lat: 33.74899, lng: -84.39026 },
  { id: 29, label: "Baltimore", lat: 39.2908816, lng: -76.610759 },
  { id: 2, label: "Bay Area", lat: 37.77903, lng: -122.41991 },
  { id: 38, label: "Boca Raton/Delray Beach", lat: 26.3586885, lng: -80.0830984 },
  { id: 14, label: "Boston", lat: 42.35543, lng: -71.06051 },
  { id: 47, label: "Charlottesville", lat: 38.029305, lng: -78.476677 },
  { id: 3, label: "Chicago", lat: 41.8755616, lng: -87.6244212 },
  { id: 30, label: "Cincinnati", lat: 39.10145, lng: -84.51246 },
  { id: 11, label: "Colorado", lat: 39.73924, lng: -104.98486 },
  { id: 22, label: "Dallas", lat: 32.7762719, lng: -96.7968559 },
  { id: 12, label: "DC Metro Area", lat: 38.8950368, lng: -77.0365427 },
  { id: 17, label: "Detroit/Ann Arbor", lat: 42.26816, lng: -83.73123 },
  { id: 46, label: "Honolulu", lat: 21.306944, lng: -157.858337 },
  { id: 40, label: "Kansas City Metro Area", lat: 39.099728, lng: -94.578568 },
  { id: 16, label: "Los Angeles", lat: 34.0536909, lng: -118.242766 },
  { id: 44, label: "Louisville", lat: 38.328732, lng: -85.764771 },
  { id: 32, label: "Madison", lat: 43.074761, lng: -89.3837613 },
  { id: 34, label: "Memphis", lat: 35.14602, lng: -90.05176 },
  { id: 24, label: "Miami", lat: 25.7741728, lng: -80.19362 },
  { id: 33, label: "Nashville", lat: 36.16228, lng: -86.7743 },
  { id: 1, label: "New York", lat: 40.7127281, lng: -74.0060152 },
  { id: 27, label: "Philadelphia", lat: 39.95272, lng: -75.16353 },
  { id: 37, label: "Palm Beaches", lat: 26.6279798, lng: -80.4494174 },
  { id: 15, label: "Pittsburgh", lat: 40.44169, lng: -79.99009 },
  { id: 31, label: "Phoenix", lat: 33.44844, lng: -112.07414 },
  { id: 21, label: "Portland", lat: 45.5202471, lng: -122.674194 },
  { id: 77, label: "Rochester", lat: 43.1565779, lng: -77.6088465 },
  { id: 39, label: "Raleigh-Durham-Chapel Hill", lat: 35.994034, lng: -78.898621 },
  { id: 26, label: "Sacramento", lat: 38.58106, lng: -121.4939 },
  { id: 25, label: "Seattle", lat: 47.6062095, lng: -122.3320708 },
  { id: 35, label: "Twin Cities", lat: 44.9773, lng: -93.26547 },
  { id: 45, label: "Western Massachusetts", lat: 42.562565, lng: -70.802467 },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Picks the closest OneTable area to a given point, falling back to "More Cities". */
function nearestAreaId(lat?: number, lng?: number): number {
  if (lat === undefined || lng === undefined || Number.isNaN(lat) || Number.isNaN(lng)) {
    return OT_MORE_CITIES_AREA_ID;
  }
  let best = OT_AREAS[0];
  let bestDist = Infinity;
  for (const area of OT_AREAS) {
    const dist = haversineKm(lat, lng, area.lat, area.lng);
    if (dist < bestDist) { bestDist = dist; best = area; }
  }
  return bestDist <= OT_NEAREST_AREA_MAX_KM ? best.id : OT_MORE_CITIES_AREA_ID;
}

// ─── Login ────────────────────────────────────────────────────────────────────
// Update OT_LOGIN_MUTATION once you confirm the correct operation name from
// DevTools → Network → any graphql POST made during OneTable login.

const OT_LOGIN_MUTATION = "signIn"; // ← change this if wrong

function buildLoginQuery(mutationName: string) {
  return `
    mutation ${mutationName}($email: String!, $password: String!) {
      ${mutationName}(input: { email: $email, password: $password }) {
        jwt
        errors { message }
      }
    }
  `;
}

/**
 * Logs in with email/password and returns a bearer token.
 * Throws a descriptive error so the UI can display it.
 */
export async function loginOT(email: string, password: string): Promise<string> {
  const OT_API_DIRECT = "https://app-prod.internal.onetable.org/graphql";
  const OT_FP = "d15058657f86f919b51f5c6912b88d5c";
  const resp = await fetch(OT_API_DIRECT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-browser-fingerprint": OT_FP,
    },
    body: JSON.stringify({
      operationName: OT_LOGIN_MUTATION,
      variables: { email, password },
      query: buildLoginQuery(OT_LOGIN_MUTATION),
    }),
  });
  if (!resp.ok) throw new Error(`OneTable API error: ${resp.status}`);
  const data = await resp.json();
  if (data.errors?.length) throw new Error(data.errors[0].message);
  const result = data.data?.[OT_LOGIN_MUTATION];
  if (result?.errors?.length) throw new Error(result.errors[0].message);
  const jwt = result?.jwt;
  if (!jwt) throw new Error("Login succeeded but no token was returned.");
  return jwt;
}

// ─── Token verification ───────────────────────────────────────────────────────

const VERIFY_QUERY = `
  query GetLoginSignupContents {
    loginSignupContents {
      id
      label
    }
  }
`;

/** Returns true if the token resolves without errors. */
export async function verifyOTToken(token: string): Promise<boolean> {
  try {
    const data = await otRequest(token, "GetLoginSignupContents", {}, VERIFY_QUERY);
    return !data.errors && !!data.data;
  } catch {
    return false;
  }
}

// ─── Event creation ───────────────────────────────────────────────────────────

const CREATE_EVENT_QUERY = `
  mutation createEvent(
    $publish: Boolean,
    $potluckItemsObj: [CreatePotluckItemObjectInput!],
    $reservationQuestions: [ReservationQuestionInput!],
    $eventType: EventType!,
    $eventSubtypeId: Int,
    $eventSubtypeOther: String,
    $privacySubtypeId: Int,
    $scheduledAt: ISO8601DateTime!,
    $duration: Int,
    $fullAddress: String,
    $secondaryAddress: String,
    $areaId: Int!,
    $areaOther: String,
    $location: EventLocationInput,
    $stateLocation: String,
    $timezoneOther: String,
    $neighborhood: String,
    $neighborhoodId: Int,
    $subneighborhood: String,
    $title: String!,
    $description: Html!,
    $notes: String,
    $petsAllowed: Boolean,
    $alcoholPolicy: AlcoholPolicy,
    $numberOfGuestsMin: Int,
    $numberOfGuestsMax: Int!,
    $currency: Currency,
    $pricePerPerson: Int,
    $hostAbsorbsTransactionFee: Boolean,
    $explainPayment: String,
    $dietaryRestrictions: [DietaryRestriction!],
    $coverUrl: String,
    $dressCode: String,
    $accessible: Boolean,
    $parkingLots: Boolean,
    $cohosts: [CohostInput!],
    $deadlineAt: ISO8601DateTime,
    $communityDinner: Boolean,
    $partnerOrganizationName: String,
    $partnerOrganizationDescription: String,
    $partnerOrganizationLogoUrl: String,
    $tags: [String!],
    $catered: Boolean,
    $potluck: Boolean,
    $virtual: Boolean,
    $virtualLocation: String,
    $virtualResourceUrl: String,
    $extraDetails: Html,
    $pwyw: Boolean,
    $pwywMinimum: Int,
    $allowAdditionalGuests: Boolean,
    $hideGuestList: Boolean,
    $closedCaptioningAvailable: Boolean,
    $videosOnAsDefault: Boolean,
    $bathroomAccessible: Boolean,
    $partnershipCampaignId: Int,
    $additionalDetailFirst: String,
    $additionalDetailSecond: String,
    $additionalDetailThird: String,
    $additionalDetailFourth: String,
    $additionalDetailFifth: String,
    $showFullLocation: Boolean,
    $makeAllPrivate: Boolean
  ) {
    createEvent(input: {
      publish: $publish,
      potluckItemsObj: $potluckItemsObj,
      reservationQuestions: $reservationQuestions,
      eventType: $eventType,
      eventSubtypeId: $eventSubtypeId,
      eventSubtypeOther: $eventSubtypeOther,
      privacySubtypeId: $privacySubtypeId,
      scheduledAt: $scheduledAt,
      duration: $duration,
      fullAddress: $fullAddress,
      secondaryAddress: $secondaryAddress,
      areaId: $areaId,
      areaOther: $areaOther,
      location: $location,
      stateLocation: $stateLocation,
      timezoneOther: $timezoneOther,
      neighborhood: $neighborhood,
      neighborhoodId: $neighborhoodId,
      subneighborhood: $subneighborhood,
      title: $title,
      description: $description,
      notes: $notes,
      petsAllowed: $petsAllowed,
      alcoholPolicy: $alcoholPolicy,
      numberOfGuestsMin: $numberOfGuestsMin,
      numberOfGuestsMax: $numberOfGuestsMax,
      currency: $currency,
      pricePerPerson: $pricePerPerson,
      hostAbsorbsTransactionFee: $hostAbsorbsTransactionFee,
      explainPayment: $explainPayment,
      dietaryRestrictions: $dietaryRestrictions,
      coverUrl: $coverUrl,
      dressCode: $dressCode,
      accessible: $accessible,
      parkingLots: $parkingLots,
      cohosts: $cohosts,
      deadlineAt: $deadlineAt,
      communityDinner: $communityDinner,
      partnerOrganizationName: $partnerOrganizationName,
      partnerOrganizationDescription: $partnerOrganizationDescription,
      partnerOrganizationLogoUrl: $partnerOrganizationLogoUrl,
      tags: $tags,
      catered: $catered,
      potluck: $potluck,
      virtual: $virtual,
      virtualLocation: $virtualLocation,
      virtualResourceUrl: $virtualResourceUrl,
      extraDetails: $extraDetails,
      pwyw: $pwyw,
      pwywMinimum: $pwywMinimum,
      allowAdditionalGuests: $allowAdditionalGuests,
      hideGuestList: $hideGuestList,
      closedCaptioningAvailable: $closedCaptioningAvailable,
      videosOnAsDefault: $videosOnAsDefault,
      bathroomAccessible: $bathroomAccessible,
      partnershipCampaignId: $partnershipCampaignId,
      additionalDetailFirst: $additionalDetailFirst,
      additionalDetailSecond: $additionalDetailSecond,
      additionalDetailThird: $additionalDetailThird,
      additionalDetailFourth: $additionalDetailFourth,
      additionalDetailFifth: $additionalDetailFifth,
      showFullLocation: $showFullLocation
      makeAllPrivate: $makeAllPrivate
    }) {
      event {
        id
        uuid
        numberOfGuestsMax
        eventType
        nourishable
        title
        scheduledAt
        state
        reservations(filterByState: ACCEPTED) {
          edges { node { profile { id } state } }
        }
        eventHosts {
          edges { node { id creator profile { id firstName lastName } } }
        }
      }
      errors { message path }
    }
  }
`;

export type OTEventResult = {
  eventId: number;
  eventUuid: string;
};

/**
 * Creates a OneTable event and returns the event ID.
 */
export async function createOTEvent(
  token: string,
  location: OTLocation,
  meal: Meal,
  description: string
): Promise<OTEventResult | null> {
  const variables = {
    publish: true,
    eventType: "PRIVATE",
    eventSubtypeId: null,
    eventSubtypeOther: null,
    privacySubtypeId: 17,
    scheduledAt: meal.datetime ? toOTDatetime(meal.datetime) : new Date().toISOString(),
    duration: 7200,
    fullAddress: location.full_address,
    secondaryAddress: location.secondary_address || "",
    areaId: nearestAreaId(location.lat, location.lng),
    areaOther: "",
    location: { lat: location.lat, lng: location.lng },
    stateLocation: "",
    timezoneOther: "",
    neighborhood: location.neighborhood || "",
    neighborhoodId: null,
    subneighborhood: location.subneighborhood || "",
    title: meal.title,
    description: `<p>${description.replace(/\n/g, "</p><p>")}</p>`,
    notes: '{ "first": [], "second": [], "third": [] }',
    petsAllowed: false,
    alcoholPolicy: null,
    numberOfGuestsMin: 0,
    numberOfGuestsMax: 10,
    currency: "USD",
    pricePerPerson: null,
    hostAbsorbsTransactionFee: false,
    explainPayment: "",
    dietaryRestrictions: [],
    coverUrl: "https://ot-prd-upload.s3.amazonaws.com/stock/event_cover/event_cover/267/candle_cover.png",
    dressCode: null,
    accessible: false,
    parkingLots: false,
    cohosts: [],
    deadlineAt: null,
    communityDinner: false,
    partnerOrganizationName: null,
    partnerOrganizationDescription: null,
    partnerOrganizationLogoUrl: null,
    tags: [],
    catered: false,
    potluck: false,
    virtual: false,
    virtualLocation: "",
    virtualResourceUrl: "",
    extraDetails: "",
    pwyw: false,
    pwywMinimum: null,
    allowAdditionalGuests: true,
    hideGuestList: false,
    closedCaptioningAvailable: false,
    videosOnAsDefault: false,
    bathroomAccessible: false,
    partnershipCampaignId: null,
    additionalDetailFirst: "",
    additionalDetailSecond: "",
    additionalDetailThird: "",
    additionalDetailFourth: "",
    additionalDetailFifth: "",
    showFullLocation: false,
    makeAllPrivate: false,
    potluckItemsObj: [],
    reservationQuestions: [],
  };

  try {
    const data = await otRequest(token, "createEvent", variables, CREATE_EVENT_QUERY);
    if (data.errors) throw new Error(data.errors[0]?.message);
    const result = data.data?.createEvent;
    if (result?.errors?.length) throw new Error(result.errors[0]?.message);
    const eventId: number | undefined = result?.event?.id;
    const eventUuid: string | undefined = result?.event?.uuid;
    if (!eventId || !eventUuid) return null;

    // Log the full response so we can inspect reservations and eventHosts counts
    console.log("[OT] createEvent response:", JSON.stringify(result?.event, null, 2));

    return { eventId, eventUuid };
  } catch (err: any) {
    console.error("[OT] createEvent failed:", err.message);
    throw err;
  }
}

const UPDATE_EVENT_QUERY = `
  mutation updateEvent(
    $id: Int!,
    $createPotluckItemsObj: [CreatePotluckItemObjectInput!],
    $updatePotluckItems: [UpdatePotluckItemInput!],
    $destroyPotluckItems: [Int!],
    $createReservationQuestions: [ReservationQuestionInput!],
    $updateReservationQuestions: [UpdateReservationQuestionInput!],
    $destroyReservationQuestions: [Int!],
    $eventType: EventType!,
    $eventSubtypeId: Int,
    $eventSubtypeOther: String,
    $privacySubtypeId: Int,
    $scheduledAt: ISO8601DateTime!,
    $duration: Int,
    $fullAddress: String,
    $secondaryAddress: String,
    $areaId: Int!,
    $areaOther: String,
    $location: EventLocationInput,
    $stateLocation: String,
    $timezoneOther: String,
    $neighborhood: String,
    $neighborhoodId: Int,
    $subneighborhood: String,
    $title: String!,
    $description: Html!,
    $notes: String,
    $petsAllowed: Boolean,
    $alcoholPolicy: AlcoholPolicy,
    $numberOfGuestsMin: Int,
    $numberOfGuestsMax: Int!,
    $currency: Currency,
    $pricePerPerson: Int,
    $hostAbsorbsTransactionFee: Boolean,
    $explainPayment: String,
    $dietaryRestrictions: [DietaryRestriction!],
    $coverUrl: String,
    $dressCode: String,
    $accessible: Boolean,
    $parkingLots: Boolean,
    $cohosts: [CohostInput!],
    $deadlineAt: ISO8601DateTime,
    $communityDinner: Boolean,
    $partnerOrganizationName: String,
    $partnerOrganizationDescription: String,
    $partnerOrganizationLogoUrl: String,
    $tags: [String!],
    $catered: Boolean,
    $potluck: Boolean,
    $virtual: Boolean,
    $virtualLocation: String,
    $virtualResourceUrl: String,
    $extraDetails: Html,
    $pwyw: Boolean,
    $pwywMinimum: Int,
    $allowAdditionalGuests: Boolean,
    $hideGuestList: Boolean,
    $closedCaptioningAvailable: Boolean,
    $videosOnAsDefault: Boolean,
    $bathroomAccessible: Boolean,
    $partnershipCampaignId: Int,
    $additionalDetailFirst: String,
    $additionalDetailSecond: String,
    $additionalDetailThird: String,
    $additionalDetailFourth: String,
    $additionalDetailFifth: String,
    $showFullLocation: Boolean,
    $makeAllPrivate: Boolean
  ) {
    updateEvent(input: {
      id: $id,
      createPotluckItemsObj: $createPotluckItemsObj,
      updatePotluckItems: $updatePotluckItems,
      destroyPotluckItems: $destroyPotluckItems,
      createReservationQuestions: $createReservationQuestions,
      updateReservationQuestions: $updateReservationQuestions,
      destroyReservationQuestions: $destroyReservationQuestions,
      eventType: $eventType,
      eventSubtypeId: $eventSubtypeId,
      eventSubtypeOther: $eventSubtypeOther,
      privacySubtypeId: $privacySubtypeId,
      scheduledAt: $scheduledAt,
      duration: $duration,
      fullAddress: $fullAddress,
      secondaryAddress: $secondaryAddress,
      areaId: $areaId,
      areaOther: $areaOther,
      location: $location,
      stateLocation: $stateLocation,
      timezoneOther: $timezoneOther,
      neighborhood: $neighborhood,
      neighborhoodId: $neighborhoodId,
      subneighborhood: $subneighborhood,
      title: $title,
      description: $description,
      notes: $notes,
      petsAllowed: $petsAllowed,
      alcoholPolicy: $alcoholPolicy,
      numberOfGuestsMin: $numberOfGuestsMin,
      numberOfGuestsMax: $numberOfGuestsMax,
      currency: $currency,
      pricePerPerson: $pricePerPerson,
      hostAbsorbsTransactionFee: $hostAbsorbsTransactionFee,
      explainPayment: $explainPayment,
      dietaryRestrictions: $dietaryRestrictions,
      coverUrl: $coverUrl,
      dressCode: $dressCode,
      accessible: $accessible,
      parkingLots: $parkingLots,
      cohosts: $cohosts,
      deadlineAt: $deadlineAt,
      communityDinner: $communityDinner,
      partnerOrganizationName: $partnerOrganizationName,
      partnerOrganizationDescription: $partnerOrganizationDescription,
      partnerOrganizationLogoUrl: $partnerOrganizationLogoUrl,
      tags: $tags,
      catered: $catered,
      potluck: $potluck,
      virtual: $virtual,
      virtualLocation: $virtualLocation,
      virtualResourceUrl: $virtualResourceUrl,
      extraDetails: $extraDetails,
      pwyw: $pwyw,
      pwywMinimum: $pwywMinimum,
      allowAdditionalGuests: $allowAdditionalGuests,
      hideGuestList: $hideGuestList,
      closedCaptioningAvailable: $closedCaptioningAvailable,
      videosOnAsDefault: $videosOnAsDefault,
      bathroomAccessible: $bathroomAccessible,
      partnershipCampaignId: $partnershipCampaignId,
      additionalDetailFirst: $additionalDetailFirst,
      additionalDetailSecond: $additionalDetailSecond,
      additionalDetailThird: $additionalDetailThird,
      additionalDetailFourth: $additionalDetailFourth,
      additionalDetailFifth: $additionalDetailFifth,
      showFullLocation: $showFullLocation
      makeAllPrivate: $makeAllPrivate
    }) {
      event { id uuid state }
      errors { message path }
    }
  }
`;

/** Updates an existing OneTable event's time, location, and title. Returns true on success. */
export async function updateOTEvent(
  token: string,
  eventId: number,
  location: OTLocation,
  meal: Meal,
  description: string
): Promise<boolean> {
  const variables = {
    id: eventId,
    eventType: "PRIVATE",
    eventSubtypeId: null,
    eventSubtypeOther: null,
    privacySubtypeId: 17,
    scheduledAt: meal.datetime ? toOTDatetime(meal.datetime) : new Date().toISOString(),
    duration: 7200,
    fullAddress: location.full_address,
    secondaryAddress: location.secondary_address || "",
    areaId: nearestAreaId(location.lat, location.lng),
    areaOther: "",
    location: { lat: location.lat, lng: location.lng },
    stateLocation: "",
    timezoneOther: "",
    neighborhood: location.neighborhood || "",
    neighborhoodId: null,
    subneighborhood: location.subneighborhood || "",
    title: meal.title,
    description: `<p>${description.replace(/\n/g, "</p><p>")}</p>`,
    notes: '{ "first": [], "second": [], "third": [] }',
    petsAllowed: false,
    alcoholPolicy: null,
    numberOfGuestsMin: 0,
    numberOfGuestsMax: 10,
    currency: "USD",
    pricePerPerson: null,
    hostAbsorbsTransactionFee: false,
    explainPayment: "",
    dietaryRestrictions: [],
    coverUrl: "https://ot-prd-upload.s3.amazonaws.com/stock/cover/photo/231831/4.png",
    dressCode: null,
    accessible: false,
    parkingLots: false,
    cohosts: [],
    deadlineAt: null,
    communityDinner: false,
    partnerOrganizationName: null,
    partnerOrganizationDescription: null,
    partnerOrganizationLogoUrl: null,
    tags: [],
    catered: false,
    potluck: false,
    virtual: false,
    virtualLocation: "",
    virtualResourceUrl: "",
    extraDetails: null,
    pwyw: false,
    pwywMinimum: null,
    allowAdditionalGuests: true,
    hideGuestList: false,
    closedCaptioningAvailable: false,
    videosOnAsDefault: false,
    bathroomAccessible: false,
    partnershipCampaignId: null,
    additionalDetailFirst: "",
    additionalDetailSecond: "",
    additionalDetailThird: "",
    additionalDetailFourth: "",
    additionalDetailFifth: "",
    showFullLocation: false,
    makeAllPrivate: false,
    createPotluckItemsObj: [],
    updatePotluckItems: [],
    destroyPotluckItems: [],
    createReservationQuestions: [],
    updateReservationQuestions: [],
    destroyReservationQuestions: [],
  };

  try {
    console.log("[OT] updateEvent vars:", JSON.stringify({ id: eventId, scheduledAt: variables.scheduledAt, fullAddress: variables.fullAddress }));
    const data = await otRequest(token, "updateEvent", variables, UPDATE_EVENT_QUERY);
    console.log("[OT] updateEvent response:", JSON.stringify(data));
    if (data.errors) throw new Error(data.errors[0]?.message);
    const result = data.data?.updateEvent;
    if (result?.errors?.length) throw new Error(result.errors[0]?.message);
    return true;
  } catch (err: any) {
    if (isOneTableAuthError(err)) throw err;
    console.error("[OT] updateEvent failed:", err.message);
    return false;
  }
}

/** Convert ISO datetime to OneTable's format with offset. */
function toOTDatetime(iso: string): string {
  const d = new Date(iso);
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00${sign}${hh}:${mm}`;
}

// ─── Nourishment ──────────────────────────────────────────────────────────────

const NOURISHMENT_QUERY = `
  mutation($eventId: Int!, $sponsorships: [SponsorshipInput!]!, $answers: AllAnswerInput, $notifyCreator: Boolean) {
    updateSponsorships(input: {
      eventId: $eventId,
      sponsorships: $sponsorships,
      answers: $answers,
      notifyCreator: $notifyCreator
    }) {
      sponsorships { id amount sponsor { id name } }
      errors { message }
    }
  }
`;

/**
 * Requests nourishment for the event.
 * sponsorId 194 / $100 is the standard nourishment sponsor for area 1 (NYC UWS),
 * matching what requestNourishment.py uses. areaId is now picked dynamically
 * per event location (see nearestAreaId), but sponsorId is still hardcoded to
 * the NYC UWS sponsor for every area — OneTable hasn't given us a sponsorId
 * mapping for other areas, so nourishment requests outside NYC may be
 * rejected or misattributed until that mapping is available.
 */
export async function requestOTNourishment(
  token: string,
  eventId: number,
  sponsorId = 194,
  amountCents = 10000
): Promise<boolean> {
  const payload = {
    eventId,
    sponsorships: [{ sponsorId, amount: amountCents }],
    notifyCreator: true,
  };
  console.log("[OT] requestOTNourishment payload:", JSON.stringify(payload));
  const data = await otRequest(token, undefined as any, payload, NOURISHMENT_QUERY);
  console.log("[OT] requestOTNourishment response:", JSON.stringify(data));
  if (data.errors) throw new Error(data.errors[0]?.message ?? "Nourishment GraphQL error");
  const result = data.data?.updateSponsorships;
  if (result?.errors?.length) throw new Error(result.errors[0]?.message ?? "Nourishment failed");
  return true;
}

// ─── Reservations ─────────────────────────────────────────────────────────────

const CREATE_RESERVATION_QUERY = `
  mutation createReservation(
    $eventId: Int!,
    $additionalGuests: [AdditionalGuestInput!],
    $rsvpNote: Html,
    $couponId: Int,
    $donation: Int,
    $tables: [ReservationTableInput!],
    $claimedPotluckItems: [ReservationClaimedPotluckItemInput!],
    $answers: [AnswerInput!],
    $pwywAmount: Int,
    $payment: ReservationPaymentInput,
    $includeInMailingList: Boolean
  ) {
    createReservation(input: {
      eventId: $eventId,
      additionalGuests: $additionalGuests,
      rsvpNote: $rsvpNote,
      couponId: $couponId,
      donation: $donation,
      tables: $tables,
      claimedPotluckItems: $claimedPotluckItems,
      answers: $answers,
      pwywAmount: $pwywAmount,
      payment: $payment,
      includeInMailingList: $includeInMailingList
    }) {
      reservation { id state profile { id } }
      errors { message path }
    }
  }
`;

/** Creates a reservation for the given event. Returns reservation ID or null. */
export async function createOTReservation(
  guestToken: string,
  eventId: number
): Promise<number | null> {
  try {
    const variables = { eventId, additionalGuests: [], rsvpNote: "", donation: 0, tables: null, claimedPotluckItems: [], answers: [], includeInMailingList: false };
    console.log("[OT] createReservation vars:", JSON.stringify(variables));
    const data = await otRequest(guestToken, "createReservation", variables, CREATE_RESERVATION_QUERY);
    console.log("[OT] createReservation response:", JSON.stringify(data));
    if (data.errors) throw new Error(data.errors[0]?.message);
    const result = data.data?.createReservation;
    if (result?.errors?.length) throw new Error(result.errors[0]?.message);
    return result?.reservation?.id ?? null;
  } catch (err: any) {
    if (isOneTableAuthError(err)) throw err;
    console.error("[OT] createReservation failed:", err.message);
    return null;
  }
}

const ACCEPT_RESERVATION_QUERY = `
  mutation acceptReservation($id: Int, $reservationIds: [Int!], $message: Html) {
    acceptReservation(input: { id: $id, reservationIds: $reservationIds, message: $message }) {
      reservation { id state profile { id } event { id } }
      errors { reservationId message }
    }
  }
`;

/** Accepts a reservation (called with the host's token). Returns true on success. */
export async function acceptOTReservation(
  hostToken: string,
  reservationId: number
): Promise<boolean> {
  try {
    const variables = { id: reservationId, reservationIds: [], message: "" };
    console.log("[OT] acceptReservation vars:", JSON.stringify(variables));
    const data = await otRequest(hostToken, "acceptReservation", variables, ACCEPT_RESERVATION_QUERY);
    console.log("[OT] acceptReservation response:", JSON.stringify(data));
    if (data.errors) { console.error("[OT] acceptReservation top-level errors:", data.errors); return false; }
    const errs = data.data?.acceptReservation?.errors;
    if (errs?.length) { console.error("[OT] acceptReservation result errors:", errs); return false; }
    return true;
  } catch (err: any) {
    if (isOneTableAuthError(err)) throw err;
    console.error("[OT] acceptReservation failed:", err.message);
    return false;
  }
}

const CANCEL_RESERVATION_QUERY = `
  mutation cancelReservation($reservationId: Int!, $cancelReason: String, $cancelReasonText: String) {
    cancelReservation(input: {
      id: $reservationId,
      cancelReason: $cancelReason,
      cancelReasonText: $cancelReasonText
    }) {
      reservation { id state }
      errors { message }
    }
  }
`;

/** Cancels a reservation. Returns true on success. */
export async function cancelOTReservation(
  token: string,
  reservationId: number
): Promise<boolean> {
  try {
    const data = await otRequest(token, "cancelReservation", {
      reservationId,
      cancelReason: "",
      cancelReasonText: "",
    }, CANCEL_RESERVATION_QUERY);
    if (data.errors) return false;
    return !(data.data?.cancelReservation?.errors?.length);
  } catch (err) {
    if (isOneTableAuthError(err)) throw err;
    return false;
  }
}

const CANCEL_EVENT_QUERY = `
  mutation EventCancel($eventId: Int!, $cancelReason: String, $cancelReasonText: String) {
    cancelEvent(input: {
      id: $eventId,
      cancelReason: $cancelReason,
      cancelReasonText: $cancelReasonText
    }) {
      clientMutationId
    }
  }
`;

/** Cancels a OneTable event (called with the host's token). Returns true on success. */
export async function cancelOTEvent(
  hostToken: string,
  eventId: number
): Promise<boolean> {
  try {
    const data = await otRequest(hostToken, "EventCancel", {
      eventId,
      cancelReason: "",
      cancelReasonText: "",
    }, CANCEL_EVENT_QUERY);
    return !data.errors;
  } catch (err) {
    if (isOneTableAuthError(err)) throw err;
    return false;
  }
}
