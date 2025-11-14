import type { Metadata } from "next";

const supportCards = [
  {
    title: "Patient Support",
    description: "Questions about visits, records, or navigating your next appointment.",
    phone: "(555) 400-1100",
    email: "support@fictionalhealthcare.org",
    hours: "Daily 7a-10p ET",
  },
  {
    title: "Make or Change Appointments",
    description: "Connect with schedulers for primary, specialty, or virtual visits.",
    phone: "(555) 200-4455",
    email: "scheduling@fictionalhealthcare.org",
    hours: "Mon-Fri 7a-7p ET",
  },
  {
    title: "Billing & Financial Assistance",
    description: "Discuss statements, payment plans, or financial counseling resources.",
    phone: "(555) 877-9900",
    email: "billing@fictionalhealthcare.org",
    hours: "Mon-Fri 8a-6p ET",
  },
];

const locationContacts = [
  {
    region: "Tampa Bay",
    address: "100 Bayside Blvd, Clearwater, FL 33755",
    phone: "(555) 100-2000",
    services: "Hospitals, specialty clinics, urgent care",
  },
  {
    region: "Lakeland & Polk",
    address: "300 Lakeview Dr, Lakeland, FL 33801",
    phone: "(555) 712-4500",
    services: "Cancer center, imaging, rehab",
  },
  {
    region: "Sarasota & Coastal",
    address: "1420 Shoreline Dr, Sarasota, FL 34236",
    phone: "(555) 267-4400",
    services: "Rehab and therapy, sports performance",
  },
];

export const metadata: Metadata = {
  title: "Contact Us | Fictional HealthCare ",
  description:
    "Reach Fictional HealthCare  by phone, email, or secure message for appointments, billing, and community questions.",
};

export default function ContactPage() {
  return (
    <main className="bg-slate-50 pb-16">
      <section className="bg-gradient-to-br from-sky-900 to-slate-900 py-12 text-white">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
              Contact Fictional HealthCare 
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              We are here to help patients, families, and partners
            </h1>
            <p className="text-base text-slate-200">
              Choose the option that best matches your need. Our teams respond quickly by phone, email,
              or secure message. For medical emergencies please call 911.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">
              Emergency or crisis support: Call 911 or the Suicide & Crisis Lifeline at 988.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {supportCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">{card.title}</h2>
                <p className="text-sm text-slate-600">{card.description}</p>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>
                    Phone:{" "}
                    <a
                      href={`tel:${card.phone.replace(/[^\d]/g, "")}`}
                      className="font-semibold text-sky-700 hover:text-sky-900"
                    >
                      {card.phone}
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${card.email}`}
                      className="font-semibold text-sky-700 hover:text-sky-900"
                    >
                      {card.email}
                    </a>
                  </p>
                  <p>Hours: {card.hours}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Send us a secure message</h2>
            <p className="mt-2 text-sm text-slate-600">
              Share details about your question and our team will respond within two business days.
              Please do not include sensitive medical information.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="contact-name">
                  Full name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="First and last name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="contact-phone">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="contact-topic">
                  Topic
                </label>
                <select
                  id="contact-topic"
                  name="topic"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  <option value="">Select a topic</option>
                  <option value="appointments">Appointments</option>
                  <option value="billing">Billing</option>
                  <option value="medical-records">Medical records</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="mt-1 h-32 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Submit message
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Regional contact centers</h3>
              <p className="mt-2 text-sm text-slate-600">
                Call your local hub for directions, visiting hours, or community program details.
              </p>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                {locationContacts.map((location) => (
                  <div key={location.region} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{location.region}</p>
                    <p>{location.address}</p>
                    <p>{location.services}</p>
                    <a
                      href={`tel:${location.phone.replace(/[^\d]/g, "")}`}
                      className="mt-1 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900"
                    >
                      {location.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="text-lg font-semibold text-amber-900">Media inquiries</h3>
              <p className="mt-2 text-sm text-amber-900">
                Journalists can email{" "}
                <a
                  href="mailto:media@fictionalhealthcare.org"
                  className="font-semibold underline decoration-amber-500"
                >
                  media@fictionalhealthcare.org
                </a>{" "}
                or call (555) 800-8899. Our communications team monitors requests 24/7 for urgent needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                question: "How do I request my medical records?",
                answer:
                  "Submit a signed authorization through MyChart or fax it to (555) 433-2121. Records are typically processed within five business days.",
              },
              {
                question: "Where can I pay my bill online?",
                answer:
                  "Visit the Billing & Financial Assistance page or log into MyChart to review statements, set up payment plans, and update insurance.",
              },
              {
                question: "Do you offer interpreter services?",
                answer:
                  "Yes. Request interpretation when scheduling or call Patient Support so we can coordinate services before your visit.",
              },
            ].map((item) => (
              <details
                key={item.question}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-2 text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
