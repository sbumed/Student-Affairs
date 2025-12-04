
import React, { useState, useMemo } from 'react';
import { User, BehaviorRule, Location, PointDeduction, PermissionLevel } from '../types';
import { BEHAVIOR_RULES, LOCATIONS, MOCK_DEDUCTIONS } from '../constants';

interface PointDeductionProps {
  currentUser: User;
  users: User[];
}

const PointDeductionModule: React.FC<PointDeductionProps> = ({ currentUser, users }) => {
  const [deductions, setDeductions] = useState<PointDeduction[]>(MOCK_DEDUCTIONS);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState('');

  const students = useMemo(() => users.filter(u => u.permissionLevel === PermissionLevel.Student), [users]);
  const behaviorCategories = useMemo(() => [...new Set(BEHAVIOR_RULES.map(r => r.category))], []);
  
  const classes = useMemo(() => [...new Set(students.map(s => s.class).filter(Boolean) as string[])].sort(), [students]);
  const studentsInClass = useMemo(() => students.filter(s => s.class === selectedClass), [students, selectedClass]);

  const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
  const selectedRule = useMemo(() => BEHAVIOR_RULES.find(r => r.id === selectedRuleId), [selectedRuleId]);

  const studentDeductions = useMemo(() => {
    return deductions
      .filter(d => d.studentId === selectedStudentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [deductions, selectedStudentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedRuleId || !selectedLocationId) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newDeduction: PointDeduction = {
      id: `d${Date.now()}`,
      studentId: selectedStudentId,
      teacherId: currentUser.id,
      ruleId: selectedRuleId,
      locationId: selectedLocationId,
      notes,
      date: new Date().toISOString(),
    };
    
    setDeductions(prev => [newDeduction, ...prev]);
    
    // Simulate sending email
    console.log('Simulating email to parent for student:', selectedStudent?.name);
    console.log('Deduction details:', newDeduction);

    setNotification(`บันทึกการตัดคะแนนของ ${selectedStudent?.name} สำเร็จ และได้ทำการแจ้งผู้ปกครองทางอีเมลแล้ว`);
    setTimeout(() => setNotification(''), 5000);

    // Reset form
    setSelectedRuleId('');
    setSelectedLocationId('');
    setNotes('');
    setStep(1); // Go back to class selection
    setSelectedClass('');
    setSelectedStudentId('');
  };

  const renderStep = () => {
    switch(step) {
      case 1: // Select Class
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">ขั้นตอนที่ 1: เลือกห้องเรียน</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {classes.map(className => (
                <div key={className} onClick={() => { setSelectedClass(className); setStep(2); }} className="cursor-pointer p-4 border rounded-lg text-center hover:bg-red-50 hover:border-red-500 transition-all flex flex-col justify-center items-center h-24">
                  <i className="fa-solid fa-users text-2xl text-red-500 mb-2"></i>
                  <p className="font-semibold text-md">{className}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 2: // Select Student
        return (
          <div>
            <div className="flex items-center mb-4">
              <button type="button" onClick={() => { setStep(1); setSelectedClass(''); }} className="text-red-600 hover:text-red-800 mr-4"><i className="fa-solid fa-arrow-left"></i> กลับไปเลือกห้อง</button>
              <h3 className="text-lg font-medium text-gray-800">ขั้นตอนที่ 2: เลือกนักเรียน (ห้อง {selectedClass})</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {studentsInClass.map(student => (
                <div key={student.id} onClick={() => { setSelectedStudentId(student.id); setStep(3); }} className="cursor-pointer p-3 border rounded-lg text-center hover:bg-red-50 hover:border-red-500 transition-all">
                  <img src={student.profilePicture} alt={student.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
                  <p className="font-semibold text-sm">{student.name}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 3: // Fill form
        return (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-6">
                <button type="button" onClick={() => { setStep(2); setSelectedStudentId(''); }} className="text-red-600 hover:text-red-800 mr-4"><i className="fa-solid fa-arrow-left"></i> กลับไปเลือกนักเรียน</button>
                <div className="flex items-center">
                    <img src={selectedStudent?.profilePicture} alt={selectedStudent?.name} className="w-12 h-12 rounded-full mr-3" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">บันทึกพฤติกรรม: {selectedStudent?.name}</h3>
                        <p className="text-gray-600">{selectedStudent?.class}</p>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">หมวดหมู่ความประพฤติ</label>
                {behaviorCategories.map(category => (
                  <div key={category} className="mt-2">
                    <p className="font-semibold text-gray-800">{category}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {BEHAVIOR_RULES.filter(r => r.category === category).map(rule => (
                        <button
                          key={rule.id}
                          type="button"
                          onClick={() => setSelectedRuleId(rule.id)}
                          className={`px-3 py-2 text-sm rounded-full transition-colors ${selectedRuleId === rule.id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          {rule.behavior} ({rule.points})
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">สถานที่</label>
                <select id="location" value={selectedLocationId} onChange={e => setSelectedLocationId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                  <option value="">-- เลือกสถานที่ --</option>
                  {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">บันทึกเพิ่มเติม (ถ้ามี)</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
              </div>

              <div className="pt-4">
                 <button type="submit" className="w-full bg-red-600 text-white py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center">
                    <i className="fa-solid fa-check mr-2"></i>
                    ยืนยันการตัดคะแนน
                </button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">ระบบตัดคะแนนความประพฤติ</h2>
      {notification && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{notification}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {renderStep()}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ประวัติการตัดคะแนนล่าสุด</h3>
          {selectedStudentId ? (
            studentDeductions.length > 0 ? (
            <ul className="space-y-4">
              {studentDeductions.map(d => {
                const rule = BEHAVIOR_RULES.find(r => r.id === d.ruleId);
                return (
                  <li key={d.id} className="border-b pb-2">
                    <p className="font-semibold">{rule?.behavior} ({rule?.points} คะแนน)</p>
                    <p className="text-sm text-gray-500">{new Date(d.date).toLocaleString('th-TH')}</p>
                  </li>
                );
              })}
            </ul>
            ) : <p className="text-gray-500">ยังไม่มีประวัติการตัดคะแนนสำหรับนักเรียนคนนี้</p>
          ) : (
            <p className="text-gray-500">กรุณาเลือกนักเรียนเพื่อดูประวัติ</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointDeductionModule;