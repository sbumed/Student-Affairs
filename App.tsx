
import React, { useState, useEffect } from 'react';
import { User, SOSAlert, IncidentCategory, SOSAlertStatus, PermissionLevel } from './types';
import { USERS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PointDeductionModule from './components/PointDeduction';
import SOSAlertModule from './components/SOSAlert';
import LostAndFoundModule from './components/LostAndFound';
import UserProfile from './components/UserProfile';
import SOSDashboard from './components/SOSDashboard';
import UserManagementModule from './components/UserManagement';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onGuestAccess: () => void;
  appLogoUrl: string;
  logoSize: number;
  users: User[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuestAccess, appLogoUrl, logoSize, users }) => {
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const staffUsers = users.filter(u => u.permissionLevel === PermissionLevel.Admin || u.permissionLevel === PermissionLevel.Teacher);

  if (showStaffLogin) {
    return (
      <div className="min-h-screen bg-red-800 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-xl relative animate-fade-in-up">
          <button onClick={() => setShowStaffLogin(false)} className="absolute top-3 left-3 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full">
            <i className="fa-solid fa-arrow-left"></i> กลับ
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">เข้าสู่ระบบ (เจ้าหน้าที่)</h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {staffUsers.map(user => (
              <button
                key={user.id}
                onClick={() => onLogin(user)}
                className="w-full flex items-center p-3 bg-gray-50 hover:bg-red-100 border border-gray-200 rounded-lg transition-colors"
              >
                <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.permissionLevel}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-700 flex flex-col items-center justify-center p-4">
       <div className="text-center text-white mb-8 flex items-center justify-center">
        <div 
          style={{ height: `${logoSize * 1.5}px`, width: `${logoSize * 1.5}px` }} 
          className="flex items-center justify-center mr-4"
        >
          {appLogoUrl ? (
            <img 
              src={appLogoUrl} 
              alt="App Logo" 
              className="max-h-full max-w-full object-contain filter invert brightness-0"
            />
          ) : (
            <i className="fa-solid fa-heart-pulse" style={{ fontSize: `${logoSize * 1.5}px`, color: 'white'}}></i>
          )}
        </div>
        <div>
            <h1 className="text-4xl font-bold">SSTB Student Affairs</h1>
            <p className="mt-2 text-red-200 text-left">ระบบงานกิจการนักเรียน</p>
        </div>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">กรุณาเลือกประเภทผู้ใช้งาน</h2>
        <div className="space-y-4">
           <button
            onClick={onGuestAccess}
            className="w-full text-left p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <i className="fa-solid fa-child text-4xl text-blue-500 mr-6 w-12 text-center"></i>
            <div>
              <p className="font-bold text-xl text-blue-800">สำหรับนักเรียน</p>
              <p className="text-sm text-blue-600">แจ้งเหตุฉุกเฉิน / ติดตามของหาย</p>
            </div>
          </button>
          <button
            onClick={() => setShowStaffLogin(true)}
            className="w-full text-left p-6 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <i className="fa-solid fa-user-shield text-4xl text-red-500 mr-6 w-12 text-center"></i>
            <div>
              <p className="font-bold text-xl text-red-800">สำหรับเจ้าหน้าที่</p>
              <p className="text-sm text-red-600">จัดการระบบ / ตัดคะแนน / รับแจ้งเหตุ</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const GuestDashboardCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void }> = ({ title, description, icon, onClick }) => (
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestView, setGuestView] = useState<'dashboard' | 'sos' | 'lostfound'>('dashboard');
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [appLogoUrl, setAppLogoUrl] = useState<string>('');
  const [logoSize, setLogoSize] = useState<number>(32);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from local storage or initialize
    const savedUsers = localStorage.getItem('appUsers');
    setUsers(savedUsers ? JSON.parse(savedUsers) : USERS);

    const savedLogo = localStorage.getItem('appLogoUrl');
    if (savedLogo) setAppLogoUrl(savedLogo);
    
    const savedSize = localStorage.getItem('logoSize');
    if (savedSize) setLogoSize(Number(savedSize));
  }, []);
  
  // Persist users to local storage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('appUsers', JSON.stringify(users));
    }
  }, [users]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsGuestMode(false);
    setCurrentView('dashboard');
  };

  const handleGuestAccess = () => {
    setIsGuestMode(true);
    setGuestView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsGuestMode(false);
  };
  
  const [currentView, setCurrentView] = useState('dashboard');
  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleAddSOSAlert = (alertData: Omit<SOSAlert, 'id' | 'timestamp' | 'status' | 'acknowledgedBy'>) => {
    const newAlert: SOSAlert = {
      ...alertData,
      id: `sos${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: SOSAlertStatus.New,
    };
    setSosAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  };

  const handleUpdateSOSStatus = (alertId: string, teacher: User) => {
    setSosAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: SOSAlertStatus.Acknowledged, acknowledgedBy: teacher.id }
          : alert
      )
    );
  };

  const handleLogoChange = (logoDataUrl: string) => {
    setAppLogoUrl(logoDataUrl);
    localStorage.setItem('appLogoUrl', logoDataUrl);
  };

  const handleLogoSizeChange = (newSize: number) => {
    setLogoSize(newSize);
    localStorage.setItem('logoSize', newSize.toString());
  };
  
  const handleAddUser = (newUser: Omit<User, 'id' | 'profilePicture'>) => {
     const userWithId: User = {
        ...newUser,
        id: newUser.permissionLevel === PermissionLevel.Student ? `s${Date.now()}` : `t${Date.now()}`,
        profilePicture: `https://picsum.photos/seed/${Date.now()}/100`
     };
     setUsers(prev => [...prev, userWithId]);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if(currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
        alert('คุณไม่สามารถลบบัญชีของตัวเองได้');
        return;
    }
      
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    const adminCount = users.filter(u => u.permissionLevel === PermissionLevel.Admin).length;
    if (userToDelete.permissionLevel === PermissionLevel.Admin && adminCount <= 1) {
        alert('ไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้');
        return;
    }

    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน "${userToDelete.name}"?`)) {
        setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />;
      case 'usermanagement':
        return <UserManagementModule currentUser={currentUser} users={users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} />;
      case 'points':
        return <PointDeductionModule currentUser={currentUser} users={users} />;
      case 'sos':
        return <SOSAlertModule currentUser={currentUser} onAddAlert={handleAddSOSAlert} sosAlerts={sosAlerts} users={users} />;
      case 'sos_dashboard':
        return <SOSDashboard currentUser={currentUser} alerts={sosAlerts} onUpdateStatus={handleUpdateSOSStatus} users={users} />;
      case 'lostfound':
        return <LostAndFoundModule currentUser={currentUser} users={users} />;
      case 'profile':
        return <UserProfile currentUser={currentUser} onLogoChange={handleLogoChange} logoSize={logoSize} onLogoSizeChange={handleLogoSizeChange} onUpdateUser={handleUpdateUser} />;
      default:
        return <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />;
    }
  };
  
  if (!currentUser && !isGuestMode) {
    return <LoginScreen onLogin={handleLogin} onGuestAccess={handleGuestAccess} appLogoUrl={appLogoUrl} logoSize={logoSize} users={users} />;
  }

  if (isGuestMode) {
    const GuestHeader = () => (
        <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <div className="flex items-center">
                    <i className="fa-solid fa-child text-2xl mr-3"></i>
                    <h1 className="text-xl font-bold">สำหรับนักเรียน</h1>
                </div>
                <button onClick={() => setIsGuestMode(false)} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-800 transition-colors">
                    <i className="fa-solid fa-house mr-2"></i>
                    กลับหน้าหลัก
                </button>
            </div>
        </header>
    );

    const renderGuestContent = () => {
        switch(guestView) {
            case 'sos':
                return <SOSAlertModule currentUser={null} onAddAlert={handleAddSOSAlert} sosAlerts={[]} users={users} />;
            case 'lostfound':
                return <LostAndFoundModule currentUser={null} users={users} />;
            case 'dashboard':
            default:
                 return (
                    <div className="animate-fade-in p-4 sm:p-6 lg:p-8 text-center">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">สวัสดีนักเรียน</h2>
                      <p className="text-gray-600 mb-8">เลือกบริการที่ต้องการ</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <GuestDashboardCard
                          title="แจ้งเหตุฉุกเฉิน (SOS)"
                          description="ส่งสัญญาณขอความช่วยเหลือด่วนไปยังเจ้าหน้าที่"
                          icon="fa-solid fa-bell"
                          onClick={() => setGuestView('sos')}
                        />
                        <GuestDashboardCard
                          title="ระบบของหาย (Lost & Found)"
                          description="แจ้งของหายและค้นหาของที่พบภายในโรงเรียน"
                          icon="fa-solid fa-magnifying-glass"
                          onClick={() => setGuestView('lostfound')}
                        />
                      </div>
                    </div>
                  );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <GuestHeader />
             <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {guestView !== 'dashboard' && (
                    <button onClick={() => setGuestView('dashboard')} className="mb-4 text-red-600 hover:text-red-800 font-semibold flex items-center">
                        <i className="fa-solid fa-arrow-left mr-2"></i> กลับไปที่เมนูหลัก
                    </button>
                )}
                {renderGuestContent()}
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        currentUser={currentUser!} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        sosAlerts={sosAlerts}
        appLogoUrl={appLogoUrl}
        logoSize={logoSize}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
