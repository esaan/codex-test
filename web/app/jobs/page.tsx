import JobsManager from "@/components/jobs/JobsManager";

export const metadata = {
  title: "Sitecore XM Cloud Jobs",
  description: "Browse and filter Sitecore XM Cloud job listings.",
};

export default function JobsPage() {
  return <JobsManager />;
}
