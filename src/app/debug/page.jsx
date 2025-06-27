import SessionDebug from "@/app/components/debug/SessionDebug";
import CloudinaryTest from "@/components/debug/CloudinaryTest";

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SessionDebug />
        <CloudinaryTest />
      </div>
    </div>
  );
}
