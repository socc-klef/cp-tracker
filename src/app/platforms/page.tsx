import PlatformList from "@/components/platforms/platform-list";

export default function PlatformsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Platforms</h1>
      <PlatformList />
    </div>
  );
}
