import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/thyma/portal-shell";

export const Route = createFileRoute("/app")({
  component: PortalShell,
});
