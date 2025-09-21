
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EnrollmentTable from "./EnrollmentTable";
import InstructorTable from "./InstructorTable";
import CourseCard from "./CourseCard";
import CourseRatingsModal from "./CourseRatingsModal";
import CourseRatingsList from "./CourseRatingsList";

interface CourseTabsProps {
  courses: any[];
  students: any[];
  enrollments: any[];
  instructors: any[];
  searchTerm: string;
  onSearch: (v: string) => void;
  onNewCourse: () => void;
  onEditCourse: (course: any) => void;
  onViewCourse: (course: any) => void;
  onDeleteCourse?: (courseId: string) => void;
  onToggleStatus?: (params: { courseId: string; newStatus: any }) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  courses,
  students,
  enrollments,
  instructors,
  searchTerm,
  onSearch,
  onNewCourse,
  onEditCourse,
  onViewCourse,
  onDeleteCourse,
  onToggleStatus,
}) => {
  const [selectedCourseForRatings, setSelectedCourseForRatings] = useState<any>(null);
  const [ratingsModalOpen, setRatingsModalOpen] = useState(false);

  const handleViewRatings = (course: any) => {
    setSelectedCourseForRatings(course);
    setRatingsModalOpen(true);
  };
  // Util maps
  const courseMap = Object.fromEntries(courses.map((c: any) => [c.id, c]));
  const studentMap = Object.fromEntries(students.map((s: any) => [s.id, s]));

  const filteredCourses = searchTerm
    ? courses.filter((c: any) => c.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    : courses;

  return (
    <Tabs defaultValue="courses" className="space-y-8">
      <TabsList className="grid w-full grid-cols-4 bg-blue-800/50">
        <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600">All Courses</TabsTrigger>
        <TabsTrigger value="enrollments" className="data-[state=active]:bg-blue-600">Enrollments</TabsTrigger>
        <TabsTrigger value="instructors" className="data-[state=active]:bg-blue-600">Instructors</TabsTrigger>
        <TabsTrigger value="ratings" className="data-[state=active]:bg-blue-600">Course Ratings</TabsTrigger>
      </TabsList>

      <TabsContent value="courses">
        <Card className="bg-blue-800/50 border-blue-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Course Library</CardTitle>
                <CardDescription className="text-blue-200">Manage all available courses</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={onNewCourse}>
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 bg-blue-700 border-blue-600 text-white placeholder-blue-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={onEditCourse}
                  onView={onViewCourse}
                  onDelete={onDeleteCourse}
                  onToggleStatus={onToggleStatus}
                  onViewRatings={handleViewRatings}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="enrollments">
        <EnrollmentTable enrollments={enrollments} courses={courseMap} students={studentMap} />
      </TabsContent>

      <TabsContent value="instructors">
        <InstructorTable instructors={instructors} />
      </TabsContent>

      <TabsContent value="ratings">
        <CourseRatingsList courses={courses} onViewCourse={onViewCourse} />
      </TabsContent>
      
      <CourseRatingsModal
        course={selectedCourseForRatings}
        open={ratingsModalOpen}
        onOpenChange={setRatingsModalOpen}
      />
    </Tabs>
  );
};

export default CourseTabs;
