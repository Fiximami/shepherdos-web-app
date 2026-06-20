"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminModal } from "@/components/admin/shared/admin-modal";
import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api/errors";
import { createMember, updateMember } from "@/lib/api/members";
import type { MemberRow } from "@/lib/api/mappers";

const memberStatuses: MemberRow["status"][] = [
  "Active",
  "First-Timer",
  "New Convert",
  "Worker",
  "Inactive",
  "Follow-up Needed",
];

type ToastState = { message: string; variant: "success" | "error" } | null;

type CreateMemberDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateMemberDialog({ open, onClose, onSuccess }: CreateMemberDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("Main Campus");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setPhone("");
    setEmail("");
    setBranch("Main Campus");
    setToast(null);
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setToast({ message: "Full name is required.", variant: "error" });
      return;
    }

    setIsSubmitting(true);
    setToast(null);
    try {
      await createMember({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        branch: branch.trim() || undefined,
      });
      setToast({ message: "Member created successfully.", variant: "success" });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title="Add member"
      description="Create a new member record in your church directory."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {toast ? (
          <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="create-member-name">Full name</Label>
          <Input id="create-member-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="create-member-phone">Phone</Label>
            <Input id="create-member-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-member-email">Email</Label>
            <Input id="create-member-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="create-member-branch">Branch</Label>
          <Input id="create-member-branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Create member"
            )}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

type EditMemberDialogProps = {
  open: boolean;
  member: MemberRow | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditMemberDialog({ open, member, onClose, onSuccess }: EditMemberDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState<MemberRow["status"]>("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open || !member) return;
    setName(member.name);
    setPhone(member.phone === "—" ? "" : member.phone);
    setBranch(member.branch === "—" ? "" : member.branch);
    setStatus(member.status);
    setToast(null);
  }, [member, open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!member) return;

    setIsSubmitting(true);
    setToast(null);
    try {
      await updateMember(member.id, {
        name: name.trim(),
        phone: phone.trim() || undefined,
        branch: branch.trim() || undefined,
        status,
      });
      setToast({ message: "Member updated successfully.", variant: "success" });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title="Edit member"
      description={member ? `Update basic details for ${member.name}.` : undefined}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {toast ? (
          <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="edit-member-name">Full name</Label>
          <Input id="edit-member-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-member-phone">Phone</Label>
          <Input id="edit-member-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-member-branch">Branch</Label>
          <Input id="edit-member-branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-member-status">Status</Label>
          <select
            id="edit-member-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as MemberRow["status"])}
            className="h-10 w-full rounded-lg border border-white/10 bg-[#11263b] px-3 text-sm text-white outline-none"
          >
            {memberStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !member}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}
