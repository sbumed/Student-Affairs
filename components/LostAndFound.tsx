import React, { useState, useMemo } from 'react';
import { User, LostAndFoundItem, ItemStatus } from '../types';
import { ITEM_CATEGORIES, LOCATIONS, MOCK_LOST_ITEMS } from '../constants';

interface LostAndFoundProps {
  currentUser: User | null;
  users: User[];
}

const LostAndFoundModule: React.FC<LostAndFoundProps> = ({ currentUser, users }) => {
  const [items, setItems] = useState<LostAndFoundItem[]>(MOCK_LOST_ITEMS);
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'lost' | 'found'>('lost');
  
  // Form state
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [locationId, setLocationId] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const openModal = (type: 'lost' | 'found') => {
    setModalType(type);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form
    setItemName('');
    setCategory('');
    setLocationId('');
    setDescription('');
    setReporterName('');
    setImage(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && !reporterName) {
        alert('กรุณากรอกชื่อผู้แจ้ง');
        return;
    }
    const newItem: LostAndFoundItem = {
      id: `li${Date.now()}`,
      reporterId: currentUser?.id,
      reporterName: currentUser ? currentUser.name : reporterName,
      name: itemName,
      category,
      locationId,
      description,
      status: modalType === 'lost' ? ItemStatus.Searching : ItemStatus.Found,
      imageUrl: image,
      timestamp: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    closeModal();
  };

  const handleClaimItem = (itemId: string) => {
    setItems(items.map(item => item.id === itemId ? { ...item, status: ItemStatus.Claimed } : item));
  }

  const filteredItems = useMemo(() => {
    if (activeTab === 'lost') return items.filter(item => item.status === ItemStatus.Searching);
    if (activeTab === 'found') return items.filter(item => item.status === ItemStatus.Found);
    return items;
  }, [items, activeTab]);

  const ItemCard: React.FC<{item: LostAndFoundItem}> = ({item}) => {
    const location = LOCATIONS.find(l => l.id === item.locationId);
    
    const statusConfig = {
      [ItemStatus.Searching]: { text: 'กำลังตามหา', color: 'bg-yellow-500' },
      [ItemStatus.Found]: { text: 'พบแล้ว-รอเจ้าของ', color: 'bg-blue-500' },
      [ItemStatus.Claimed]: { text: 'รับคืนแล้ว', color: 'bg-green-500' },
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />}
            <div className="p-4 flex flex-col flex-grow">
                <div className={`text-white text-xs font-bold px-2 py-1 rounded-full self-start ${statusConfig[item.status].color}`}>{statusConfig[item.status].text}</div>
                <h3 className="text-lg font-bold mt-2 text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                <p className="text-sm text-gray-700 flex-grow">{item.description}</p>
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                    <p><i className="fa-solid fa-location-dot mr-2"></i>{location?.name || 'ไม่ระบุ'}</p>
                    <p><i className="fa-solid fa-user mr-2"></i>ผู้แจ้ง: {item.reporterName || 'ไม่ระบุ'}</p>
                    <p><i className="fa-solid fa-clock mr-2"></i>{new Date(item.timestamp).toLocaleString('th-TH')}</p>
                </div>
            </div>
             {item.status === ItemStatus.Found && (
                <button onClick={() => handleClaimItem(item.id)} className="w-full bg-green-500 text-white py-2 font-bold hover:bg-green-600 transition-colors">
                    <i className="fa-solid fa-check mr-2"></i>แจ้งรับคืนแล้ว
                </button>
            )}
        </div>
    )
  }

  return (
    <div className="animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">ระบบของหาย (Lost & Found)</h2>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button onClick={() => openModal('lost')} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center"><i className="fa-solid fa-person-circle-question mr-2"></i>แจ้งของหาย</button>
          <button onClick={() => openModal('found')} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"><i className="fa-solid fa-hand-holding-hand mr-2"></i>แจ้งของเจอ</button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('all')} className={`${activeTab === 'all' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>ทั้งหมด</button>
            <button onClick={() => setActiveTab('lost')} className={`${activeTab === 'lost' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>กำลังตามหา</button>
            <button onClick={() => setActiveTab('found')} className={`${activeTab === 'found' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>พบแล้ว-รอเจ้าของ</button>
          </nav>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{modalType === 'lost' ? 'แจ้งของหาย' : 'แจ้งพบของ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               {!currentUser && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อผู้แจ้ง</label>
                        <input type="text" value={reporterName} onChange={e => setReporterName(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                    </div>
               )}
               <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อสิ่งของ</label>
                <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                <select value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    {ITEM_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">สถานที่{modalType === 'lost' ? 'ที่คาดว่าหาย' : 'ที่พบ'}</label>
                 <select value={locationId} onChange={e => setLocationId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                    <option value="">-- เลือกสถานที่ --</option>
                    {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">คำอธิบาย/ลักษณะ</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">รูปภาพ (ถ้ามี)</label>
                <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                <button type="submit" className="w-full sm:w-auto flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">ยืนยัน</button>
                <button type="button" onClick={closeModal} className="w-full sm:w-auto flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFoundModule;
