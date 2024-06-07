// FeedbackModalContent.jsx
import React, { useState } from "react";
import { deleteSwap } from "../../features/swaps/swapsSlice";
import { useDispatch } from "react-redux";

const FeedbackModalContent = ({ request, onComplete }) => {
  const dispatch = useDispatch();
  const [feedbackStep, setFeedbackStep] = useState(0);
  const [feedback, setFeedback] = useState({
    completed: "",
    issue: "",
    suggestion: "",
  });

  const handleNext = () => {
    if (feedbackStep === 1 || feedbackStep === 2) {
      dispatch(deleteSwap(request._id))
        .unwrap()
        .then(() => {
          onComplete();
        })
        .catch((error) => {
          console.error("Failed to delete swap:", error);
        });
    } else {
      setFeedbackStep(feedbackStep + 1);
    }
  };

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const feedbackQuestions = [
    "Did you complete this swap?",
    "We're sorry to hear that. What went wrong?",
    "Do you have any suggestions for us to make the app better?",
  ];

  return (
    <div>
      {feedbackStep === 0 ? (
        <>
          <p>{feedbackQuestions[feedbackStep]}</p>
          <div className="flex space-x-4 mt-2">
            <button
              className="bg-lime-400 text-black font-bold py-2 px-4 rounded"
              onClick={() => {
                setFeedback({ ...feedback, completed: "yes" });
                setFeedbackStep(2); // Skip to the suggestion question
              }}
            >
              Yes
            </button>
            <button
              className="bg-red-500 text-black font-bold py-2 px-4 rounded"
              onClick={() => {
                setFeedback({ ...feedback, completed: "no" });
                handleNext();
              }}
            >
              No
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{feedbackQuestions[feedbackStep]}</p>
          <textarea
            name={feedbackStep === 1 ? "issue" : "suggestion"}
            value={feedbackStep === 1 ? feedback.issue : feedback.suggestion}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            rows="3"
            placeholder="You can provide your feedback here (optional)"
          ></textarea>
          <div className="flex justify-end mt-4">
            <button
              className="bg-teal-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleNext}
            >
              {feedbackStep === 2 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackModalContent;
