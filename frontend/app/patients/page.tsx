"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Loader } from '@/components/loader';
import { Users, Search, Calendar, Trash2, Edit3 } from 'lucide-react';
import Link from 'next/link';

export default function PatientsPage() {
  const { user } = useAuthStore.getState();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [sort, setSort] = useState('name-asc'); // name-asc, name-desc, registered-asc, registered-desc

  // Fetch patients (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatients([
        { id: '1', firstName: 'John', lastName: 'Doe', mrn: 'MRN001', phone: '07700 900123', email: 'john.doe@example.com', dateOfBirth: '1980-01-15', registeredDate: '2023-01-15', status: 'active' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', mrn: 'MRN002', phone: '07700 900456', email: 'jane.smith@example.com', dateOfBirth: '1992-05-20', registeredDate: '2023-03-22', status: 'active' },
        { id: '3', firstName: 'Robert', lastName: 'Johnson', mrn: 'MRN003', phone: '07700 900789', email: 'robert.johnson@example.com', dateOfBirth: '1975-08-30', registeredDate: '2022-11-05', status: 'inactive' },
      ]);
      setLoading(false);
    }, 1000);
  }, [search, filter, sort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  // Filter and sort patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === 'all' || patient.status === filter;

    return matchesSearch && matchesFilter;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sort === 'name-asc') {
      return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    }
    if (sort === 'name-desc') {
      return b.lastName.localeCompare(a.lastName) || b.firstName.localeCompare(a.firstName);
    }
    if (sort === 'registered-asc') {
      return new Date(a.registeredDate).getTime() - new Date(b.registeredDate).getTime();
    }
    if (sort === 'registered-desc') {
      return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Patients
            </h1>
            <Link href="/patients/new">
              <Button variant="primary">
                New Patient
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Search and Filter */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Label htmlFor="search">Search</Label>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, MRN, or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Status</Label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="registered-asc">Registration Date (Oldest)</option>
                <option value="registered-desc">Registration Date (Newest)</option>
              </select>
            </div>
            <div className="flex items-end">
              {/* Empty for alignment */}
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MRN
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPatients.length > 0 ? (
                  sortedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.mrn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                        <div className={`flex-shrink-0 h-5 w-5 ${
                          patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        } rounded-full flex items-center justify-center text-xs`}>
                          {patient.status === 'active' ? '●' : '●'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{patient.phone}</p>
                          {patient.email && (
                            <p className="text-xs text-gray-400">{patient.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(patient.registeredDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/patients/${patient.id}`}>
                          <Edit3 className="h-4 w-4 text-gray-500 hover:text-primary-600" />
                        </Link>
                        <button
                          onClick={() => {}}
                          className="ml-2 h-4 w-4 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}