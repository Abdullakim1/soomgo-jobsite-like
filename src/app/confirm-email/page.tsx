export default function ConfirmEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 text-center bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-gray-600">
          We've sent a confirmation link to your email address. Please click the
          link to complete your registration.
        </p>
      </div>
    </div>
  );
}
