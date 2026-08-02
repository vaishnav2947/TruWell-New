"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = generatePdf;
async function generatePdf(prescription) {
    return Buffer.from(`PDF content for prescription ${prescription.prescriptionNumber}`);
}
//# sourceMappingURL=pdf-generator.js.map