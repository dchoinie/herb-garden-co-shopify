import { ContentfulExample } from '@/components/contentful-example';

export default function ContentfulTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Contentful Integration Test</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <p className="text-sm text-gray-600">
          This page tests the Contentful integration. If you see content below, 
          the connection is working. If you see an error, check your environment variables.
        </p>
      </div>

      <ContentfulExample />
    </div>
  );
}
