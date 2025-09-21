import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';

export const useResourceDownload = () => {
  const { trackEvent } = useAnalytics();

  const handleDownload = (resource: any) => {
    try {
      if (!resource?.downloadUrl) {
        toast.error('Download unavailable for this resource.');
        return;
        }
      trackEvent('resource_download', {
        resource_id: resource.id,
        title: resource.title,
        type: resource.type
      });
      window.open(resource.downloadUrl, '_blank');
      toast.success(`Downloading ${resource.title}...`);
    } catch (e) {
      toast.error('Failed to start download.');
    }
  };

  return { handleDownload };
};
