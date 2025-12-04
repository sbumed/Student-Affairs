
import React, { useRef } from 'react';
import { User, PermissionLevel } from '../types';

interface UserProfileProps {
  currentUser: User;
  onLogoChange: (logoDataUrl: string) => void;
  logoSize: number;
  onLogoSizeChange: (size: number) => void;
  onUpdateUser: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onLogoChange, logoSize, onLogoSizeChange, onUpdateUser }) => {
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onLogoChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoFileSelect = () => {
    logoFileInputRef.current?.click();
  };

  const handleProfilePicSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onUpdateUser({ ...currentUser, profilePicture: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerProfilePicSelect = () => {
    profilePicInputRef.current?.click();
  };


  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">ข้อมูลส่วนตัว</h2>
      <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="relative group w-32 h-32 mb-4 sm:mb-0 sm:mr-8 flex-shrink-0">
                <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name} 
                    className="w-32 h-32 rounded-full border-4 border-red-500 shadow-lg object-cover"
                />
                <button 
                    onClick={triggerProfilePicSelect}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
                    aria-label="เปลี่ยนรูปโปรไฟล์"
                >
                    <i className="fa-solid fa-camera text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </button>
                <input 
                    type="file" 
                    ref={profilePicInputRef} 
                    onChange={handleProfilePicSelect} 
                    className="hidden"
                    accept="image/*"
                />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900">{currentUser.name}</h3>
              <p className="text-md text-red-600 font-semibold">{currentUser.permissionLevel}</p>
              {currentUser.class && <p className="text-gray-500">ห้องเรียน: {currentUser.class}</p>}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentUser.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">อีเมล</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentUser.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">รหัสประจำตัว</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentUser.id}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">ระดับสิทธิ์</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentUser.permissionLevel}</dd>
              </div>
            </dl>
          </div>
          
          {currentUser.permissionLevel === PermissionLevel.Admin && (
             <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">ตั้งค่าผู้ดูแลระบบ</h4>
                <div className="space-y-4">
                  <div>
                    <button 
                        onClick={triggerLogoFileSelect}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <i className="fa-solid fa-image mr-2"></i>
                        เปลี่ยนโลโก้แอปพลิเคชัน
                    </button>
                    <input 
                        type="file" 
                        ref={logoFileInputRef} 
                        onChange={handleLogoFileSelect} 
                        className="hidden"
                        accept="image/*"
                    />
                  </div>
                  <div>
                    <label htmlFor="logo-size" className="block text-sm font-medium text-gray-700 mb-1">
                      ปรับขนาดโลโก้ ({logoSize}px)
                    </label>
                    <input
                      id="logo-size"
                      type="range"
                      min="24"
                      max="64"
                      value={logoSize}
                      onChange={(e) => onLogoSizeChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
