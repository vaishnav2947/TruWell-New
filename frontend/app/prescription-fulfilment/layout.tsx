export const metadata = {
  title: 'Prescription Fulfilment',
  description: 'Prescription fulfilment workflow for TruWell Pharmacy',
};

export default function FulfilmentLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* We could add a header or sidebar specific to fulfilment here */}
      {children}
    </>
  );
}