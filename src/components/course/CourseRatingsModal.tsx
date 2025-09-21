import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourseRating from '@/components/CourseRating';

interface CourseRatingsModalProps {
  course: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourseRatingsModal: React.FC<CourseRatingsModalProps> = ({ course, open, onOpenChange }) => {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Course Ratings: {course.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CourseRating 
            courseId={course.id} 
            showAddRating={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseRatingsModal;