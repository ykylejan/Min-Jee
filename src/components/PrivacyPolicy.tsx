import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="text-left text-sm text-gray-600 space-y-4 mt-4">
      <p className="text-xs text-gray-400">Last Updated: March 1, 2026</p>

      <section>
        <h3 className="font-semibold text-gray-800 mb-2">
          1. Information We Collect
        </h3>
        <p>
          When you create an account or place an order with Min-Jee, we collect:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Personal information (name, email, phone number, address)</li>
          <li>Event details (date, time, location, type of event)</li>
          <li>
            Payment information (processed securely through our payment
            providers)
          </li>
          <li>Rental preferences and order history</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-gray-800 mb-2">
          2. How We Use Your Information
        </h3>
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Process and fulfill your rental orders and event bookings</li>
          <li>Communicate about your orders, deliveries, and pickups</li>
          <li>Send booking confirmations and reminders</li>
          <li>Improve our services and customer experience</li>
          <li>Send promotional offers (with your consent)</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-gray-800 mb-2">
          3. Information Sharing
        </h3>
        <p>
          We do not sell your personal information. We may share your
          information with:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Delivery partners to fulfill your orders</li>
          <li>Payment processors to complete transactions</li>
          <li>Service providers who assist our operations</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-gray-800 mb-2">4. Data Security</h3>
        <p>
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, or disclosure.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-gray-800 mb-2">5. Your Rights</h3>
        <p>
          You have the right to access, update, or delete your personal
          information. Contact us to exercise these rights.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-gray-800 mb-2">6. Contact Us</h3>
        <p>
          For privacy-related inquiries, please contact our support team through
          the app or website.
        </p>
      </section>
    </div>
  )
}

export default PrivacyPolicy
