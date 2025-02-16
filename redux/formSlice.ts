import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  title: string;
  desc: string;
  questions: Array<{
    title: string;
    type: string;
  }>;
  activeQuestionIndex: number | null;
}

const initialState: FormState = {
  title: "Title Form",
  desc: "",
  questions: [],
  activeQuestionIndex: null,
}

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setTitle(state: FormState, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setDesc(state: FormState, action: PayloadAction<string>) {
      state.desc = action.payload;
    },
    addQuestion(state: FormState) {
      const newQuestion = {
        title: "",
        type: "text",
      };

      return {
        ...state,
        questions: [...state.questions, newQuestion],
        activeQuestionIndex: state.questions.length
      };
    },
   deleteQuestion(state: FormState, action: PayloadAction<number>) {
     const index = action.payload;
     state.questions.splice(index, 1);
     if (state.activeQuestionIndex !== null) {
      state.activeQuestionIndex = index === state.questions.length ? index - 1 : null;
     }
   },
   setActiveQuestionIndex(state: FormState, action: PayloadAction<number | null>) {
    state.activeQuestionIndex = action.payload;
   },
   updateQuestionTitle(state: FormState, action: PayloadAction<{ index: number; title: string }>) {
     const { index, title } = action.payload;
     state.questions[index].title = title;
   },
   updateQuestionType(state: FormState, action: PayloadAction<{ index: number; type: string }>) {
     const { index, type } = action.payload;
     state.questions[index].type = type;
   }
  },
})

export const {
  setTitle,
  setDesc,
  addQuestion,
  deleteQuestion,
  setActiveQuestionIndex,
  updateQuestionTitle,
  updateQuestionType
} = formSlice.actions;

export default formSlice.reducer;