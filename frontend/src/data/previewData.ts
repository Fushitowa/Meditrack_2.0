export interface Patient {
  initials: string;
  name: string;
  id: string;
  date: string;
  doctor: string;
  status: string;
  color: string;
  age: number;
  email: string;
  phone: string;
  condition: string;
}

export interface Doctor {
  initials: string;
  name: string;
  specialty: string;
  color: string;
  availability: string;
  email: string;
  phone: string;
  patientCount: number;
}

export interface Appointment {
  time: string;
  displayTime: string;
  name: string;
  patientId: string;
  age: number;
  reason: string;
  doctor: string;
  initials: string;
  color: string;
  status: string;
}

export interface ClinicalRecord {
  id: string;
  patient: string;
  patientId: string;
  date: string;
  doctor: string;
  diagnosis: string;
  type: string;
  status: string;
}

export const patients: Patient[] = [];

export const doctors: Doctor[] = [
  { initials: "EC", name: "Ethan Cole", specialty: "Cardiology", color: "blue", availability: "Available", email: "ethan.cole@example.test", phone: "(555) 010-1001", patientCount: 0 },
  { initials: "OB", name: "Olivia Bennett", specialty: "Pediatrics", color: "peach", availability: "With patient", email: "olivia.bennett@example.test", phone: "(555) 010-1002", patientCount: 0 },
  { initials: "NW", name: "Noah Williams", specialty: "Family medicine", color: "mint", availability: "Available", email: "noah.williams@example.test", phone: "(555) 010-1003", patientCount: 0 },
];

export const appointments: Appointment[] = [];

export const clinicalRecords: ClinicalRecord[] = [];

export const recentActivity: { title: string; detail: string; time: string; color: string }[] = [];
