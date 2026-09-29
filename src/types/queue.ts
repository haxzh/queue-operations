export type QueueStatus = "waiting" | "called" | "served" | "no-show";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  visitReason: string;
  notes: string;
  createdBy: string;
  insuranceId: string;
  dateOfBirth: string;
  preferredLanguage: string;
  appointmentTime: string;
  department: string;
  priority: "normal" | "high";
  createdAt: string;
}

export interface QueueEntry {
  id: string;
  queueId: string;
  queueName: string;
  customer: Customer;
  position: number;
  waitMins: number;
  status: QueueStatus;
  updatedAt: string;
}

export interface QueueSummary {
  waiting: number;
  averageWait: number;
  longestWait: number;
}

export interface MoveQueuePayload {
  targetQueueId: string;
}

export interface QueueInfo {
  id: string;
  name: string;
}