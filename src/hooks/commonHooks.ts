import {useContext, useEffect} from 'react';
import {Gesture, MirabloContext, Question} from '../Db';

const useQuestions = () => {
  const context = useContext(MirabloContext);

  return context.questions;
};

const useQuestion = (id?: string) => {
  const context = useContext(MirabloContext);
  if (!id) {
    return undefined;
  }
  return context.questions.find(question => question.id === id);
};

const useGestureEffect = (
  handler: (gesture: Gesture) => void,
  gestures: Gesture[],
) => {
  const context = useContext(MirabloContext);
  const currentGesture = context.currentGesture;
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (currentGesture && gestures.includes(currentGesture)) {
        handler(currentGesture);
      }
    }, context.config.gestureDuration);
    return () => {
      console.log('clear timeout with ' + currentGesture);
      clearTimeout(timeOut);
    };
  }, [currentGesture, context.config.gestureDuration]);
};

const useMutation = () => {
  const context = useContext(MirabloContext);
  const updateQuestion = (id: string, question: Question) => {
    context.setQuestions(questions => {
      const index = questions.findIndex(question => question.id === id);
      const newQuestions = [...questions];
      newQuestions[index] = question;
      return newQuestions;
    });
  };

  const deleteQuestion = (id: string) => {
    context.setQuestions(questions => {
      const index = questions.findIndex(question => question.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  };

  const createQuestion = (question: Question) => {
    context.setQuestions(questions => {
      const newQuestions = [...questions];
      newQuestions.push(question);
      return newQuestions;
    });
  };

  return {updateQuestion, deleteQuestion, createQuestion};
};

export {useQuestions, useQuestion, useMutation, useGestureEffect};
