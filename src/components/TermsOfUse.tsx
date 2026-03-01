import React from 'react'

const TermsOfUse = () => {
  return (
    <div>
      <div className="text-left text-sm text-gray-600 space-y-4 mt-4">
        <p className="text-xs text-gray-400">Last Updated: March 1, 2026</p>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">
            1. Acceptance of Terms
          </h3>
          <p>
            By accessing or using Min-Jee's services, you agree to be bound by
            these Terms of Use. If you do not agree, please do not use our
            services.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">
            2. Services Overview
          </h3>
          <p>
            Min-Jee provides party rental equipment and event booking services.
            Our offerings include but are not limited to tables, chairs, linens,
            decorations, and event coordination services.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">3. Rental Terms</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Rental Period:</strong> Standard rental period is
              specified at checkout. Extensions may incur additional charges.
            </li>
            <li>
              <strong>Condition of Items:</strong> Items must be returned in the
              same condition as received. You are responsible for any damage,
              loss, or excessive cleaning required.
            </li>
            <li>
              <strong>Delivery & Pickup:</strong> Delivery and pickup times are
              estimates. We will communicate any changes promptly.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">
            4. Booking & Payment
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>A deposit may be required to confirm your booking</li>
            <li>Full payment is due as specified in your order confirmation</li>
            <li>
              Prices are subject to change but confirmed orders will honor the
              quoted price
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">
            5. Cancellation Policy
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>More than 7 days before event:</strong> Full refund minus
              processing fees
            </li>
            <li>
              <strong>3-7 days before event:</strong> 50% refund
            </li>
            <li>
              <strong>Less than 3 days before event:</strong> No refund
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">6. Liability</h3>
          <p>
            You agree to use rented items responsibly. Min-Jee is not liable for
            injuries or damages resulting from misuse of rental items. Users are
            responsible for ensuring items are used safely and appropriately.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">
            7. Account Responsibility
          </h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">8. Modifications</h3>
          <p>
            Min-Jee reserves the right to modify these terms at any time.
            Continued use of our services constitutes acceptance of updated
            terms.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-gray-800 mb-2">9. Contact</h3>
          <p>
            For questions about these terms, please contact our customer support
            team.
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfUse
