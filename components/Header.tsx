
import React from 'react';
import { User, PermissionLevel, SOSAlert, SOSAlertStatus } from '../types';

interface HeaderProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  sosAlerts: SOSAlert[];
  appLogoUrl: string;
  logoSize: number;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onLogout, sosAlerts, appLogoUrl, logoSize }) => {
  const newAlertsCount = sosAlerts.filter(a => a.status === SOSAlertStatus.New).length;

  const navItems = [
    { view: 'dashboard', label: 'แดชบอร์ด', icon: 'fa-solid fa-house', badge: 0 },
    ...(currentUser.permissionLevel === PermissionLevel.Admin
      ? [{ view: 'usermanagement', label: 'จัดการสมาชิก', icon: 'fa-solid fa-users-cog', badge: 0 }]
      : []),
    ...(currentUser.permissionLevel === PermissionLevel.Teacher || currentUser.permissionLevel === PermissionLevel.Admin
      ? [
          { view: 'points', label: 'ตัดคะแนน', icon: 'fa-solid fa-user-minus', badge: 0 },
          { view: 'sos_dashboard', label: 'จัดการเหตุ SOS', icon: 'fa-solid fa-clipboard-list', badge: newAlertsCount },
        ]
      : []),
    ...(currentUser.permissionLevel === PermissionLevel.Student
      ? [{ view: 'sos', label: 'แจ้งเหตุ SOS', icon: 'fa-solid fa-bell', badge: 0 }]
      : []),
    { view: 'lostfound', label: 'ของหาย', icon: 'fa-solid fa-magnifying-glass', badge: 0 },
    { view: 'profile', label: 'ข้อมูลส่วนตัว', icon: 'fa-solid fa-user', badge: 0 },
  ];

  const NavButton: React.FC<{ item: typeof navItems[0], isMobile?: boolean }> = ({ item, isMobile = false }) => (
    <button
      onClick={() => onNavigate(item.view)}
      className={isMobile 
        ? "relative flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium hover:bg-red-900 transition-colors flex-1"
        : "relative flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition-colors"
      }
    >
      <i className={`${item.icon} ${isMobile ? 'text-lg mb-1' : 'mr-2'}`}></i>
      <span>{item.label}</span>
      {item.badge > 0 && (
        <span className="absolute top-0 right-0 -mr-1 -mt-1 bg-yellow-400 text-red-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </button>
  );

  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] h-auto py-2">
           <div className="flex items-center">
             <div 
              style={{ height: `${logoSize}px`, width: `${logoSize}px` }} 
              className="flex items-center justify-center mr-3"
            >
              {appLogoUrl ? (
                <img 
                  src={appLogoUrl} 
                  alt="App Logo" 
                  className="max-h-full max-w-full object-contain filter invert brightness-0"
                />
              ) : (
                <i className="fa-solid fa-heart-pulse" style={{ fontSize: `${logoSize}px`, color: 'white'}}></i>
              )}
            </div>
            <h1 className="text-xl font-bold">SSTB Student Affairs</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <NavButton key={item.view} item={item} />
            ))}
          </nav>
          <div className="flex items-center">
            <div className="text-right mr-3 hidden sm:block">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-xs text-red-200">{currentUser.permissionLevel}{currentUser.class ? ` (${currentUser.class})` : ''}</p>
            </div>
             <img 
              onClick={() => onNavigate('profile')} 
              src={currentUser.profilePicture} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full border-2 border-red-200 cursor-pointer hover:opacity-80" 
            />
            <button onClick={onLogout} className="ml-4 p-2 rounded-full hover:bg-red-800 transition-colors" title="ออกจากระบบ">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </div>
       {/* Mobile Navigation */}
       <nav className="md:hidden bg-red-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-around py-2">
            {navItems.map(item => (
              <NavButton key={item.view} item={item} isMobile={true} />
            ))}
          </div>
        </nav>
    </header>
  );
};

export default Header;
