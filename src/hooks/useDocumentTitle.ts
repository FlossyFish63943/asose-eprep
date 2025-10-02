import { useEffect } from 'react';
const DEFAULT_TITLE = 'ASOSE ePrep';
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
    // Optional: Reset title on component unmount
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}