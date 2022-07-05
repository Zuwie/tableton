export const ROUTES = {
  ROOT: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  JOIN: "/join",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  MATCH_REQUESTS: "/matchrequests",
  PLAYERS: "/players",
  FEATURES: "/features",
  ROADMAP: "/roadmap",
  PROFILE: "/profile",
  ONBOARDING: "/profile/onboarding",
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
};

export const GAME_SYSTEM = {
  WARHAMMER_40K: "Warhammer 40k",
  AGE_OF_SIGMAR: "Age of Sigmar",
  HORUS_HERESY: "Horus Heresy",
  KILLTEAM: "Killteam",
  BLOOD_BOWL: "Blood Bowl",
  UNDERWORLDS: "Underworlds",
  NECROMUNDA: "Necromunda",
  OTHER: "Other",
};

export const FACTIONS = {
  SPACE_MARINES: "Space Marines",
  ADEPTA_SORORITAS: "Adepta Sororitas",
  ADEPTUS_CUSTODES: "Adeptus Custodes",
  ADEPTUS_MECHANICUS: "Adeptus Mechanicus",
  ASTRA_CARTOGRAPHICA: "Astra Cartographica",
  ASTRA_MILITARUM: "Astra Militarum",
  GREY_KNIGHTS: "Grey Knights",
  IMPERIAL_KNIGHTS: "Imperial Knights",
  INQUISITION: "Inquisition",
  OFFICIO_ASSASINORUM: "Officio Assassinorum",
  ROGUE_TRADERS: "Rogue Traders",
  TITAN_LEGIONS: "Titan Legions",
  CHAOS_DAEMONS: "Chaos Daemons",
  CHAOS_KNIGHTS: "Chaos Knights",
  CHAOS_SPACE_MARINES: "Chaos Space Marines",
  DEATH_GUARD: "Death Guard",
  HERETIC_TITAN_LEGIONS: "Heretic Titan Legions",
  RENEGADES_AND_HERETICS: "Renegades and Heretics",
  THOUSAND_SONS: "Thousand Sons",
  AELDARI: "Aeldari",
  DRUKHARI: "Drukhari",
  GENESTEALER_CULTS: "Genestealer Cults",
  NECRONS: "Necrons",
  ORKS: "Orks",
  TAU_EMPIRE: "T’au Empire",
  TYRANIDS: "Tyranids",
  UNALIGNED: "Unaligned",
};

export type NotificationsType = "MATCH_REQUEST_NEW" | "MATCH_REQUEST_ACCEPTED";

type Notifications = {
  [key in NotificationsType]: string;
};

export const NOTIFICATIONS: Notifications = {
  MATCH_REQUEST_NEW: "You have a new match-request.",
  MATCH_REQUEST_ACCEPTED: "Your match-request was accepted!",
};

export const CONTACT = {
  DISCORD: "992115444322406510",
  EMAIL: "rs.frontend@gmail.com",
  TWITTER: "https://twitter.com/RS_Webdev",
};

export const DEFAULT_CARD_COLOR = ["white", "gray.800"] as const;
