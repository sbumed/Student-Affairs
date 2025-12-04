
import React from 'react';
import { User, PermissionLevel } from '../types';

interface DashboardProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

const DashboardCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void }> = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer p-6 flex flex-col items-center text-center"
  >
    <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
      <i className={`${icon} text-4xl`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onNavigate }) => {
  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="bg-red-600 text-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-3xl font-bold">ยินดีต้อนรับ, {currentUser.name}</h2>
        <p className="mt-2">เลือกเมนูที่ต้องการเพื่อเริ่มต้นใช้งานระบบ SSTB Student Affairs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentUser.permissionLevel === PermissionLevel.Admin && (
             <DashboardCard
              title="จัดการสมาชิก"
              description="เพิ่ม ลบ และแก้ไขข้อมูลผู้ใช้งานในระบบ"
              icon="fa-solid fa-users-cog"
              onClick={() => onNavigate('usermanagement')}
            />
        )}
        {(currentUser.permissionLevel === PermissionLevel.Teacher || currentUser.permissionLevel === PermissionLevel.Admin) && (
          <>
            <DashboardCard
              title="ระบบตัดคะแนน"
              description="บันทึกพฤติกรรมและตัดคะแนนความประพฤตินักเรียน"
              icon="fa-solid fa-user-minus"
              onClick={() => onNavigate('points')}
            />
            <DashboardCard
              title="จัดการเหตุฉุกเฉิน"
              description="ตรวจสอบและรับเรื่องแจ้งเหตุ SOS จากนักเรียน"
              icon="fa-solid fa-clipboard-list"
              onClick={() => onNavigate('sos_dashboard')}
            />
          </>
        )}
        {currentUser.permissionLevel === PermissionLevel.Student && (
          <DashboardCard
            title="แจ้งเหตุฉุกเฉิน (SOS)"
            description="ส่งสัญญาณขอความช่วยเหลือด่วนไปยังเจ้าหน้าที่"
            icon="fa-solid fa-bell"
            onClick={() => onNavigate('sos')}
          />
        )}
        <DashboardCard
          title="ระบบของหาย (Lost & Found)"
          description="แจ้งของหายและค้นหาของที่พบภายในโรงเรียน"
          icon="fa-solid fa-magnifying-glass"
          onClick={() => onNavigate('lostfound')}
        />
        <DashboardCard
          title="ข้อมูลส่วนตัว"
          description="ดูและจัดการข้อมูลส่วนตัวของคุณ"
          icon="fa-solid fa-user"
          onClick={() => onNavigate('profile')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
