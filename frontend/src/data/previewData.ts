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

export const patients: Patient[] = [
  { initials: "AM", name: "Amelia Morgan", id: "PT-2048", date: "Today, 9:42 AM", doctor: "Dr. Ethan Cole", status: "Checked in", color: "lavender", age: 34, email: "amelia.morgan@example.test", phone: "(555) 010-2048", condition: "Annual check-up" },
  { initials: "JW", name: "James Wilson", id: "PT-2047", date: "Today, 9:18 AM", doctor: "Dr. Olivia Bennett", status: "In consultation", color: "peach", age: 52, email: "james.wilson@example.test", phone: "(555) 010-2047", condition: "Follow-up visit" },
  { initials: "SP", name: "Sophia Patel", id: "PT-2046", date: "Today, 8:56 AM", doctor: "Dr. Ethan Cole", status: "Scheduled", color: "mint", age: 27, email: "sophia.patel@example.test", phone: "(555) 010-2046", condition: "General consultation" },
  { initials: "LB", name: "Liam Brooks", id: "PT-2045", date: "Yesterday, 4:30 PM", doctor: "Dr. Noah Williams", status: "Completed", color: "blue", age: 46, email: "liam.brooks@example.test", phone: "(555) 010-2045", condition: "Blood pressure review" },
  { initials: "ER", name: "Emma Richardson", id: "PT-2044", date: "Yesterday, 2:15 PM", doctor: "Dr. Ethan Cole", status: "Completed", color: "blue", age: 39, email: "emma.richardson@example.test", phone: "(555) 010-2044", condition: "Lab results review" },
];

export const doctors: Doctor[] = [
  { initials: "EC", name: "Ethan Cole", specialty: "Cardiology", color: "blue", availability: "Available", email: "ethan.cole@example.test", phone: "(555) 010-1001", patientCount: 142 },
  { initials: "OB", name: "Olivia Bennett", specialty: "Pediatrics", color: "peach", availability: "With patient", email: "olivia.bennett@example.test", phone: "(555) 010-1002", patientCount: 118 },
  { initials: "NW", name: "Noah Williams", specialty: "Family medicine", color: "mint", availability: "Available", email: "noah.williams@example.test", phone: "(555) 010-1003", patientCount: 96 },
];

export const appointments: Appointment[] = [
  { time: "09:30", displayTime: "09:30 AM", name: "Amelia Morgan", patientId: "PT-2048", age: 34, reason: "Annual check-up", doctor: "Dr. Ethan Cole", initials: "AM", color: "lavender", status: "Checked in" },
  { time: "10:00", displayTime: "10:00 AM", name: "James Wilson", patientId: "PT-2047", age: 52, reason: "Follow-up visit", doctor: "Dr. Olivia Bennett", initials: "JW", color: "peach", status: "In consultation" },
  { time: "10:30", displayTime: "10:30 AM", name: "Sophia Patel", patientId: "PT-2046", age: 27, reason: "General consultation", doctor: "Dr. Ethan Cole", initials: "SP", color: "mint", status: "Upcoming" },
  { time: "11:15", displayTime: "11:15 AM", name: "Liam Brooks", patientId: "PT-2045", age: 46, reason: "Blood pressure review", doctor: "Dr. Noah Williams", initials: "LB", color: "blue", status: "Upcoming" },
  { time: "11:45", displayTime: "11:45 AM", name: "Emma Richardson", patientId: "PT-2044", age: 39, reason: "Lab results review", doctor: "Dr. Ethan Cole", initials: "ER", color: "blue", status: "Upcoming" },
];

export const clinicalRecords: ClinicalRecord[] = [
  { id: "CR-5108", patient: "Amelia Morgan", patientId: "PT-2048", date: "Today, 9:50 AM", doctor: "Dr. Ethan Cole", diagnosis: "Routine examination", type: "Consultation", status: "Signed" },
  { id: "CR-5107", patient: "James Wilson", patientId: "PT-2047", date: "Today, 9:25 AM", doctor: "Dr. Olivia Bennett", diagnosis: "Follow-up assessment", type: "Follow-up", status: "In progress" },
  { id: "CR-5106", patient: "Sophia Patel", patientId: "PT-2046", date: "Yesterday, 3:10 PM", doctor: "Dr. Ethan Cole", diagnosis: "General consultation", type: "Consultation", status: "Awaiting review" },
  { id: "CR-5105", patient: "Liam Brooks", patientId: "PT-2045", date: "Yesterday, 1:35 PM", doctor: "Dr. Noah Williams", diagnosis: "Blood pressure review", type: "Follow-up", status: "Signed" },
];

export const recentActivity = [
  { title: "Clinical note added", detail: "Dr. Ethan Cole · Amelia Morgan", time: "12 min ago", color: "mint" },
  { title: "Patient record updated", detail: "Dr. Olivia Bennett · James Wilson", time: "38 min ago", color: "lavender" },
  { title: "Prescription renewed", detail: "Dr. Noah Williams · Liam Brooks", time: "1 hour ago", color: "peach" },
];
