'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X, Clock, BookOpen, DollarSign, Calendar } from 'lucide-react';
import axios from 'axios';
import api from "@/lib/axiosClient";


interface Availability {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

interface Mentor {
    mentorId: string;
    mentorName: string;
    avatar: string;
    mentorRating: number;
    reviews: number;    
}

interface ServiceData {
    title: string;
    thumbnail: string;
    subject: string;
    description: string;
    fee: number;
    createdAt: Date | null;
    mentor: Mentor | null;
    availabilities: Availability[];
}

const NewService: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    
    const [serviceData, setServiceData] = useState<ServiceData>({
        title: "",
        thumbnail: "",
        subject: "",
        description: "",
        fee: 0,
        createdAt: null,
        mentor: null,
        availabilities: [],
    });
    
    const [newAvailability, setNewAvailability] = useState<Availability>({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00"
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    const daysOfWeek = [
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
        { value: 7, label: "Sunday" }
    ];
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'fee') {
            // Parse as float for fee input
            setServiceData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setServiceData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    
    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setNewAvailability(prev => ({
            ...prev,
            [name]: name === 'dayOfWeek' ? parseInt(value) : value
        }));
    };
    
    const addAvailability = () => {
        // Validate time format and ensure end time is after start time
        if (newAvailability.startTime >= newAvailability.endTime) {
            alert("End time must be after start time");
            return;
        }
        
        // Check if there's a time conflict with existing availabilities
        const hasConflict = serviceData.availabilities.some(
            avail => avail.dayOfWeek === newAvailability.dayOfWeek && 
            ((avail.startTime <= newAvailability.startTime && avail.endTime > newAvailability.startTime) ||
             (avail.startTime < newAvailability.endTime && avail.endTime >= newAvailability.endTime) ||
             (newAvailability.startTime <= avail.startTime && newAvailability.endTime >= avail.endTime))
        );
        
        if (hasConflict) {
            alert("This time slot conflicts with an existing availability");
            return;
        }
        
        setServiceData(prev => ({
            ...prev,
            availabilities: [...prev.availabilities, { ...newAvailability, id: Date.now() }]
        }));
        
        // Reset to default values after adding
        setNewAvailability({
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "17:00"
        });
    };
    
    const removeAvailability = (index: number) => {
        setServiceData(prev => ({
            ...prev,
            availabilities: prev.availabilities.filter((_, i) => i !== index)
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        
        // Validation
        if (!serviceData.title.trim()) {
            setSubmitError('Service title is required');
            setIsSubmitting(false);
            return;
        }
        
        if (!serviceData.subject) {
            setSubmitError('Subject is required');
            setIsSubmitting(false);
            return;
        }
        
        if (serviceData.fee <= 0) {
            setSubmitError('Fee must be greater than zero');
            setIsSubmitting(false);
            return;
        }
        
        if (serviceData.availabilities.length === 0) {
            setSubmitError('At least one availability time slot is required');
            setIsSubmitting(false);
            return;
        }
        
        if (!user?.id) {
            setSubmitError('User authentication required');
            setIsSubmitting(false);
            return;
        }
        
        try {
            // Prepare the payload for backend submission
            const servicePayload = {
                title: serviceData.title.trim(),
                subject: serviceData.subject,
                description: serviceData.description.trim(),
                fee: serviceData.fee,
                mentorId: user.id,
                availabilities: serviceData.availabilities.map(({ dayOfWeek, startTime, endTime }) => ({ 
                    dayOfWeek, 
                    startTime, 
                    endTime 
                }))
            };
            
            console.log('Submitting service data as JSON:');
            console.log('Raw JSON String:', JSON.stringify(servicePayload, null, 2));
            
            // Send POST request to create service endpoint
            const response = await api.post('/api/v1/service-listing/create', servicePayload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Service created successfully:', response.data);
            
            // Show success message
            alert(`✅ Service "${serviceData.title}" created successfully!`);
            
            // Reset form
            setServiceData({
                title: "",
                thumbnail: "",
                subject: "",
                description: "",
                fee: 0,
                createdAt: null,
                mentor: null,
                availabilities: [],
            });
            
            // Redirect to services page
            router.push('/domain-expert/services');
            
        } catch (error: any) {
            console.error('Error creating service:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create service';
            setSubmitError(errorMessage);
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const previewJsonData = () => {
        const servicePayload = {
            title: serviceData.title.trim(),
            subject: serviceData.subject,
            description: serviceData.description.trim(),
            fee: serviceData.fee,
            mentorId: user?.id || '',
            availabilities: serviceData.availabilities.map(({ dayOfWeek, startTime, endTime }) => ({ 
                dayOfWeek, 
                startTime, 
                endTime 
            }))
        };
        
        console.log('Preview JSON Data:');
        console.log(JSON.stringify(servicePayload, null, 2));
        alert(`JSON Preview:\n\n${JSON.stringify(servicePayload, null, 2)}`);
    };
    
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-8">
                        <h1 className="text-3xl font-bold text-black">Create New Service</h1>
                        <p className="text-gray-800 mt-2">Set up your service with details and availability times</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Error Display */}
                        {submitError && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <X className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{submitError}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Loading Overlay */}
                        {isSubmitting && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        <span className="text-gray-700">Creating service...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Service Details Section */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-sm">1</span>
                                    </div>
                                    Service Details
                                </h2>
                            </div>
                            
                            {/* Service Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value={serviceData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter service title"
                                />
                            </div>
                            
                            {/* Service Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    value={serviceData.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter subject"
                                />
                            </div>
                            
                            {/* Service Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    required
                                    value={serviceData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe your service and expertise..."
                                />
                                <p className="text-sm text-gray-500 mt-1">{serviceData.description.length}/500 characters</p>
                            </div>
                            
                            {/* Service Fee */}
                            <div>
                                <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Fee (USD) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        id="fee"
                                        name="fee"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={serviceData.fee}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Availability Section */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 font-semibold text-sm">2</span>
                                    </div>
                                    Availability
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                </h2>
                            </div>
                            
                            {/* Add Availability */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Availability Time Slot</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="dayOfWeek" className="block text-xs font-medium text-gray-500 mb-1">
                                            Day
                                        </label>
                                        <select
                                            id="dayOfWeek"
                                            name="dayOfWeek"
                                            value={newAvailability.dayOfWeek}
                                            onChange={handleAvailabilityChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {daysOfWeek.map(day => (
                                                <option key={day.value} value={day.value}>{day.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="startTime" className="block text-xs font-medium text-gray-500 mb-1">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            id="startTime"
                                            name="startTime"
                                            value={newAvailability.startTime}
                                            onChange={handleAvailabilityChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="endTime" className="block text-xs font-medium text-gray-500 mb-1">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            id="endTime"
                                            name="endTime"
                                            value={newAvailability.endTime}
                                            onChange={handleAvailabilityChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={addAvailability}
                                            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Time Slot
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Availability List */}
                            {serviceData.availabilities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Available Time Slots ({serviceData.availabilities.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {serviceData.availabilities.map((availability, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Clock className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {daysOfWeek.find(d => d.value === availability.dayOfWeek)?.label || 'Day'} | 
                                                        {' '}{availability.startTime} - {availability.endTime}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAvailability(index)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            {/* Development Preview Button */}
                            <button
                                type="button"
                                onClick={previewJsonData}
                                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                disabled={isSubmitting}
                            >
                                Preview JSON
                            </button>
                            
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !serviceData.title.trim() || !serviceData.subject || serviceData.fee <= 0 || serviceData.availabilities.length === 0}
                                    className="px-6 py-2 bg-gradient-to-r bg-primary text-white rounded-md hover:bg-secondary hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Service'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewService;
