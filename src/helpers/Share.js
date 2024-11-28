import { toast } from "react-hot-toast"; 

export const handleCopyText = (url) => {
  navigator.clipboard
    .writeText(url)
    .then(() => toast.success("Link Copied Successfully"))
    .catch((err) => console.error("Failed to copy: ", err));
};

export const handleShareWhatsApp = (url) => {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
  window.open(whatsappUrl, "_blank");
};

export const handleShareLinkedIn = (url) => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedinUrl, "_blank");
};
