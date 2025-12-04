import React from 'react';
import { User, SOSAlert, SOSAlertStatus } from '../types';

interface SOSDashboardProps {
  currentUser: User;
  alerts: SOSAlert[];
  onUpdateStatus: (alertId: string, teacher: User) => void;
  users: User[];
}

const SOSDashboard: React.FC<SOSDashboardProps> = ({ currentUser, alerts, onUpdateStatus, users }) => {
  const newAlerts = alerts.filter(a => a.status === SOSAlertStatus.New).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const acknowledgedAlerts = alerts.filter(a => a.status === SOSAlertStatus.Acknowledged).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const AlertCard: React.FC<{ alert: SOSAlert, isNew: boolean }> = ({ alert, isNew }) => {
    const student = users.find(u => u.id === alert.studentId);
    const acknowledgedByTeacher = users.find(u => u.id === alert.acknowledgedBy);
    
    const studentName = alert.studentName || student?.name || 'ไม่พบข้อมูล';
    const studentClass = alert.studentClass || student?.class;

    const handleAcknowledge = () => {
      onUpdateStatus(alert.id, currentUser);
    };

    const handleForward = () => {
      // In a real app, this would open a modal to select another teacher or send an email.
      // FIX: The 'alert' prop was shadowing the global `window.alert` function.
      // Using `window.alert` explicitly to resolve the name collision.
      window.alert(`ส่งต่อเหตุการณ์ "${alert.category}" จากนักเรียน ${studentName} เรียบร้อยแล้ว`);
    };

    return (
      <div className={`bg-white p-4 rounded-lg shadow-md border-l-8 ${isNew ? 'border-yellow-400' : 'border-green-500'}`}>
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-gray-800">{alert.category}</h4>
                <p className="text-sm text-gray-500">
                    แจ้งโดย: {studentName} {studentClass ? `(${studentClass})` : ''}
                </p>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${isNew ? 'bg-yellow-500' : 'bg-green-500'}`}>
                {alert.status}
            </span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p><i className="fa-solid fa-location-dot w-5 text-center mr-2 text-gray-400"></i><b>สถานที่:</b> {alert.location}</p>
            <p><i className="fa-solid fa-phone w-5 text-center mr-2 text-gray-400"></i><b>ติดต่อ:</b> {alert.contactInfo}</p>
            {alert.description && <p><i className="fa-solid fa-file-alt w-5 text-center mr-2 text-gray-400"></i><b>รายละเอียด:</b> {alert.description}</p>}
            {alert.imageUrl && (
                <div className="mt-2">
                    <p className="mb-1"><i className="fa-solid fa-image w-5 text-center mr-2 text-gray-400"></i><b>รูปภาพที่แนบ:</b></p>
                    <a href={alert.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <img src={alert.imageUrl} alt="รูปภาพเหตุการณ์" className="rounded-lg max-h-48 w-auto cursor-pointer border hover:shadow-lg transition-shadow" />
                    </a>
                </div>
            )}
        </div>
        <div className="mt-4 pt-2 border-t text-xs text-gray-500 flex justify-between items-center">
            <span>{new Date(alert.timestamp).toLocaleString('th-TH')}</span>
            {!isNew && acknowledgedByTeacher && <span>รับเรื่องโดย: {acknowledgedByTeacher.name}</span>}
        </div>
        {isNew && (
            <div className="mt-4 flex gap-2">
                <button onClick={handleAcknowledge} className="flex-1 bg-green-500 text-white py-2 px-3 text-sm rounded-md hover:bg-green-600 transition-colors flex items-center justify-center">
                    <i className="fa-solid fa-check mr-2"></i>รับทราบ
                </button>
                <button onClick={handleForward} className="flex-1 bg-blue-500 text-white py-2 px-3 text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center">
                    <i className="fa-solid fa-share mr-2"></i>ส่งต่อ
                </button>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">ศูนย์กลางจัดการเหตุฉุกเฉิน</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
            <i className="fa-solid fa-bell text-yellow-500 mr-2"></i>
            เหตุการณ์ใหม่ ({newAlerts.length})
          </h3>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {newAlerts.length > 0 ? (
              newAlerts.map(alert => <AlertCard key={alert.id} alert={alert} isNew={true} />)
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">ไม่มีเหตุการณ์ใหม่</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
            <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
            เหตุการณ์ที่รับทราบแล้ว ({acknowledgedAlerts.length})
          </h3>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {acknowledgedAlerts.length > 0 ? (
              acknowledgedAlerts.map(alert => <AlertCard key={alert.id} alert={alert} isNew={false} />)
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">ไม่มีเหตุการณ์ที่รับทราบแล้ว</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSDashboard;