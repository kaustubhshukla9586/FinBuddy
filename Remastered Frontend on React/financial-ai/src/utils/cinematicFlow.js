// Cinematic demo flow utility
export const cinematicFlow = {
  // Sequence of animations for the demo flow
  sequence: [
    {
      step: 1,
      element: '.landing-page',
      animation: 'fadeIn',
      duration: 1000,
      delay: 0
    },
    {
      step: 2,
      element: '.dashboard',
      animation: 'slideInFromRight',
      duration: 800,
      delay: 500
    },
    {
      step: 3,
      element: '.ai-assistant',
      animation: 'popIn',
      duration: 600,
      delay: 300
    },
    {
      step: 4,
      element: '.goal-tracker',
      animation: 'fadeInUp',
      duration: 800,
      delay: 400
    },
    {
      step: 5,
      element: '.confetti',
      animation: 'burst',
      duration: 2000,
      delay: 0
    }
  ],

  // Apply cinematic animation to an element
  applyAnimation: (element, animationType, duration, delay) => {
    if (!element) return;

    // Add delay if specified
    setTimeout(() => {
      switch (animationType) {
        case 'fadeIn':
          element.style.opacity = '0';
          element.style.transition = `opacity ${duration}ms ease-in-out`;
          setTimeout(() => element.style.opacity = '1', 50);
          break;
          
        case 'slideInFromRight':
          element.style.transform = 'translateX(100%)';
          element.style.transition = `transform ${duration}ms ease-out`;
          setTimeout(() => element.style.transform = 'translateX(0)', 50);
          break;
          
        case 'popIn':
          element.style.transform = 'scale(0)';
          element.style.transition = `transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
          setTimeout(() => element.style.transform = 'scale(1)', 50);
          break;
          
        case 'fadeInUp':
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, 50);
          break;
          
        case 'burst':
          // This would trigger confetti or similar effect
          if (window.confetti) {
            window.confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          break;
          
        default:
          break;
      }
    }, delay);
  },

  // Start the cinematic flow
  startFlow: () => {
    console.log('Starting cinematic demo flow...');
    
    // Apply animations in sequence
    cinematicFlow.sequence.forEach((step) => {
      const element = document.querySelector(step.element);
      if (element) {
        cinematicFlow.applyAnimation(
          element,
          step.animation,
          step.duration,
          step.delay
        );
      }
    });
  },

  // Reset all animations
  reset: () => {
    const elements = document.querySelectorAll('.landing-page, .dashboard, .ai-assistant, .goal-tracker');
    elements.forEach(element => {
      element.style.opacity = '';
      element.style.transform = '';
      element.style.transition = '';
    });
  }
};

// Export individual animation functions
export const fadeIn = (element, duration = 1000) => {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  setTimeout(() => element.style.opacity = '1', 50);
};

export const slideInFromRight = (element, duration = 800) => {
  if (!element) return;
  
  element.style.transform = 'translateX(100%)';
  element.style.transition = `transform ${duration}ms ease-out`;
  setTimeout(() => element.style.transform = 'translateX(0)', 50);
};

export const popIn = (element, duration = 600) => {
  if (!element) return;
  
  element.style.transform = 'scale(0)';
  element.style.transition = `transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
  setTimeout(() => element.style.transform = 'scale(1)', 50);
};

export const fadeInUp = (element, duration = 800) => {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 50);
};