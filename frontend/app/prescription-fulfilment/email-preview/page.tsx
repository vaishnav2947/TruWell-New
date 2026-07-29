export const metadata = {
  title: 'Email Preview',
  description: 'Preview and edit the email to be sent to the pharmacy',
};

export default function EmailPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Preview</h1>
        <p className="text-gray-600">Review and edit the email that will be sent to the pharmacy</p>
      </div>

      <div className="space-y-6">
        {/* Email Header */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Email Details</h2>
          <div className="space-y-2">
            <p><strong>To:</strong> pharmacy@example.com</p>
            <p><strong>Subject:</strong> Private Prescription - RX123456 - John Doe</p>
            <p><strong>Priority:</strong> Normal</p>
          </div>
        </Card>

        {/* Email Body - Editable */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Email Content</h2>
          <div className="space-y-4">
            {/* Editable sections */}
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Greeting (Editable)</h3>
              <textarea
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Dear Pharmacy Team,"
              />
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Introduction (Editable)</h3>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Please find attached the private prescription for the patient detailed below."
              />
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Clinical Notes (Read-only)</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-700">
                  Patient presents with symptoms of acute bacterial sinusitis. Prescribed amoxicillin
                  500mg three times daily for 7 days. No known allergies.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Instructions (Editable)</h3>
              <textarea
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Please dispense as directed and counsel patient on completion of course."
              />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Closing (Editable)</h3>
              <textarea
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Thank you for your service."
              />
            </div>
          </div>
        </Card>

        {/* Attachments */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Attachments</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <Picture className="h-5 w-5" />
                <div>
                  <p className="font-medium">Prescription_RX123456.pdf</p>
                  <p className="text-sm text-gray-500">PDF | 245 KB</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <div>
                  <p className="font-medium">Patient_Summary.pdf</p>
                  <p className="text-sm text-gray-500">PDF | 120 KB</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Email Preview</h2>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <p>Dear Pharmacy Team,</p>
              <p>Please find attached the private prescription for the patient detailed below.</p>
              <div className="bg-gray-50 p-3 rounded mb-4">
                <p className="text-sm text-gray-700">
                  Patient presents with symptoms of acute bacterial sinusitis. Prescribed amoxicillin
                  500mg three times daily for 7 days. No known allergies.
                </p>
              </div>
              <p>Please dispense as directed and counsel patient on completion of course.</p>
              <p>Thank you for your service.</p>
              <p>Best regards,<br/>Dr. Jane Smith<br/>TruWell Pharmacy</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            // Go back to pharmacy selection
          }}
        >
          Back to Pharmacy Selection
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // Proceed to MFA verification
            alert('Proceeding to MFA verification');
          }}
        >
          Continue to MFA Verification
        </Button>
      </div>
    </div>
  );
}