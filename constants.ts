import { User, PermissionLevel, Location, BehaviorRule, IncidentCategory, LostAndFoundItem, ItemStatus, PointDeduction } from './types';

export const USERS: User[] = [
  { id: 't01', name: 'ว่าที่ ร.ต.ธีรเดช วีรทองประเสริฐ', email: 'theeradej.v@school.ac.th', permissionLevel: PermissionLevel.Admin, profilePicture: 'https://picsum.photos/seed/t01/100' },
  { id: 't02', name: 'ครูสมศรี ศรีสุข', email: 'somsri.s@school.ac.th', permissionLevel: PermissionLevel.Teacher, profilePicture: 'https://picsum.photos/seed/t02/100' },
  { id: 'a01', name: 'ผอ.วิชัย มีสุข', email: 'vichai.m@school.ac.th', permissionLevel: PermissionLevel.Admin, profilePicture: 'https://picsum.photos/seed/a01/100' },
  { id: 's01', name: 'เด็กชายมานะ รักเรียน', email: 'mana.r@student.school.ac.th', permissionLevel: PermissionLevel.Student, class: 'ม.1/1', profilePicture: 'https://picsum.photos/seed/s01/100' },
  { id: 's02', name: 'เด็กหญิงปิติ ยินดี', email: 'piti.y@student.school.ac.th', permissionLevel: PermissionLevel.Student, class: 'ม.1/2', profilePicture: 'https://picsum.photos/seed/s02/100' },
  { id: 's03', name: 'เด็กชายธีระ กล้าหาญ', email: 'teera.g@student.school.ac.th', permissionLevel: PermissionLevel.Student, class: 'ม.2/1', profilePicture: 'https://picsum.photos/seed/s03/100' },
];

export const LOCATIONS: Location[] = [
  { id: 'loc01', name: 'อาคาร 1 - ชั้น 1' },
  { id: 'loc02', name: 'โรงอาหาร 2' },
  { id: 'loc03', name: 'สนามฟุตบอล' },
  { id: 'loc04', name: 'ห้องสมุด' },
  { id: 'loc05', name: 'ลานจอดรถครู' },
  { id: 'loc06', name: 'สหกรณ์' },
];

export const BEHAVIOR_RULES: BehaviorRule[] = [
  { id: 'rule01', category: 'การแต่งกาย', behavior: 'ไม่ปักชื่อ', points: -5 },
  { id: 'rule02', category: 'การแต่งกาย', behavior: 'สวมรองเท้าผิดระเบียบ', points: -5 },
  { id: 'rule03', category: 'การตรงต่อเวลา', behavior: 'มาสายหลัง 8.00 น.', points: -10 },
  { id: 'rule04', category: 'พฤติกรรมการอยู่ร่วมกัน', behavior: 'ทิ้งขยะไม่เป็นที่', points: -3 },
  { id: 'rule05', category: 'พฤติกรรมการอยู่ร่วมกัน', behavior: 'ทะเลาะวิวาท', points: -20 },
  { id: 'rule06', category: 'ความรับผิดชอบ', behavior: 'ไม่ส่งการบ้าน', points: -5 },
];

export const INCIDENT_CATEGORIES: IncidentCategory[] = Object.values(IncidentCategory);

export const ITEM_CATEGORIES: string[] = [
  "กระเป๋า / ถุง", "อุปกรณ์อิเล็กทรอนิกส์", "เครื่องเขียน", "หนังสือ / สมุด", "เสื้อผ้า / ชุดพละ", "กุญแจ / ของใช้ส่วนตัว", "กระเป๋าสตางค์"
];

export const MOCK_LOST_ITEMS: LostAndFoundItem[] = [
    {
        id: 'li01',
        reporterId: 's02',
        reporterName: 'เด็กหญิงปิติ ยินดี',
        name: 'หูฟังไร้สายสีขาว',
        category: 'อุปกรณ์อิเล็กทรอนิกส์',
        description: 'หูฟังยี่ห้อ Apple AirPods Pro 2 อยู่ในเคสสีใส หายแถวๆโรงอาหาร 2 ตอนพักเที่ยง',
        locationId: 'loc02',
        status: ItemStatus.Searching,
        imageUrl: 'https://picsum.photos/seed/li01/400/300',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'li02',
        reporterId: 't01',
        reporterName: 'ว่าที่ ร.ต.ธีรเดช วีรทองประเสริฐ',
        name: 'กระเป๋าสตางค์สีดำ',
        category: 'กระเป๋าสตางค์',
        description: 'เจอที่ห้องสมุดใต้โต๊ะริมหน้าต่าง มีบัตรนักเรียนของ ด.ช. ธีระ อยู่ข้างใน',
        locationId: 'loc04',
        status: ItemStatus.Found,
        imageUrl: 'https://picsum.photos/seed/li02/400/300',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'li03',
        reporterId: 's03',
        reporterName: 'เด็กชายธีระ กล้าหาญ',
        name: 'หนังสือเรียนคณิตศาสตร์ ม.2',
        category: 'หนังสือ / สมุด',
        description: 'น่าจะลืมไว้ที่สนามฟุตบอลหลังเลิกเรียน',
        locationId: 'loc03',
        status: ItemStatus.Searching,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: 'li04',
        reporterId: 's01',
        reporterName: 'เด็กชายมานะ รักเรียน',
        name: 'กุญแจบ้าน',
        category: 'กุญแจ / ของใช้ส่วนตัว',
        description: 'มีพวงกุญแจรูปแมวสีส้ม',
        locationId: 'loc01',
        status: ItemStatus.Claimed,
        imageUrl: 'https://picsum.photos/seed/li04/400/300',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
    }
];

export const MOCK_DEDUCTIONS: PointDeduction[] = [
  {id: 'd01', studentId: 's02', teacherId: 't01', ruleId: 'rule03', locationId: 'loc01', notes: 'มาถึงโรงเรียนเวลา 8.15 น.', date: new Date(Date.now() - 86400000 * 2).toISOString()},
  {id: 'd02', studentId: 's03', teacherId: 't02', ruleId: 'rule01', locationId: 'loc02', notes: '', date: new Date(Date.now() - 86400000).toISOString()},
];