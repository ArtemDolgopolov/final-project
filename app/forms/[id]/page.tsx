"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { AxiosError } from "axios";

interface Question {
  id: string;
  label: string;
  type: string;
  title: string;
}

interface Like {
  id: string;
}

interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  likes?: Like[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userComments: {
    name: string;
    image?: string;
  };
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

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [sessionRes, formRes, commentsRes, likesRes] = await Promise.all([
          axios.get("/api/session"),
          axios.get(`/api/forms/${id}`),
          axios.get(`/api/forms/${id}/comment`),
          axios.get(`/api/forms/${id}/like`)
        ]);
        setUserRole(sessionRes.data?.user?.role || null);
        setForm(formRes.data);
        setComments(commentsRes.data);
        setLikeCount(likesRes.data.likeCount);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    }
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
      console.error("Error during saving: ", error);
      alert("Error during saving");
    }
  };


  const handleLike = async () => {
    if (!userRole) {
      alert("Log In to like the form.");
      return;
    }
    try {
      await axios.post(`/api/forms/${id}/like`);
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    } catch (error: AxiosError) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
        setLiked(true);
      } else {
        alert("Error during liking");
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!userRole) {
      alert("Log In to comment on the form.");
      return;
    }
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }
    try {
      const res = await axios.post(`/api/forms/${id}/comment`, { text: newComment });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment: ", error);
      alert("Error submitting comment");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-[#E3F4F4] w-full min-h-screen py-10">
      <form className="w-full max-w-3xl mx-auto px-6 md:px-0">
        <div className="border-t-8 border-[#29A0B1] bg-white shadow-md rounded-md w-full mx-auto p-6">
          <h1 className="text-3xl font-bold capitalize border-b-2 border-gray-300 w-full py-2">
            {form?.title}
          </h1>
          <p className="text-base font-medium capitalize border-b-2 border-gray-300 w-full py-1 mt-2">
            {form?.description}
          </p>
        </div>

        <div className="space-y-4 mt-6">
          {form?.questions.map((field, index) => (
            <div key={field.id || index} className="bg-white shadow-md rounded-md p-4">
              <label className="block text-lg font-semibold text-gray-700">
                {field.label}
              </label>
              <label className="block text-sm text-gray-500 mb-2">
                {field.title}
              </label>

              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(answers[field.id ?? field.title])}
                  onChange={(e) =>
                    handleCheckboxChange(field.id ?? field.title, e.target.checked)
                  }
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

        <div className="mt-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleLike}
              disabled={!userRole || liked}
              className={`px-4 py-2 rounded ${
                !userRole || liked
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {liked ? "Liked" : "Like"}
            </button>
            <span className="ml-4">
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold">Comments</h2>
            <div className="mt-2 space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-600">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border p-2 rounded">
                    <p className="text-sm font-medium">{comment.userComments.name}</p>
                    <p className="text-gray-700">{comment.text}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Write a comment..."
                disabled={!userRole}
              />
              <button
                type="button"
                onClick={handleCommentSubmit}
                disabled={!userRole}
                className={`mt-2 px-4 py-2 rounded ${
                  !userRole
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}