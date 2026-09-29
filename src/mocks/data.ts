import type { QueueEntry, QueueInfo } from "../types/queue";

const now = Date.now();

export const queues: QueueInfo[] = [
  { id: "general", name: "General Consultation" },
  { id: "priority", name: "Priority Care" },
  { id: "lab", name: "Laboratory" },
];

export const queueEntries: QueueEntry[] = [
  {
    id: "q-001",
    queueId: "general",
    queueName: "General Consultation",
    position: 1,
    waitMins: 42,
    status: "waiting",
    updatedAt: new Date(now).toISOString(),
    customer: {
      id: "c-001",
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      email: "aarav@example.com",
      visitReason: "General Consultation",
      notes: "First visit. Asked for morning appointment.",
      createdBy: "Front Desk",
      insuranceId: "INS-10482",
      dateOfBirth: "1997-04-18",
      preferredLanguage: "English",
      appointmentTime: "10:30 AM",
      department: "General Medicine",
      priority: "high",
      createdAt: new Date(now - 42 * 60_000).toISOString(),
    },
  },
  {
    id: "q-002",
    queueId: "general",
    queueName: "General Consultation",
    position: 2,
    waitMins: 28,
    status: "waiting",
    updatedAt: new Date(now).toISOString(),
    customer: {
      id: "c-002",
      name: "Priya Verma",
      phone: "+91 98765 12345",
      email: "priya@example.com",
      visitReason: "Follow-up",
      notes: "Previous consultation completed last month.",
      createdBy: "Reception",
      insuranceId: "INS-20831",
      dateOfBirth: "1992-08-09",
      preferredLanguage: "Hindi",
      appointmentTime: "11:00 AM",
      department: "General Medicine",
      priority: "normal",
      createdAt: new Date(now - 28 * 60_000).toISOString(),
    },
  },
  {
    id: "q-003",
    queueId: "general",
    queueName: "General Consultation",
    position: 3,
    waitMins: 18,
    status: "waiting",
    updatedAt: new Date(now).toISOString(),
    customer: {
      id: "c-003",
      name: "Rahul Singh",
      phone: "+91 99887 66554",
      email: "rahul@example.com",
      visitReason: "Blood Test",
      notes: "Needs report urgently.",
      createdBy: "Reception",
      insuranceId: "INS-33419",
      dateOfBirth: "1988-02-22",
      preferredLanguage: "English",
      appointmentTime: "11:20 AM",
      department: "Laboratory",
      priority: "normal",
      createdAt: new Date(now - 18 * 60_000).toISOString(),
    },
  },
  {
    id: "q-004",
    queueId: "general",
    queueName: "General Consultation",
    position: 4,
    waitMins: 9,
    status: "waiting",
    updatedAt: new Date(now).toISOString(),
    customer: {
      id: "c-004",
      name: "Neha Gupta",
      phone: "+91 91234 56789",
      email: "neha@example.com",
      visitReason: "Routine Checkup",
      notes: "Appointment at 4 PM.",
      createdBy: "Front Desk",
      insuranceId: "INS-44102",
      dateOfBirth: "1995-12-12",
      preferredLanguage: "Hindi",
      appointmentTime: "11:45 AM",
      department: "General Medicine",
      priority: "normal",
      createdAt: new Date(now - 9 * 60_000).toISOString(),
    },
  },
  {
    id: "q-005",
    queueId: "general",
    queueName: "General Consultation",
    position: 5,
    waitMins: 5,
    status: "waiting",
    updatedAt: new Date(now).toISOString(),
    customer: {
      id: "c-005",
      name: "Vikram Mehta",
      phone: "+91 90000 11223",
      email: "vikram@example.com",
      visitReason: "Prescription Review",
      notes: "Bring previous prescription.",
      createdBy: "Front Desk",
      insuranceId: "INS-55201",
      dateOfBirth: "1984-06-02",
      preferredLanguage: "English",
      appointmentTime: "12:00 PM",
      department: "General Medicine",
      priority: "normal",
      createdAt: new Date(now - 5 * 60_000).toISOString(),
    },
  },
  {
    id: "q-006",
    queueId: "general",
    queueName: "General Consultation",
    position: 6,
    waitMins: 2,
    status: "waiting",
    updatedAt: new Date(now).toISOString(),
    customer: {
      id: "c-006",
      name: "Sanya Kapoor",
      phone: "+91 90000 33445",
      email: "sanya@example.com",
      visitReason: "New consultation",
      notes: "Arrived through front desk.",
      createdBy: "Front Desk",
      insuranceId: "INS-66302",
      dateOfBirth: "1990-05-15",
      preferredLanguage: "Hindi",
      appointmentTime: "Walk-in",
      department: "General Medicine",
      priority: "normal",
      createdAt: new Date(now - 2 * 60_000).toISOString(),
    },
  }
];

let arrivalCounter = 1;

export function maybeAddArrival() {
  if (Math.random() > 0.25) return;

  const waitingInGeneral = queueEntries.filter(
    (entry) => entry.queueId === "general" && entry.status === "waiting"
  );

  const createdAt = new Date().toISOString();

  queueEntries.push({
    id: `q-live-${arrivalCounter}`,
    queueId: "general",
    queueName: "General Consultation",
    position: waitingInGeneral.length + 1,
    waitMins: 0,
    status: "waiting",
    updatedAt: createdAt,
    customer: {
      id: `c-live-${arrivalCounter}`,
      name: `New Arrival ${arrivalCounter}`,
      phone: "+91 90000 00000",
      email: `arrival${arrivalCounter}@example.com`,
      visitReason: "New consultation",
      notes: "Arrived through front desk.",
      createdBy: "Front Desk",
      insuranceId: `INS-LIVE-${arrivalCounter}`,
      dateOfBirth: "1999-01-01",
      preferredLanguage: "English",
      appointmentTime: "Walk-in",
      department: "General Medicine",
      priority: "normal",
      createdAt,
    },
  });

  arrivalCounter += 1;
}