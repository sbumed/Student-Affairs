import React, { useState } from 'react';
import { User, PermissionLevel } from '../types';

interface UserManagementProps {
    currentUser: User;
    users: User[];
    onAddUser: (user: Omit<User, 'id' | 'profilePicture'>) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
}

const UserManagementModule: React.FC<UserManagementProps> = ({ currentUser, users, onAddUser, onUpdateUser, onDeleteUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const UserFormModal: React.FC = () => {
        const [formData, setFormData] = useState<Partial<User>>(
            editingUser || { name: '', email: '', permissionLevel: PermissionLevel.Student, class: '' }
        );

        const isEditingSelf = editingUser?.id === currentUser.id;
        const adminCount = users.filter(u => u.permissionLevel === PermissionLevel.Admin).length;
        const isLastAdmin = isEditingSelf && editingUser?.permissionLevel === PermissionLevel.Admin && adminCount === 1;
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const { name, email, permissionLevel } = formData;
            if (!name || !email || !permissionLevel) {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }

            if (editingUser) {
                onUpdateUser(formData as User);
            } else {
                onAddUser(formData as Omit<User, 'id' | 'profilePicture'>);
            }
            closeModal();
        };

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{editingUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ระดับสิทธิ์</label>
                            <select 
                                name="permissionLevel" 
                                value={formData.permissionLevel} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md disabled:bg-gray-200"
                                disabled={isLastAdmin}
                            >
                                {Object.values(PermissionLevel).map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            {isLastAdmin && <p className="mt-1 text-xs text-gray-500">ไม่สามารถเปลี่ยนระดับสิทธิ์ของผู้ดูแลระบบคนสุดท้ายได้</p>}
                        </div>
                         {formData.permissionLevel === PermissionLevel.Student && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">ห้องเรียน</label>
                                <input type="text" name="class" value={formData.class || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                             </div>
                         )}
                        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                            <button type="submit" className="w-full sm:w-auto flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">บันทึก</button>
                            <button type="button" onClick={closeModal} className="w-full sm:w-auto flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">ยกเลิก</button>
                        </div>
                    </form>
                </div>
             </div>
        )
    };

    return (
        <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">จัดการสมาชิกในระบบ</h2>
                <button onClick={openAddModal} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center">
                    <i className="fa-solid fa-user-plus mr-2"></i>เพิ่มผู้ใช้ใหม่
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ระดับสิทธิ์</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ห้องเรียน</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src={user.profilePicture} alt="" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                         user.permissionLevel === PermissionLevel.Admin ? 'bg-red-100 text-red-800' :
                                         user.permissionLevel === PermissionLevel.Teacher ? 'bg-blue-100 text-blue-800' :
                                         'bg-green-100 text-green-800'
                                     }`}>
                                        {user.permissionLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.class || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900">แก้ไข</button>
                                    <button 
                                        onClick={() => onDeleteUser(user.id)} 
                                        className="ml-4 text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={user.id === currentUser.id}
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <UserFormModal />}
        </div>
    );
};

export default UserManagementModule;