import SessionDebug from "@/app/components/debug/SessionDebug";

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Tools</h1>
      <SessionDebug />
    </div>
  );
}
