
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
interface InstructorTableProps {
  instructors: any[];
}
const InstructorTable: React.FC<InstructorTableProps> = ({ instructors }) => {
  if (!instructors?.length) return <div className="text-blue-200 text-center">No instructors found.</div>;
  return (
    <Card className="bg-blue-700/30 border-blue-600">
      <CardContent className="p-6">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-blue-800">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst) => (
              <tr key={inst.id} className="border-b border-blue-600">
                <td className="py-2 px-2">{inst.first_name ?? "Unknown"} {inst.last_name ?? ""}</td>
                <td className="py-2 px-2">{inst.email ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
export default InstructorTable;
