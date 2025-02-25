"use client"

import { useDispatch } from "react-redux";
import { updateQuestionTitle, updateQuestionType } from "@/redux/formSlice";
import { Select } from "antd";
import EditButton from "./edit-button";
import ShortAnswer from "./qtypes/short-answer";
import Paragraph from "./qtypes/paragraph";
import Checkbox from "./qtypes/checkbox";
import NumberQuestion from "./qtypes/number";

const data = [
 {
  title: "text",
  file: <ShortAnswer />,
 },
 {
  title: "textarea",
  file: <Paragraph />,
 },
 {
  title: "checkbox",
  file: <Checkbox />,
 },
 {
  title: "number",
  file: <NumberQuestion />,
 }
]

export default function Question({
  index,
  value,
  addQuestion,
  handleDelete,
  isActiveQuestion,
  onclick
}: {
  index: number;
  value: {title: string; type: string };
  addQuestion: () => void;
  handleDelete: () => void;
  isActiveQuestion: boolean;
  onclick: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {

  const { title, type } = value;
  const dispatch = useDispatch();

  const handleChange = (newValue: string) => {
    dispatch(updateQuestionTitle({ index, title: newValue }))
  }

  const handleTypeChange = (value: string) => {
   dispatch(updateQuestionType({ index, type: value }))
 }

 const qType = data.find((elem) => elem.title === type);

  return (
    <div onClick={onclick} className="flex flex-col justify-center items-center w-full max-w-3xl mx-auto">
      <div className="w-full md:px-6 px-2 flex md:flex-row flex-col md:justify-between justify-center items-center gap-8 py-6">
       <input 
         type="text" 
         value={title}
         onChange={(e) => handleChange(e.target.value)}
         placeholder="Question"
         required
         className="text-base px-4 outline-none capitalize border-b bg-gray-100 focus:border-b-2 border-gray-400 pt-3 pb-2 w-full focus:border-[#29A0B1]"  
       />
       <Select 
         placeholder="Question Type"
         style={{ width: 300 }}
         onChange={handleTypeChange}
         value={type}
         options={[
          { value: "text", label: "Short Answer" },
          { value: "textarea", label: "Paragraph" },
          { value: "checkbox", label: "Checkbox" },
          { value: "number", label: "Number" }
         ]}
       />
      </div>
      {qType && <div className="w-full">{qType.file}</div>}

      {isActiveQuestion && (
       <EditButton handleAdd={addQuestion} handleDelete={handleDelete} />
      )}
    </div>
  )
}