import { Button } from "./ui/button";

export default function UploadPageFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-8">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-sm text-gray-600 max-w-md">
          This product is enhanced by AI and may provide incorrect or problematic content. Do not enter personal data.
        </div>
        <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
          Generate
        </Button>
      </div>
    </footer>
  );
}