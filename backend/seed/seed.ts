import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data (be cautious in production)
  // We'll delete in reverse order of foreign key dependencies
  await prisma.notification.deleteMany()
  await prisma.emailTransmission.deleteMany()
  await prisma.deliveryStatus.deleteMany()
  await prisma.digitalSignature.deleteMany()
  await prisma.qrCode.deleteMany()
  await prisma.pdfMetadata.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.medicine.deleteMany()
  await prisma.pharmacy.deleteMany()
  await prisma.user.deleteMany()
  await prisma.emailTemplate.deleteMany()

  // Create Users
  const hashedPassword = await bcryptjs.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      id: 'admin-1',
      email: 'admin@truwell.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const pharmacist = await prisma.user.create({
    data: {
      id: 'pharmacist-1',
      email: 'pharmacist@truwell.com',
      name: 'Pharmacist User',
      password: hashedPassword,
      role: 'PHARMACIST',
    },
  })

  const technician = await prisma.user.create({
    data: {
      id: 'technician-1',
      email: 'technician@truwell.com',
      name: 'Technician User',
      password: hashedPassword,
      role: 'TECHNICIAN',
    },
  })

  const receptionist = await prisma.user.create({
    data: {
      id: 'receptionist-1',
      email: 'receptionist@truwell.com',
      name: 'Receptionist User',
      password: hashedPassword,
      role: 'RECEPTIONIST',
    },
  })

  // Create Patients
  const patient1 = await prisma.patient.create({
    data: {
      id: 'patient-1',
      nhsNumber: '1234567890',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'MALE',
      phone: '07700 900123',
      email: 'john.doe@example.com',
      addressLine1: '123 Main Street',
      addressLine2: '',
      city: 'London',
      postcode: 'SW1A 1AA',
    },
  })

  const patient2 = await prisma.patient.create({
    data: {
      id: 'patient-2',
      nhsNumber: '0987654321',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'FEMALE',
      phone: '07700 900456',
      email: 'jane.smith@example.com',
      addressLine1: '456 Oak Avenue',
      addressLine2: '',
      city: 'Manchester',
      postcode: 'M1 1AA',
    },
  })

  // Create Medicines
  const medicine1 = await prisma.medicine.create({
    data: {
      id: 'medicine-1',
      name: 'Paracetamol',
      description: '500mg tablets',
      strength: '500mg',
      form: 'TABLET',
      isControlled: false,
    },
  })

  const medicine2 = await prisma.medicine.create({
    data: {
      id: 'medicine-2',
      name: 'Amoxicillin',
      description: '250mg capsules',
      strength: '250mg',
      form: 'CAPSULE',
      isControlled: false,
    },
  })

  const medicine3 = await prisma.medicine.create({
    data: {
      id: 'medicine-3',
      name: 'Morphine',
      description: '10mg/ml solution',
      strength: '10mg/ml',
      form: 'SOLUTION',
      isControlled: true,
    },
  })

  // Create Consultations
  const consultation1 = await prisma.consultation.create({
    data: {
      id: 'consultation-1',
      patientId: patient1.id,
      doctorName: 'Dr. Smith',
      consultationDate: new Date('2024-01-15'),
      notes: 'Patient presents with headache and fever.',
    },
  })

  const consultation2 = await prisma.consultation.create({
    data: {
      id: 'consultation-2',
      patientId: patient2.id,
      doctorName: 'Dr. Jones',
      consultationDate: new Date('2024-01-16'),
      notes: 'Patient requires antibiotics for infection.',
    },
  })

  // Create Prescriptions
  const prescription1 = await prisma.prescription.create({
    data: {
      id: 'prescription-1',
      prescriptionNumber: 'RX000001',
      consultationId: consultation1.id,
      status: 'READY_FOR_SIGNATURE', // This is the status that triggers Phase 5
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const prescription2 = await prisma.prescription.create({
    data: {
      id: 'prescription-2',
      prescriptionNumber: 'RX000002',
      consultationId: consultation2.id,
      status: 'ACTIVE', // Already signed, etc.
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Create Pharmacies
  const pharmacy1 = await prisma.pharmacy.create({
    data: {
      id: 'pharmacy-1',
      odsCode: 'ABC123',
      name: 'Wellness Pharmacy',
      address: '789 High Street',
      city: 'London',
      postcode: 'SW1A 2AA',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
      email: 'info@wellnesspharmacy.co.uk',
      phone: '020 7946 0123',
      website: 'https://www.wellnesspharmacy.co.uk',
      openingHours: {
        monday: '09:00-18:00',
        tuesday: '09:00-18:00',
        wednesday: '09:00-18:00',
        thursday: '09:00-18:00',
        friday: '09:00-18:00',
        saturday: '09:00-13:00',
        sunday: 'Closed',
      },
      supportsPrivatePrescriptions: true,
      supportsControlledDrugs: true,
      offersDelivery: true,
      isPreferred: true,
      isActive: true,
    },
  })

  const pharmacy2 = await prisma.pharmacy.create({
    data: {
      id: 'pharmacy-2',
      odsCode: 'DEF456',
      name: 'City Care Pharmacy',
      address: '321 Oxford Road',
      city: 'Manchester',
      postcode: 'M1 2BB',
      country: 'UK',
      latitude: 53.4808,
      longitude: -2.2426,
      email: 'info@citycarepharmacy.co.uk',
      phone: '0161 832 1122',
      website: 'https://www.citycarepharmacy.co.uk',
      openingHours: {
        monday: '08:30-18:30',
        tuesday: '08:30-18:30',
        wednesday: '08:30-18:30',
        thursday: '08:30-18:30',
        friday: '08:30-18:30',
        saturday: '09:00-13:00',
        sunday: 'Closed',
      },
      supportsPrivatePrescriptions: true,
      supportsControlledDrugs: false,
      offersDelivery: true,
      isPreferred: false,
      isActive: true,
    },
  })

  // Create Email Templates
  const emailTemplate1 = await prisma.emailTemplate.create({
    data: {
      id: 'email-template-1',
      name: 'Prescription Ready Notification',
      subject: 'Your prescription is ready for collection',
      htmlBody: `
        <h2>Hello {{patientFirstName}},</h2>
        <p>Your prescription ({{prescriptionNumber}}) is ready for collection at {{pharmacyName}}.</p>
        <p>Please bring a valid ID with you.</p>
        <br/>
        <p>Thank you,<br/>TruWell Pharmacy Team</p>
      `,
      textBody: `
        Hello {{patientFirstName}},

        Your prescription ({{prescriptionNumber}}) is ready for collection at {{pharmacyName}}.
        Please bring a valid ID with you.

        Thank you,
        TruWell Pharmacy Team
      `,
      isActive: true,
    },
  })

  const emailTemplate2 = await prisma.emailTemplate.create({
    data: {
      id: 'email-template-2',
      name: 'Prescription Sent Notification',
      subject: 'Your prescription has been sent',
      htmlBody: `
        <h2>Hello {{patientFirstName}},</h2>
        <p>Your prescription ({{prescriptionNumber}}) has been sent to {{pharmacyName}} for delivery.</p>
        <p>Expected delivery date: {{deliveryDate}}.</p>
        <br/>
        <p>Thank you,<br/>TruWell Pharmacy Team</p>
      `,
      textBody: `
        Hello {{patientFirstName}},

        Your prescription ({{prescriptionNumber}}) has been sent to {{pharmacyName}} for delivery.
        Expected delivery date: {{deliveryDate}}.

        Thank you,
        TruWell Pharmacy Team
      `,
      isActive: true,
    },
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })