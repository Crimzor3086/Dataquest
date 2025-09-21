
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, X } from 'lucide-react';

interface ResourcePreviewDialogProps {
  resource: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (resource: any) => void;
}

const ResourcePreviewDialog = ({ resource, isOpen, onClose, onDownload }: ResourcePreviewDialogProps) => {
  const getTableauPreviewContent = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Lesson 1: Introduction to Tableau</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What is Tableau?</h4>
              <p className="text-sm text-gray-600">
                Tableau is a powerful, industry-leading data visualization and business intelligence (BI) tool that helps users explore, understand, and communicate data insights through interactive visualizations and dashboards.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Key Features of Tableau</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>User-Friendly Interface with drag-and-drop functionality</li>
                <li>Wide Range of Data Sources (Excel, CSV, databases, cloud services)</li>
                <li>Real-Time Data Analysis with live connections</li>
                <li>Built-in Data Preparation & Transformation Tools</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Power in Data Visualization</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Wide variety of visuals from basic to advanced charts</li>
                <li>Custom calculations and analytics capabilities</li>
                <li>Level of Detail (LOD) expressions for deeper analysis</li>
                <li>Interactive features with hover, filter, and drill-down</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Tableau interface and workspace overview</li>
            <li>Connecting to various data sources</li>
            <li>Creating basic and advanced visualizations</li>
            <li>Building interactive dashboards</li>
            <li>Using calculated fields and LOD expressions</li>
            <li>Publishing and sharing your work</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Complete Guide Includes:</strong> 3 comprehensive lessons covering everything from basic concepts to advanced dashboard creation, with practical examples and best practices for business applications.
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {resource?.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {resource?.id === 6 && getTableauPreviewContent()}
        </ScrollArea>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close Preview
          </Button>
          <Button
            onClick={() => {
              onDownload(resource);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourcePreviewDialog;
