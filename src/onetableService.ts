import type { Meal } from "./types";

const OT_API = "https://app-prod.internal.onetable.org/graphql";
const OT_FINGERPRINT = "d15058657f86f919b51f5c6912b88d5c";

async function otRequest(
  token: string,
  operationName: string | undefined,
  variables: Record<string, unknown>,
  query: string
): Promise<any> {
  const resp = await fetch(OT_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-browser-fingerprint": OT_FINGERPRINT,
    },
    body: JSON.stringify({ operationName, variables, query }),
  });
  if (!resp.ok) throw new Error(`OneTable API error: ${resp.status}`);
  return resp.json();
}

export type OTLocation = {
  full_address: string;
  secondary_address?: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  subneighborhood?: string;
};

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
    areaId: 1,
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
    numberOfGuestsMin: null,
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
    communityDinner: null,
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
 * matching what requestNourishment.py uses.
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
    const data = await otRequest(guestToken, "createReservation", {
      eventId,
      additionalGuests: [],
      rsvpNote: "",
      donation: 0,
      tables: null,
      claimedPotluckItems: [],
      answers: [],
      includeInMailingList: false,
    }, CREATE_RESERVATION_QUERY);
    if (data.errors) throw new Error(data.errors[0]?.message);
    const result = data.data?.createReservation;
    if (result?.errors?.length) throw new Error(result.errors[0]?.message);
    return result?.reservation?.id ?? null;
  } catch (err: any) {
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
    const data = await otRequest(hostToken, "acceptReservation", {
      id: reservationId,
      message: "",
      reservationIds: [],
    }, ACCEPT_RESERVATION_QUERY);
    if (data.errors) return false;
    return !(data.data?.acceptReservation?.errors?.length);
  } catch {
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
  } catch {
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
  } catch {
    return false;
  }
}
