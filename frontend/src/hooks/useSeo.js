import { useEffect } from 'react';
import api from '../api/axios';

export default function useSeo(page, fallbackTitle = 'We Exports') {
  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await api.get(`/seo/${page}`);
        if (res.data) {
          document.title = res.data.title || fallbackTitle;

          let desc = document.querySelector('meta[name="description"]');
          if (!desc) {
            desc = document.createElement('meta');
            desc.setAttribute('name', 'description');
            document.head.appendChild(desc);
          }
          desc.setAttribute('content', res.data.description || '');

          let kw = document.querySelector('meta[name="keywords"]');
          if (!kw) {
            kw = document.createElement('meta');
            kw.setAttribute('name', 'keywords');
            document.head.appendChild(kw);
          }
          kw.setAttribute('content', res.data.keywords || '');
        }
      } catch {
        document.title = fallbackTitle;
      }
    };
    fetchSeo();
  }, [page]);
}