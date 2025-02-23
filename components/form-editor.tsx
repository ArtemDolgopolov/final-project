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
    e.preventDefault();
    dispatch(setTitle(e.target.value));
  };

  const handleDescChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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
    <div className="bg-[#E3F4F4] w-full min-h-screen py-10">
      <form className="w-full max-w-3xl mx-auto px-6 md:px-0">
        <div className="border-t-8 border-[#29A0B1] bg-white shadow-md rounded-md w-full mx-auto p-6">
          <input
            type="text"
            onChange={handleTitleChange}
            value={title ?? ""}
            required
            className="text-3xl font-bold capitalize border-b-2 border-gray-300 outline-none focus:border-[#29A0B1] w-full py-2"
          />
          <input
            type="text"
            onChange={handleDescChange}
            value={description ?? ""}
            required
            placeholder="Form Description"
            className="text-base font-medium capitalize border-b-2 border-gray-300 outline-none focus:border-[#29A0B1] w-full py-1 mt-2"
          />
        </div>

        {error && (
          <div className="text-red-500 text-center my-4">{error}</div>
        )}

        <div>
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

        <div className="relative">
          {questions.map((question, index) => (
            <div key={index} className="bg-white shadow-md rounded-md p-4 relative">
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
              className="bg-[#29A0B1] text-white px-6 py-3 rounded-lg shadow-md hover:bg-opacity-80 transition-all"
            >
              {loading ? "Processing..." : "Save Form"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}