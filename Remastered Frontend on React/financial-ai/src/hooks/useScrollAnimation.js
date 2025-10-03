import { useState, useEffect } from 'react';

const useScrollAnimation = (threshold = 0.1) => {
  const [animatedElements, setAnimatedElements] = useState(new Set());

  useEffect(() => {
    // Add a small delay to make animations smoother
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a small delay to create a staggered effect
          const delay = entry.target.dataset.scrollDelay || 0;
          setTimeout(() => {
            setAnimatedElements(prev => new Set([...prev, entry.target.dataset.scrollId]));
          }, delay);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, { 
      threshold,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });

    // Observe all elements with data-scroll-id attribute
    const elements = document.querySelectorAll('[data-scroll-id]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return animatedElements;
};

export default useScrollAnimation;