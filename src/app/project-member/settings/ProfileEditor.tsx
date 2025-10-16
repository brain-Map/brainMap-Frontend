import React, { useState,useEffect } from 'react';
import { Mail, Phone, Edit2, X, Check } from 'lucide-react';
import api from '@/utils/api';
import { useAuth } from "@/contexts/AuthContext";


export interface OneUser{
    id: string;
    firstName:string;
    lastName:string;
    username: string;
    email: string;
    mobileNumber?: string;
    dateOfBirth?:string;
    userRole:string;
    createdAt:string;
    status:string;
    city?:string;
    gender: string;
    bio?:string;
    avatar:string;
}

const settingsFunctions = {

    getOneUserData: async (userId: string): Promise<OneUser> => {
    try {
      const response = await api.get(`/api/v1/users/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },  

  updateUserProfile: async (userId: string, userData: Partial<OneUser>) => {
    try {
      const response = await api.put(`/api/v1/users/${userId}`, userData);
      console.log('Updated User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

};

const ProfileEditor = () => {
    const { user } = useAuth();
      const userId = user?.id;
    const [oneUserData, setOneUserData] = useState<OneUser | null>(null);
  

  
    useEffect(() => {
      const fetchUserData = async () => {
        if (userId) {
          const oneUserData = await settingsFunctions.getOneUserData(userId);
          setOneUserData(oneUserData);
        }
      };
  
      fetchUserData();
    }, [userId]);
  

  const [modalState, setModalState] = useState({
    isOpen: false,
    field: '',
    value: '',
    label: '',
    type: 'text'
  });

  const openModal = (
    field: keyof OneUser | 'fullName' | 'mobileNumber' | 'dateOfBirth' | 'gender' | 'email' | 'username' | 'bio',
    label: string,
    type: string = 'text'
  ) => {
    let value = '';

    if (field === 'fullName') {
      value = `${oneUserData?.firstName} ${oneUserData?.lastName}`;
    } else if (field === 'mobileNumber') {
      value = oneUserData?.mobileNumber || '';
    } else if (field === 'dateOfBirth') {
      // Handle date formatting
      const dateVal = oneUserData?.dateOfBirth;
      if (dateVal) {
        if (dateVal.includes("T")) value = dateVal.split("T")[0];
        else if (dateVal.includes(" ")) value = dateVal.split(" ")[0];
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) value = dateVal;
      }
    } else {
      value = oneUserData?.[field] || '';
    }

    setModalState({
      isOpen: true,
      field,
      value,
      label,
      type
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      field: '',
      value: '',
      label: '',
      type: 'text'
    });
  };

  const handleSave = async () => {
    const { field, value } = modalState;
    
    if (!userId || !oneUserData) return;

    let updateData: Partial<OneUser> = {};

    if (field === 'fullName') {
      const [firstName, ...lastNameParts] = value.split(' ');
      updateData = {
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || ''
      };
    } else if (field === 'mobileNumber') {
      updateData = { mobileNumber: value };
    } else {
      updateData = { [field]: value };
    }

    try {
      // Call the API to update user data
      await settingsFunctions.updateUserProfile(userId, updateData);
      
      // Update local state after successful API call
      if (field === 'fullName') {
        const [firstName, ...lastNameParts] = value.split(' ');
        setOneUserData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            firstName: firstName || '',
            lastName: lastNameParts.join(' ') || ''
          };
        });
      } else if (field === 'mobileNumber') {
        setOneUserData(prev => {
          if (!prev) return prev;
          return { ...prev, mobileNumber: value };
        });
      } else {
        setOneUserData(prev => {
          if (!prev) return prev;
          return { ...prev, [field]: value };
        });
      }
      
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      // Optionally show an error notification to the user
      alert('Failed to update profile. Please try again.');
    }
    
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setModalState(prev => ({ ...prev, value: e.target.value }));
  };

  // Editable field component
  type EditableFieldProps = {
    label: string;
    value: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  const EditableField: React.FC<EditableFieldProps> = ({ label, value, onClick, icon }) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        onClick={onClick}
        className="relative w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group-hover:shadow-sm"
      >
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <div className={`${icon ? 'pl-6' : ''} text-gray-900 min-h-[20px] flex items-center justify-between`}>
          <span>{value || 'Click to add...'}</span>
          <Edit2 size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );

  // Format date for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EditableField
          label="Full Name"
          value={`${oneUserData?.firstName ?? ''} ${oneUserData?.lastName ?? ''}`}
          onClick={() => openModal('fullName', 'Full Name')}
        />

         <EditableField
          label="Username"
          value={oneUserData?.username ?? ''}
          onClick={() => openModal('username', 'Username')}
        />


        <EditableField
          label="Date of Birth"
          value={formatDateForDisplay(oneUserData?.dateOfBirth ?? '')}
          onClick={() => openModal('dateOfBirth', 'Date of Birth', 'date')}
        />
        
        <EditableField
          label="Gender"
          value={oneUserData?.gender ?? ''}
          onClick={() => openModal('gender', 'Gender', 'select')}
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EditableField
          label="Email"
          value={oneUserData?.email ?? ''}
          onClick={() => openModal('email', 'Email', 'email')}
          icon={<Mail size={16} />}
        />
        
        <EditableField
          label="Mobile Number"
          value={oneUserData?.mobileNumber ?? ''}
          onClick={() => openModal('mobileNumber', 'Mobile Number', 'tel')}
          icon={<Phone size={16} />}
        />
      </div>

      {/* About Me */}

      <div className="mb-8">
        <EditableField
          label="About Me"
          value={oneUserData?.bio ?? ''}
          onClick={() => openModal('bio', 'About Me', 'textarea')}
        />
        
      </div>

      {/* Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit {modalState.label}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {modalState.label}
              </label>
              
              {modalState.type === 'textarea' ? (
                <textarea
                  value={modalState.value}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={modalState.field === 'bio' ? "Tell us about yourself, your research interests, and academic goals..." : ''}
                />
              ) : modalState.type === 'select' && modalState.field === 'gender' ? (
                <select
                  value={modalState.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <input
                  type={modalState.type}
                  value={modalState.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;