
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EnrollmentTableProps {
  enrollments: any[];
  courses: Record<string, any>;
  students: Record<string, any>;
}

const EnrollmentTable: React.FC<EnrollmentTableProps> = ({ enrollments, courses, students }) => {
  if (!enrollments?.length) return <div className="text-blue-200 text-center">No enrollments found.</div>;

  return (
    <Card className="bg-blue-700/30 border-blue-600">
      <CardContent className="p-6">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-blue-800">
              <th className="py-2 px-2">Student</th>
              <th className="py-2 px-2">Course</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Enrolled At</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enroll) => (
              <tr key={enroll.id} className="border-b border-blue-600">
                <td className="py-2 px-2">{students[enroll.student_id]?.first_name ?? "Unknown"} {students[enroll.student_id]?.last_name ?? ""}</td>
                <td className="py-2 px-2">{courses[enroll.course_id]?.title ?? "Unknown"}</td>
                <td className="py-2 px-2">
                  <Badge className="bg-green-700 text-white">{enroll.status}</Badge>
                </td>
                <td className="py-2 px-2">{new Date(enroll.enrolled_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default EnrollmentTable;
