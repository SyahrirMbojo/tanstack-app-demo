import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/notification")({
  component: NotificationPage,
});

function NotificationPage() {
  return <div>Hello "/settings/notification"!</div>;
}
