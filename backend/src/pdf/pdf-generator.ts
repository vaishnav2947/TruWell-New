export async function generatePdf(prescription: any): Promise<Buffer> {
  return Buffer.from(`PDF content for prescription ${prescription.prescriptionNumber}`);
}
