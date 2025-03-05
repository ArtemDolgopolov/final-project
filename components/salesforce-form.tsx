"use client";

import { useState, useEffect } from "react";

export default function SalesforceForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  useEffect(() => {
    async function fetchSalesforceStatus() {
      const res = await fetch("/api/salesforce/status");
      if (res.ok) {
        const data = await res.json();
        setIsRegistered(data.salesforceRegistered);
      }
    }
    fetchSalesforceStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/salesforce/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);
    if (response.ok) {
      alert("Account and Contact created successfully!");
      setIsOpen(false);
      setIsRegistered(true);
    } else {
      alert("Failed to create account and contact.");
    }
  };

  return (
    <>
      {!isRegistered ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Connect to Salesforce
        </button>
      ) : (
        <p className="text-green-600 font-semibold">✅ Already connected to Salesforce</p>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96 h-[75%]">

            <div className="flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="mb-2 text-black font-bold hover:underline"
              >
                x
              </button>
            </div>
          
            <h2 className="text-xl text-center text-black font-semibold mb-4">Salesforce Account</h2>
            <form onSubmit={handleSubmit} className="space-y-1">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-green-600 w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}