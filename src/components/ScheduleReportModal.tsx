
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScheduleReportModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (email: string) => void;
}

const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({ open, onClose, onSchedule }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitting(true);
      setTimeout(() => {
        onSchedule(email);
        setEmail("");
        setSubmitting(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Analytics Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email" className="text-sm font-medium">Recipient Email</label>
          <Input 
            id="email"
            type="email"
            placeholder="Enter email address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Scheduling...
                </span>
              ) : (
                "Schedule"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleReportModal;

