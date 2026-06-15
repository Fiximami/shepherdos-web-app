type MemberLinkedNoticeProps = {
  message?: string;
};

export function MemberLinkedNotice({
  message = "Your member profile has not been linked yet.",
}: MemberLinkedNoticeProps) {
  return (
    <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
      {message}
    </p>
  );
}
