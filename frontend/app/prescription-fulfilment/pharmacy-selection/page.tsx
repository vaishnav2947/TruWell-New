export const metadata = {
  title: 'Select Pharmacy',
  description: 'Select a pharmacy to send the prescription to',
};

export default function PharmacySelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Select Pharmacy</h1>
        <p className="text-gray-600">Choose a pharmacy to send this prescription to</p>
      </div>

      <div className="space-y-6">
        {/* Pharmacy Search */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Search Pharmacies</h2>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by postcode, pharmacy name, ODS code..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-3 w-3" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-3 w-3" />
                View Map
              </Button>
            </div>
          </div>
        </Card>

        {/* Pharmacy List */}
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Available Pharmacies</h2>
          <div className="space-y-4">
            {/* Pharmacy Card */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">TruWell Pharmacy - Main Branch</h3>
                  <p className="text-sm text-gray-500">
                    123 Pharmacy Street, London, SW1A 1AA
                  </p>
                  <p className="text-sm text-gray-500">
                    ODS Code: F12345 | Phone: 020 1234 5678
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                      Private Prescriptions
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                      Controlled Drugs
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Delivery Available
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    0.2 miles
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Select this pharmacy
                      alert('Pharmacy selected');
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </div>

            {/* More pharmacies would be listed here */}
          </div>
        </Card>

        {/* Recently Used and Favourites */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Card>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Recently Used</h2>
              <p className="text-gray-500 text-center py-4">No recent pharmacies</p>
            </Card>
          </div>
          <div>
            <Card>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Favourite Pharmacies</h2>
              <p className="text-gray-500 text-center py-4">No favourite pharmacies</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            // Go back to signature
            // In a real app, we would use router.back()
          }}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // Proceed to email preview
            alert('Proceeding to email preview');
          }}
        >
          Continue to Email Preview
        </Button>
      </div>
    </div>
  );
}