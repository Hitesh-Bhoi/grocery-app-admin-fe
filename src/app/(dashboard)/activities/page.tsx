import { ActivitiesClient } from "@/components/activities/ActivitiesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity History | Grocery Admin",
  description: "Complete activity history and audit logs for the system.",
};

export default function ActivitiesPage() {
  return (
    <>
      <ActivitiesClient />
    </>
  );
}
