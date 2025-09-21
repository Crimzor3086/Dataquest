
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Clock, DollarSign } from "lucide-react";

interface CourseStatsGridProps {
  courses: any[];
  students: any[];
}

const statsConfig = [
  { title: "Total Courses", icon: BookOpen, color: "text-blue-400" },
  { title: "Active Students", icon: Users, color: "text-green-400" },
  { title: "Avg. Duration", icon: Clock, color: "text-purple-400" },
  { title: "Total Revenue", icon: DollarSign, color: "text-orange-400" },
];

const CourseStatsGrid: React.FC<CourseStatsGridProps> = ({ courses, students }) => {
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const avgDuration =
    totalCourses > 0
      ? (
          courses.reduce(
            (sum, c) => sum + (typeof c.duration_weeks === "number" ? c.duration_weeks : 0),
            0
          ) / totalCourses
        ).toFixed(1)
      : "0";
  const totalRevenue = "KES 0";

  const stats = [
    { ...statsConfig[0], value: totalCourses },
    { ...statsConfig[1], value: totalStudents },
    { ...statsConfig[2], value: `${avgDuration} weeks` },
    { ...statsConfig[3], value: totalRevenue },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-blue-800/50 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CourseStatsGrid;

