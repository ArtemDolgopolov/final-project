"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Form {
  id: string;
  title: string;
  description: string;
  questions: { id: string; label: string; type: string; title: string }[];
}

export default function FormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("answers") || "{}");
    }
    return {};
  });

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndForm = async () => {
      try {
        const sessionRes = await axios.get("/api/session");
        setUserRole(sessionRes.data?.user?.role || null);

        const formRes = await axios.get(`/api/forms/${id}`);
        setForm(formRes.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndForm();
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("answers", JSON.stringify(answers));
    }
  }, [answers]);

  const handleChange = (fieldId: string, value: string | boolean) => {
    if (!fieldId) return;
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, checked: boolean) => {
    handleChange(fieldId, checked);
  };

  const handleSubmit = async () => {
    if (!userRole) {
      alert("Log In to send a form.");
      return;
    }

    try {
      await axios.post(`/api/forms/${id}`, { answers });
      alert("Answers are saved!");
    } catch (error) {
      alert("Error during saving");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-[#E3F4F4] w-full min-h-screen py-10">
      <form className="w-full max-w-3xl mx-auto px-6 md:px-0">
        <div className="border-t-8 border-[#29A0B1] bg-white shadow-md rounded-md w-full mx-auto p-6">
          <h1 className="text-3xl font-bold capitalize border-b-2 border-gray-300 w-full py-2">{form?.title}</h1>
          <p className="text-base font-medium capitalize border-b-2 border-gray-300 w-full py-1 mt-2">{form?.description}</p>
        </div>

        <div className="space-y-4 mt-6">
          {form?.questions.map((field) => (
            <div key={field.id} className="bg-white shadow-md rounded-md p-4">
              <label className="block text-lg font-semibold text-gray-700">{field.label}</label>
              <label className="block text-sm text-gray-500 mb-2">{field.title}</label>

              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(answers[field.id ?? field.title])}
                  onChange={(e) => handleCheckboxChange(field.id ?? field.title, e.target.checked)}
                  className="w-5 h-5 text-[#29A0B1] border-gray-300 rounded-md focus:ring-2 focus:ring-[#29A0B1]"
                  disabled={!userRole}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  value={String(answers[field.id ?? field.title] || "")}
                  onChange={(e) => handleChange(field.id ?? field.title, e.target.value)}
                  rows={4}
                  cols={50}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-[#29A0B1] focus:ring-2 focus:ring-[#29A0B1] outline-none"
                  disabled={!userRole}
                />
              ) : (
                <input
                  type={field.type}
                  value={String(answers[field.id ?? field.title] || "")}
                  onChange={(e) => handleChange(field.id ?? field.title, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-[#29A0B1] focus:ring-2 focus:ring-[#29A0B1] outline-none"
                  disabled={!userRole}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className={`px-6 py-3 rounded-lg shadow-md transition-all ${
              !userRole
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#29A0B1] text-white hover:bg-opacity-80"
            }`}
            disabled={!userRole}
          >
            {userRole ? "Save" : "Log In to answer"}
          </button>
        </div>
      </form>
    </div>
  );
}