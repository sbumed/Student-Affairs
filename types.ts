export enum PermissionLevel {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
  Staff = 'Staff',
}

export interface User {
  id: string;
  name: string;
  email: string;
  permissionLevel: PermissionLevel;
  class?: string; // For students
  profilePicture: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface BehaviorRule {
  id: string;
  category: string;
  behavior: string;
  points: number;
}

export interface PointDeduction {
  id: string;
  studentId: string;
  teacherId: string;
  ruleId: string;
  locationId: string;
  notes: string;
  date: string;
}

export enum IncidentCategory {
  Accident = "อุบัติเหตุ / ต้องการปฐมพยาบาล",
  Bullying = "การกลั่นแกล้ง / Bullying",
  Conflict = "การทะเลาะวิวาท",
  Violation = "พบเห็นการทำผิดกฎ (เช่น สูบบุหรี่)",
  Maintenance = "พื้นที่/อุปกรณ์ชำรุด",
  Other = "เรื่องด่วนอื่นๆ",
}

export enum SOSAlertStatus {
  New = 'ใหม่',
  Acknowledged = 'รับทราบแล้ว',
}

export interface SOSAlert {
  id: string;
  studentId?: string; // For logged-in students
  studentName: string; // For guests or to store name directly
  studentClass?: string; // For guests
  category: IncidentCategory;
  description: string;
  location: string;
  contactInfo: string;
  timestamp: string;
  status: SOSAlertStatus;
  acknowledgedBy?: string; // Teacher ID
  imageUrl?: string;
}


export enum ItemStatus {
  Searching = "กำลังตามหา",
  Found = "พบแล้ว-รอเจ้าของ",
  Claimed = "รับคืนแล้ว",
}

export interface LostAndFoundItem {
  id: string;
  reporterId?: string;
  reporterName: string;
  name: string;
  category: string;
  description: string;
  locationId: string;
  status: ItemStatus;
  imageUrl?: string;
  timestamp: string;
}