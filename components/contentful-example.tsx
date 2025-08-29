'use client';

import { useContentfulEntries } from '@/hooks/use-contentful';
import { getAssetUrl } from '@/lib/contentful';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Example content type interface
interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content?: any;
  featuredImage?: any;
  author?: string;
  publishDate?: string;
}

export function ContentfulExample() {
  const { data: posts, loading, error } = useContentfulEntries<BlogPost>('blogPost', {
    limit: 6,
    order: '-sys.createdAt',
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading content: {error.message}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No content found. Make sure you have content in your Contentful space.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Content from Contentful</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.sys.id} className="overflow-hidden">
            {post.fields.featuredImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={getAssetUrl(post.fields.featuredImage)}
                  alt={post.fields.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.fields.title}</CardTitle>
              {post.fields.excerpt && (
                <CardDescription className="line-clamp-3">
                  {post.fields.excerpt}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-500">
                {post.fields.author && <span>By {post.fields.author}</span>}
                {post.fields.publishDate && (
                  <span>{new Date(post.fields.publishDate).toLocaleDateString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Example of how to use the hook for a single entry
export function SingleContentfulExample({ entryId }: { entryId: string }) {
  const { data: post, loading, error } = useContentfulEntry<BlogPost>(entryId);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    return <p className="text-red-600">Error: {error.message}</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <article className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.fields.title}</h1>
      {post.fields.featuredImage && (
        <img
          src={getAssetUrl(post.fields.featuredImage)}
          alt={post.fields.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      {post.fields.excerpt && (
        <p className="text-lg text-gray-600 mb-6">{post.fields.excerpt}</p>
      )}
      <div className="prose max-w-none">
        {/* Render rich text content here */}
        <p>Content would be rendered here...</p>
      </div>
    </article>
  );
}
