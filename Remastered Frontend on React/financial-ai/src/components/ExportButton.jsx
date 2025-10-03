import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import '../styles/ExportButton.css';

const ExportButton = ({ onExport, onShare, type = 'chart' }) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export functionality
      console.log(`Exporting ${type}...`);
      // In a real app, this would trigger the actual export
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      console.log(`Sharing ${type}...`);
      // In a real app, this would trigger the actual share
    }
  };

  return (
    <div className="export-buttons">
      <motion.button
        className="export-button"
        onClick={handleExport}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Export ${type}`}
      >
        <Download size={16} />
        <span>Export</span>
      </motion.button>
      
      <motion.button
        className="share-button"
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Share ${type}`}
      >
        <Share2 size={16} />
        <span>Share</span>
      </motion.button>
    </div>
  );
};

export default ExportButton;