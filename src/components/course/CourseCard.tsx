
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight, Star } from "lucide-react";

interface CourseCardProps {
  course: any;
  onEdit: (course: any) => void;
  onView: (course: any) => void;
  onDelete?: (courseId: string) => void;
  onToggleStatus?: (params: { courseId: string; newStatus: any }) => void;
  onViewRatings?: (course: any) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onView, onDelete, onToggleStatus, onViewRatings }) => {
  const handleStatusToggle = () => {
    if (onToggleStatus) {
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      onToggleStatus({ courseId: course.id, newStatus });
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this course?')) {
      onDelete(course.id);
    }
  };

  return (
  <Card className="bg-blue-700/30 border-blue-600">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-semibold text-lg">{course.title}</h3>
        <div className="flex items-center gap-2">
          <Badge className={`text-white capitalize ${
            course.status === 'published' ? 'bg-green-600' : 
            course.status === 'draft' ? 'bg-yellow-600' : 'bg-gray-600'
          }`}>
            {course.status}
          </Badge>
          {onToggleStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStatusToggle}
              className="text-blue-200 hover:text-white p-1"
            >
              {course.status === 'published' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
      <p className="text-blue-300 text-sm mb-4">{course.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-blue-400">Start Date:</span>
          <p className="text-white">{course.start_date ? new Date(course.start_date).toLocaleDateString() : "-"}</p>
        </div>
        <div>
          <span className="text-blue-400">Duration (weeks):</span>
          <p className="text-white">{course.duration_weeks ?? "-"}</p>
        </div>
        <div>
          <span className="text-blue-400">Price:</span>
          <p className="text-white">{course.price ? `KES ${course.price}` : "-"}</p>
        </div>
        <div>
          <span className="text-blue-400">Mode:</span>
          <p className="text-white">{course.mode_of_learning ?? "-"}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-blue-600 text-blue-200 hover:bg-blue-700 flex items-center"
          onClick={() => onEdit(course)}
        >
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-600 text-blue-200 hover:bg-blue-700 flex items-center"
          onClick={() => onView(course)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        {onViewRatings && (
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-600 text-yellow-200 hover:bg-yellow-700 flex items-center"
            onClick={() => onViewRatings(course)}
          >
            <Star className="h-4 w-4 mr-1" /> Ratings
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            className="border-red-600 text-red-200 hover:bg-red-700 flex items-center"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
  );
};

export default CourseCard;
