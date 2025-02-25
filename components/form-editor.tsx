"use client";

import React, { useState, ChangeEvent } from "react";
import {
  addQuestion,
  deleteQuestion,
  setActiveQuestionIndex,
  setDesc,
  setTitle,
} from "@/redux/formSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import EditButton from "./edit-button";
import Question from "./question";

export default function FormEditor() {
  const title = useSelector((state: RootState) => state.form.title);
  const description = useSelector((state: RootState) => state.form.desc);
  const questions = useSelector((state: RootState) => state.form.questions);
  const activeQuestionIndex = useSelector(
    (state: RootState) => state.form.activeQuestionIndex
  );

  const dispatch = useDispatch();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleDescChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDesc(e.target.value));
  };

  const handleAddQuestion = () => {
    dispatch(addQuestion());
  };

  const handleDeleteQuestion = (index: number) => {
    dispatch(deleteQuestion(index));
  };

  const handleQuestionClick = (index: number) => {
    dispatch(setActiveQuestionIndex(index));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveForm = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, questions }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save form");
      }

      dispatch(setTitle(""));
      dispatch(setDesc(""));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-10">
      <form className="w-full max-w-3xl mx-auto px-4 md:px-0">
        <div className="border-t-4 border-teal-500 bg-white shadow-lg rounded-lg p-6">
          <input
            type="text"
            onChange={handleTitleChange}
            value={title ?? ""}
            required
            className="text-3xl font-semibold border-b-2 border-gray-300 outline-none focus:border-teal-500 w-full py-2 transition-all"
            placeholder="Form Title"
          />
          <input
            type="text"
            onChange={handleDescChange}
            value={description ?? ""}
            required
            placeholder="Form Description"
            className="text-lg font-medium border-b-2 border-gray-300 outline-none focus:border-teal-500 w-full py-2 mt-3 transition-all"
          />
        </div>

        {error && (
          <div className="text-red-500 text-center my-4">{error}</div>
        )}

        <div className="mt-4">
          {questions.length === 0 && (
            <EditButton
              handleAdd={handleAddQuestion}
              show
              handleDelete={() =>
                handleDeleteQuestion(questions.length - 1)
              }
            />
          )}
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`bg-white shadow-md rounded-lg p-5 transition-all ${
                index === activeQuestionIndex ? "ring-2 ring-teal-500" : ""
              }`}
            >
              <Question
                onclick={() => handleQuestionClick(index)}
                index={index}
                value={question}
                addQuestion={handleAddQuestion}
                handleDelete={() => handleDeleteQuestion(index)}
                isActiveQuestion={index === activeQuestionIndex}
              />
            </div>
          ))}
        </div>

        {questions.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              onClick={handleSaveForm}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 transition-all"
            >
              {loading ? "Processing..." : "Save Form"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}