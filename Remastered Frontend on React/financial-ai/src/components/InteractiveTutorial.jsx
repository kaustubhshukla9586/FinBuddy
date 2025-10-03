import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import '../styles/InteractiveTutorial.css';

const InteractiveTutorial = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const tutorialSteps = [
    {
      id: 1,
      title: "Welcome to FinWise AI",
      content: "Let's take a quick tour of the main features to help you get started.",
      target: null,
      position: "center"
    },
    {
      id: 2,
      title: "Dashboard Overview",
      content: "This is your financial dashboard where you can see all your spending visualized in charts and graphs.",
      target: ".dashboard-header",
      position: "bottom"
    },
    {
      id: 3,
      title: "Expense Tracking",
      content: "Add your expenses manually, upload CSV files, or connect your bank account for automatic tracking.",
      target: ".entry-tabs",
      position: "bottom"
    },
    {
      id: 4,
      title: "Goal Setting",
      content: "Set financial goals and track your progress with our interactive goal tracker.",
      target: ".goal-card",
      position: "right"
    },
    {
      id: 5,
      title: "AI Assistant",
      content: "Ask our AI assistant any financial questions and get personalized advice.",
      target: ".ai-assistant .header",
      position: "bottom"
    },
    {
      id: 6,
      title: "You're All Set!",
      content: "You're ready to take control of your finances. Start exploring all the features!",
      target: null,
      position: "center"
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => prev + 1);
    } else {
      // Tutorial completed
      if (onComplete) onComplete();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tutorial-overlay">
      <motion.div 
        className="tutorial-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="tutorial-header">
          <h2>{currentStepData.title}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="tutorial-content">
          <p>{currentStepData.content}</p>
          
          {/* Progress indicators */}
          <div className="tutorial-progress">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${completedSteps.has(index) ? 'completed' : ''}`}
              >
                {completedSteps.has(index) ? <Check size={12} /> : index + 1}
              </div>
            ))}
          </div>
        </div>
        
        <div className="tutorial-footer">
          <button 
            className="skip-button"
            onClick={handleSkip}
          >
            Skip Tutorial
          </button>
          
          <div className="navigation-buttons">
            <button
              className="nav-button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <button
              className="nav-button next-button"
              onClick={handleNext}
            >
              {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep !== tutorialSteps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveTutorial;