
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+254707612395";
    const message = "Hello! I'm interested in DataQuest Solutions services.";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center w-10 h-10"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
    </button>
  );
};

export default WhatsAppButton;
