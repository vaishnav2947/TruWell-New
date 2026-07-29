"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { Loader } from '@/components/loader';
import { Truck, FileText, Search, Plus, Trash2, Edit, Eye } from 'lucide-react';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { usePatient } from '@/lib/hooks/usePatient';
import { useMedication } from '@/lib/hooks/useMedication';
import { useSelectedPrescription } from '@/lib/contexts/SelectedPrescriptionContext';

export function PrescriptionDashboard() {
  const { prescriptions, loading, error, refresh } = usePrescription();
  const { setSelectedPrescription } = useSelectedPrescription();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch prescriptions on mount
    // This is handled by usePrescription hook
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleView = (id: string) => {
    setSelectedPrescription(id);
    router.push(`/prescription/${id}`);
  };

  const handleNew = () => {
    router.push('/prescription/new');
  };

  if (loading) return <Loader />;
  if (error) return <div className="p-4 text-red-500">Error loading prescriptions</div>;

  const filtered = prescriptions.filter((p) =>
    `${p.prescriptionNumber} ${p.patient.firstName} ${p.patient.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={search}
            onChange={handleSearch}
            className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button variant="primary" onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No prescriptions found</p>
          <p className="text-gray-500 mt-2">
            No prescriptions found. Create a new prescription to get started.
          </p>
          <Button variant="outline" onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      ) : (
        <Card className="shadow">
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prescription.prescriptionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {prescription.patient.firstName} {prescription.patient.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {prescription.medication.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prescription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : prescription.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : prescription.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(prescription.id)}
                        className="mr-2"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      {prescription.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Edit logic
                          }}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Delete logic
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}