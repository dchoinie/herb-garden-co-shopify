import { useState, useEffect } from 'react';
import { ContentfulEntry } from '@/lib/contentful';
import { getEntriesByType, getEntryById, getEntryBySlug } from '@/lib/contentful-utils';

// Hook for fetching entries by content type
export function useContentfulEntries<T = any>(
  contentType: string,
  options: {
    preview?: boolean;
    limit?: number;
    skip?: number;
    order?: string;
    select?: string[];
    where?: Record<string, any>;
  } = {}
) {
  const [data, setData] = useState<ContentfulEntry<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const entries = await getEntriesByType<T>(contentType, options);
        
        if (isMounted) {
          setData(entries);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [contentType, JSON.stringify(options)]);

  return { data, loading, error };
}

// Hook for fetching a single entry by ID
export function useContentfulEntry<T = any>(
  entryId: string,
  options: { preview?: boolean } = {}
) {
  const [data, setData] = useState<ContentfulEntry<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const entry = await getEntryById<T>(entryId, options);
        
        if (isMounted) {
          setData(entry);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (entryId) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [entryId, options.preview]);

  return { data, loading, error };
}

// Hook for fetching an entry by slug
export function useContentfulEntryBySlug<T = any>(
  contentType: string,
  slug: string,
  options: { preview?: boolean } = {}
) {
  const [data, setData] = useState<ContentfulEntry<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const entry = await getEntryBySlug<T>(contentType, slug, options);
        
        if (isMounted) {
          setData(entry);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (contentType && slug) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [contentType, slug, options.preview]);

  return { data, loading, error };
}
