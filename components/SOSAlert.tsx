import React, { useState } from 'react';
import { User, IncidentCategory, SOSAlert, SOSAlertStatus } from '../types';
import { INCIDENT_CATEGORIES } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface SOSAlertProps {
  currentUser: User | null;
  onAddAlert: (alertData: Omit<SOSAlert, 'id' | 'timestamp' | 'status' | 'acknowledgedBy'>) => void;
  sosAlerts: SOSAlert[];
  users: User[];
}

const SOSAlertModule: React.FC<SOSAlertProps> = ({ currentUser, onAddAlert, sosAlerts, users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const userAlerts = currentUser ? sosAlerts.filter(alert => alert.studentId === currentUser.id) : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getAiSuggestions = async (alertData: Omit<SOSAlert, 'id' | 'timestamp' | 'status' | 'acknowledgedBy'>) => {
    setIsAiLoading(true);
    setAiSuggestion('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `นักเรียนแจ้งเหตุฉุกเฉิน: '${alertData.category}'. สถานที่: '${alertData.location}'. รายละเอียด: '${alertData.description || 'ไม่ได้ระบุ'}'. ขอคำแนะนำเบื้องต้นที่ปลอดภัยและทำตามได้ง่ายสำหรับนักเรียน ระหว่างรอครูหรือเจ้าหน้าที่ไปถึง โดยใช้ภาษาไทยที่เข้าใจง่ายและให้กำลังใจ แบ่งเป็นข้อๆ`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a compassionate and helpful school nurse AI assistant. Your role is to provide immediate, simple, and safe advice to a student in distress. Your language must be in Thai, reassuring, and easy for a young person to understand. You must prioritize the student\'s safety above all else, emphasizing that they should stay safe and wait for an adult. Do not give complex medical advice that requires a professional. Always start your response with a calming and reassuring sentence.'
          }
      });

      setAiSuggestion(response.text);

    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      setAiSuggestion('ไม่สามารถเรียกคำแนะนำจาก AI ได้ในขณะนี้ โปรดรอความช่วยเหลือจากเจ้าหน้าที่อย่างปลอดภัย');
    } finally {
      setIsAiLoading(false);
    }
  };


  const handleSendAlert = () => {
    let missingFields = [];
    if (!selectedCategory) missingFields.push('ประเภทเหตุ');
    if (!location) missingFields.push('สถานที่');
    if (!contactInfo) missingFields.push('ช่องทางติดต่อ');
    if (!currentUser && !studentName) missingFields.push('ชื่อ-นามสกุล');
    
    if (missingFields.length > 0) {
      setStatus('error');
      setStatusMessage(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(', ')}`);
      return;
    }

    setStatus('loading');
    setStatusMessage('กำลังส่งแจ้งเตือน...');
    
    setTimeout(() => {
      const alertData = {
        studentId: currentUser?.id,
        studentName: currentUser ? currentUser.name : studentName,
        studentClass: currentUser ? currentUser.class : studentClass,
        category: selectedCategory as IncidentCategory,
        description,
        location,
        contactInfo,
        imageUrl: image,
      };
      onAddAlert(alertData);
      setStatus('success');
      setStatusMessage(`ส่งแจ้งเตือนเรื่อง "${selectedCategory}" สำเร็จแล้ว! เจ้าหน้าที่กำลังไปช่วยเหลือ`);
      getAiSuggestions(alertData);
    }, 1500);
  };
  
  const resetAndCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setSelectedCategory('');
        setDescription('');
        setLocation('');
        setContactInfo('');
        setStudentName('');
        setStudentClass('');
        setImage(undefined);
        setStatus('idle');
        setStatusMessage('');
        setAiSuggestion('');
    }, 300); // Delay to allow modal to close smoothly
  }

  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center">
      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">แจ้งเหตุฉุกเฉิน (SOS)</h2>
        <p className="text-gray-600 mb-8">หากคุณตกอยู่ในสถานการณ์ฉุกเฉิน, ต้องการความช่วยเหลือเร่งด่วน, หรือพบเห็นเหตุการณ์ไม่ปกติ กดปุ่มด้านล่างเพื่อแจ้งเจ้าหน้าที่ทันที</p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white rounded-full w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center shadow-2xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 animate-pulse mx-auto"
        >
          <i className="fa-solid fa-bell text-6xl sm:text-7xl"></i>
          <span className="mt-4 text-2xl sm:text-3xl font-bold">แจ้งเหตุ SOS</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg animate-fade-in-up">
            {status === 'idle' || status === 'error' ? (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-left">ยืนยันการแจ้งเหตุ</h3>
                <div className="space-y-4 text-left">
                  {!currentUser && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-red-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล ผู้แจ้ง</label>
                        <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="เช่น เด็กชายใจดี มีสุข" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ห้องเรียน (ถ้ามี)</label>
                        <input type="text" value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder="เช่น ม.1/1" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ประเภทเหตุฉุกเฉิน</label>
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as IncidentCategory)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                      <option value="">-- กรุณาเลือก --</option>
                      {INCIDENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700">สถานที่เกิดเหตุ</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="เช่น หน้าห้องสมุด, โรงอาหาร 2" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ช่องทางการติดต่อ (เช่น เบอร์โทรศัพท์)</label>
                    <input type="text" value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="08x-xxx-xxxx" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">คำอธิบายเพิ่มเติม (ถ้ามี)</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">แนบรูปภาพ (ถ้ามี)</label>
                    <div className="mt-1 flex flex-col items-start">
                        <input 
                            type="file" 
                            id="sos-image-upload" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <label 
                            htmlFor="sos-image-upload"
                            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <i className="fa-solid fa-upload mr-2"></i>
                            <span>เลือกรูปภาพ</span>
                        </label>
                        {image && (
                            <div className="mt-3 relative">
                                <img src={image} alt="Preview" className="h-24 w-auto object-cover rounded-md border" />
                                <button 
                                    type="button" 
                                    onClick={() => setImage(undefined)} 
                                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-700"
                                    title="ลบรูป"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
                 {status === 'error' && <p className="text-red-500 text-sm mt-4 text-center">{statusMessage}</p>}
                <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                  <button onClick={handleSendAlert} className="w-full sm:w-auto flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    <i className="fa-solid fa-paper-plane mr-2"></i>ส่งแจ้งเตือน
                  </button>
                  <button onClick={resetAndCloseModal} className="w-full sm:w-auto flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                    ยกเลิก
                  </button>
                </div>
              </>
            ) : (
               <div className="text-center py-8">
                    {status === 'loading' && <i className="fa-solid fa-spinner fa-spin text-red-600 text-5xl mb-4"></i>}
                    {status === 'success' && <i className="fa-solid fa-check-circle text-green-500 text-5xl mb-4"></i>}
                    <p className="text-lg text-gray-700">{statusMessage}</p>

                    {status === 'success' && (
                        <div className="mt-6 text-left p-4 bg-blue-50 rounded-lg border border-blue-200">
                            {isAiLoading ? (
                                <div className="flex items-center justify-center text-blue-700">
                                    <i className="fa-solid fa-robot fa-spin mr-3"></i>
                                    <span>AI กำลังประมวลผลคำแนะนำเบื้องต้น...</span>
                                </div>
                            ) : (
                                aiSuggestion && (
                                    <div>
                                        <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                                            <i className="fa-solid fa-brain mr-2"></i>
                                            คำแนะนำเบื้องต้นจาก AI
                                        </h4>
                                        <div 
                                            className="text-sm max-w-none text-gray-800"
                                            style={{ whiteSpace: 'pre-wrap' }}
                                        >
                                            {aiSuggestion}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">
                                            *นี่คือคำแนะนำที่สร้างโดย AI โปรดใช้วิจารณญาณและรอความช่วยเหลือจากเจ้าหน้าที่เป็นหลัก*
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {status === 'success' && (
                        <button onClick={resetAndCloseModal} className="mt-6 bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors">
                            ปิด
                        </button>
                    )}
               </div>
            )}
          </div>
        </div>
      )}

      {currentUser && (
        <div className="w-full max-w-4xl mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-left border-b pb-2">ประวัติการแจ้งเหตุของคุณ</h3>
          {userAlerts.length > 0 ? (
            <div className="space-y-4">
              {userAlerts.map(alert => {
                const acknowledgedByTeacher = users.find(u => u.id === alert.acknowledgedBy);
                const isNew = alert.status === SOSAlertStatus.New;
                
                return (
                  <div key={alert.id} className={`bg-white p-4 rounded-lg shadow-md border-l-8 text-left ${isNew ? 'border-yellow-400' : 'border-green-500'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{alert.category}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(alert.timestamp).toLocaleString('th-TH')}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${isNew ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {alert.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                      <p><i className="fa-solid fa-location-dot w-5 text-center mr-2 text-gray-400"></i><b>สถานที่:</b> {alert.location}</p>
                    </div>
                    {!isNew && acknowledgedByTeacher && (
                      <div className="mt-4 pt-2 border-t text-xs text-gray-500">
                          <span>รับเรื่องโดย: {acknowledgedByTeacher.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">คุณยังไม่มีประวัติการแจ้งเหตุ</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SOSAlertModule;
