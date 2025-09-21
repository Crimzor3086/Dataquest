
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ open, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    content: "",
    price: "",
    duration_weeks: "",
    mode_of_learning: "",
    start_date: "",
  });

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
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input className="bg-blue-800 border-blue-600 text-white" id="title" value={form.title} onChange={e => handleInput("title", e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea className="bg-blue-800 border-blue-600 text-white" id="description" value={form.description} onChange={e => handleInput("description", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea className="bg-blue-800 border-blue-600 text-white" id="content" value={form.content} onChange={e => handleInput("content", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (KES)</Label>
              <Input type="number" className="bg-blue-800 border-blue-600 text-white" id="price" value={form.price} onChange={e => handleInput("price", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="duration_weeks">Duration (Weeks)</Label>
              <Input type="number" className="bg-blue-800 border-blue-600 text-white" id="duration_weeks" value={form.duration_weeks} onChange={e => handleInput("duration_weeks", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="mode_of_learning">Mode of Learning</Label>
            <Select onValueChange={val => handleInput("mode_of_learning", val)}>
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
            <Input type="date" className="bg-blue-800 border-blue-600 text-white" id="start_date" value={form.start_date} onChange={e => handleInput("start_date", e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" className="flex-1 border-blue-600 text-white hover:bg-blue-700" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>{loading ? "Saving..." : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormModal;
