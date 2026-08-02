"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Select } from '@/components/select'; // We'll need to create this or use a simple select
import { Loader } from '@/components/loader';
import { Users, Calendar, MapPin, Phone, Mail, Save } from 'lucide-react';

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      mrn: '' // This could be auto-generated
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call to create patient
      // In a real app, this would be a POST request to /api/patients
      const newPatient = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        registeredDate: new Date().toISOString(),
        status: 'active'
      };

      // Simulate success
      setTimeout(() => {
        setSuccess(true);
        reset();
      }, 1000);
    } catch (error) {
      console.error('Error creating patient:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center text-green-600 space-y-6">
          <Save className="h-12 w-12 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Patient Created Successfully
          </h2>
          <p className="text-gray-600">
            The patient has been added to the system.
          </p>
          <Button
            onClick={() => router.push('/patients')}
            variant="outline"
          >
            View Patients
          </Button>
          <Button
            onClick={() => router.push('/patients/new')}
            variant="primary"
          >
            Add Another Patient
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/patients')}
                className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                <span>Back to Patients</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Register New Patient
            </h1>
          </div>
        </div>
      </header>
      <main className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters'
                    }
                  })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    }
                  })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
              <div className="space-y-4">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth', {
                    required: 'Date of birth is required'
                  })}
                />

                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 pr-8 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register('gender', {
                    required: 'Gender is required'
                  })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
              <div className="space-y-4">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[\d\s-]{10,}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-t pt-4">
                <h2 className="sr-only">Address Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter full address"
                      {...register('address', {
                        required: 'Address is required',
                        minLength: {
                          value: 10,
                          message: 'Address must be at least 10 characters'
                        }
                      })}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-t pt-4">
                <h2 className="sr-only">Emergency Contact</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-4">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Enter emergency contact name"
                      {...register('emergencyContactName', {
                        required: 'Emergency contact name is required'
                      })}
                    />
                    {errors.emergencyContactName && (
                      <p className="text-sm text-red-600">{errors.emergencyContactName.message}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      placeholder="Enter emergency contact phone"
                      {...register('emergencyContactPhone', {
                        required: 'Emergency contact phone is required',
                        pattern: {
                          value: /^\+?[\d\s-]{10,}$/,
                          message: 'Please enter a valid phone number'
                        }
                      })}
                    />
                    {errors.emergencyContactPhone && (
                      <p className="text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      placeholder="Enter relationship"
                      {...register('emergencyContactRelationship', {
                        required: 'Relationship is required'
                      })}
                    />
                    {errors.emergencyContactRelationship && (
                      <p className="text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 pt-4 bg-gray-50 rounded-b-lg">
              <Button type="button" onClick={() => router.push('/patients')} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="w-fit">
                {loading ? 'Saving...' : 'Register Patient'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}