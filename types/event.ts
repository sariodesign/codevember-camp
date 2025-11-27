interface Person {
  id?: string;
  email?: string;
  displayName?: string;
  self?: boolean;
}

interface EventDateTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

interface Attendee extends Person {
  organizer?: boolean;
  resource?: boolean;
  optional?: boolean;
  responseStatus?: string;
  comment?: string;
  additionalGuests?: number;
}

interface ConferenceEntryPoint {
  entryPointType?: string;
  uri?: string;
  label?: string;
  pin?: string;
  accessCode?: string;
  meetingCode?: string;
  passcode?: string;
  password?: string;
}

interface ConferenceSolution {
  key?: {
    type?: string;
  };
  name?: string;
  iconUri?: string;
}

interface ConferenceData {
  createRequest?: {
    requestId?: string;
    conferenceSolutionKey?: {
      type?: string;
    };
    status?: {
      statusCode?: string;
    };
  };
  entryPoints?: ConferenceEntryPoint[];
  conferenceSolution?: ConferenceSolution;
  conferenceId?: string;
  signature?: string;
  notes?: string;
}

interface Gadget {
  type?: string;
  title?: string;
  link?: string;
  iconLink?: string;
  width?: number;
  height?: number;
  display?: string;
  preferences?: Record<string, string>;
}

interface Reminders {
  useDefault?: boolean;
  overrides?: Array<{
    method?: string;
    minutes?: number;
  }>;
}

interface Source {
  url?: string;
  title?: string;
}

interface WorkingLocationProperties {
  type?: string;
  homeOffice?: string;
  customLocation?: {
    label?: string;
  };
  officeLocation?: {
    buildingId?: string;
    floorId?: string;
    floorSectionId?: string;
    deskId?: string;
    label?: string;
  };
}

interface OutOfOfficeProperties {
  autoDeclineMode?: string;
  declineMessage?: string;
}

interface FocusTimeProperties {
  autoDeclineMode?: string;
  declineMessage?: string;
  chatStatus?: string;
}

interface Attachment {
  fileUrl?: string;
  title?: string;
  mimeType?: string;
  iconLink?: string;
  fileId?: string;
}

interface BirthdayProperties {
  contact?: string;
  type?: string;
  customTypeName?: string;
}

export interface CalendarEvent {
  kind?: string;
  etag?: string;
  id: string;
  status?: string;
  htmlLink?: string;
  created?: string;
  updated?: string;
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  creator?: Person;
  organizer?: Person;
  start?: EventDateTime;
  end?: EventDateTime;
  endTimeUnspecified?: boolean;
  recurrence?: string[];
  recurringEventId?: string;
  originalStartTime?: EventDateTime;
  transparency?: string;
  visibility?: string;
  iCalUID?: string;
  sequence?: number;
  attendees?: Attendee[];
  attendeesOmitted?: boolean;
  extendedProperties?: {
    private?: Record<string, string>;
    shared?: Record<string, string>;
  };
  hangoutLink?: string;
  conferenceData?: ConferenceData;
  gadget?: Gadget;
  anyoneCanAddSelf?: boolean;
  guestsCanInviteOthers?: boolean;
  guestsCanModify?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  privateCopy?: boolean;
  locked?: boolean;
  reminders?: Reminders;
  source?: Source;
  workingLocationProperties?: WorkingLocationProperties;
  outOfOfficeProperties?: OutOfOfficeProperties;
  focusTimeProperties?: FocusTimeProperties;
  attachments?: Attachment[];
  birthdayProperties?: BirthdayProperties;
  eventType?: string;
}
