"use client";

import { useState } from "react";

export default function EditableAnswers({
  formId,
  initialAnswers,
  questions,
}: {
  formId: string;
  initialAnswers: Record<string, string>;
  questions: { id: string; title: string; label: string; type: string }[];
}) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [saving, setSaving] = useState(false);

  const handleChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error("Error during saving");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6 md:px-0">
        <h1 className="text-3xl font-bold mb-6">Редактирование ответов</h1>

        <div className="bg-white p-6 shadow-md rounded-md">
          <div className="mt-6 space-y-4">
            {questions.map((field, index) => (
              <div key={field.id || index} className="bg-gray-50 p-4 rounded-md shadow-sm">
                <label className="block text-lg font-semibold">{field.label}</label>
                <p className="text-sm text-gray-500 mb-2">{field.title}</p>

                {field.type === "textarea" ? (
                  <textarea
                    value={answers[field.id ?? field.title] || ""}
                    onChange={(e) => handleChange(field.id ?? field.title, e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                  />
                ) : field.type === "checkbox" ? (
                 <input
                   type="checkbox"
                   checked={Boolean(answers[field.id ?? field.title])}
                   onChange={(e) => handleChange(field.id ?? field.title, e.target.checked ? "true" : "")}
                   className="w-5 h-5 text-[#29A0B1] border-gray-300 rounded-md focus:ring-2 focus:ring-[#29A0B1]"
                 />
               ) : (
                  <input
                    type={field.type}
                    onChange={(e) => handleChange(field.id ?? field.title, e.target.value)}
                    value={answers[field.id ?? field.title] || ""}
                    className="w-full p-2 border rounded-md"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white shadow-md hover:bg-blue-600"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}