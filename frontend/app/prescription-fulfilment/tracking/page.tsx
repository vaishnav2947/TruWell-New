export const metadata = {
  title: 'Tracking Details',
  description: 'View detailed tracking information for the prescription',
};

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tracking Details</h1>
        <p className="text-gray-600">
          View the complete delivery timeline and status updates
        </p>
      </div>

      <div className="space-y-6">
        {/* Tracking Timeline */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Delivery Timeline</h2>
          <div className="space-y-4">
            {/* Timeline Item */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-600 rounded-full mt-1" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-gray-800">Sent</h3>
                <p className="text-sm text-gray-600">
                  Today, 2:30 PM
                </p>
                <p className="text-xs text-gray-500">
                  Prescription transmitted via secure email to Harris Pharmacy
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-gray-300 rounded-full mt-1" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-gray-800">Delivered</h3>
                <p className="text-sm text-gray-600">
                  Today, 3:15 PM
                </p>
                <p className="text-xs text-gray-500">
                  Email opened by pharmacy staff
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-gray-300 rounded-full mt-1" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-gray-800">Viewed</h3>
                <p className="text-sm text-gray-600">
                  Today, 3:20 PM
                </p>
                <p className="text-xs text-gray-500">
                  Prescription downloaded and prepared for dispensing
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-gray-300 rounded-full mt-1" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-gray-800">Dispensed</h3>
                <p className="text-sm text-gray-600">
                  Today, 4:00 PM
                </p>
                <p className="text-xs text-gray-500">
                  Medication dispensed and ready for pickup
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Delivery Options */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Delivery Options</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white border rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-800">In-Store Pickup</h3>
                <p className="text-sm text-gray-600">
                  Available for pickup at Harris Pharmacy, 123 Pharmacy Street, London
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Bring identification and the prescription reference number
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white border rounded-lg">
              <Truck className="h-4 w-4 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-800">Home Delivery</h3>
                <p className="text-sm text-gray-600">
                  Available to: 456 Patient Avenue, London, SW1B 2CC
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated delivery: Tomorrow by 3:00 PM
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Available Actions</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">Download Documents</h3>
                <p className="text-sm text-gray-600">
                  Access all documents related to this prescription
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert('Downloading documents');
                }}
              >
                <Download className="mr-2 h-3 w-3" />
                Download All
              </Button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">Resend Prescription</h3>
                <p className="text-sm text-gray-600">
                  Send the prescription again if needed
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert('Resending prescription');
                }}
              >
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Resend
              </Button
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">View Audit Trail</h3>
                <p className="text-sm text-gray-600">
                  See the complete history of actions taken on this prescription
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert('Viewing audit trail');
                }}
              >
                <List className="mr-2 h-3 w-3" />
                Audit Trail
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            // Go back to sent page
          }}
        >
          Back to Sent Status
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // Mark as complete or go to dashboard
            alert('Marking prescription as complete');
          }}
        >
          Mark as Complete
        </Button>
      </div>
    </div>
  );
}