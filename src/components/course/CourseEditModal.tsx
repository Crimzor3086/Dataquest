
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  course: any;
  instructors?: any[];
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  course,
  instructors = [],
}) => {
  const [form, setForm] = useState<any>(course || {});

  useEffect(() => {
    setForm(course || {});
  }, [course]);

  const handleInput = (k: string, v: any) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-blue-900 border-blue-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input className="bg-blue-800 border-blue-600 text-white" id="title" value={form.title || ""} onChange={e => handleInput("title", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea className="bg-blue-800 border-blue-600 text-white" id="description" value={form.description || ""} onChange={e => handleInput("description", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea className="bg-blue-800 border-blue-600 text-white" id="content" value={form.content || ""} onChange={e => handleInput("content", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (KES)</Label>
              <Input type="number" className="bg-blue-800 border-blue-600 text-white" id="price" value={form.price || ""} onChange={e => handleInput("price", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="duration_weeks">Duration (Weeks)</Label>
              <Input type="number" className="bg-blue-800 border-blue-600 text-white" id="duration_weeks" value={form.duration_weeks || ""} onChange={e => handleInput("duration_weeks", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="mode_of_learning">Mode of Learning</Label>
            <Select onValueChange={val => handleInput("mode_of_learning", val)} value={form.mode_of_learning}>
              <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in_person">In-person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="live">Live Session</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input type="date" className="bg-blue-800 border-blue-600 text-white" id="start_date" value={form.start_date || ""} onChange={e => handleInput("start_date", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Course Status</Label>
              <Select onValueChange={val => handleInput("status", val)} value={form.status || "draft"}>
                <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="instructor_id">Assign Instructor</Label>
              <Select onValueChange={val => handleInput("instructor_id", val === 'none' ? null : val)} value={form.instructor_id || "none"}>
                <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 z-50">
                  <SelectItem value="none">No instructor</SelectItem>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.first_name} {instructor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" className="flex-1 border-blue-600 text-white hover:bg-blue-700" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>{loading ? "Saving..." : "Update"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditModal;
