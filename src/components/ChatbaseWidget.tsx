
import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase: any;
  }
}

const ChatbaseWidget = () => {
  useEffect(() => {
    // Initialize chatbase if available
    if (window.chatbase) {
      // Configure the chatbase widget with your secret key
      window.chatbase('init', {
        chatbotId: 'i1Pj_LMGHrrOxuDRnHu1S',
        domain: 'www.chatbase.co'
      });
    }
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChatbaseWidget;
