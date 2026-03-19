import { useState, useEffect } from 'react';

interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAPIOptions {
  immediate?: boolean;
}

export function useAPI<T>(
  apiCall: () => Promise<any>,
  options: UseAPIOptions = { immediate: true }
) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data || response,
        loading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error.error || error.message || 'Une erreur est survenue',
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook spécialisé pour les listes avec pagination
export function useAPIList<T>(
  apiCall: (params?: any) => Promise<any>,
  initialParams: any = {}
) {
  const [params, setParams] = useState(initialParams);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const { data, loading, error, execute } = useAPI<{
    data: T[];
    pagination: any;
  }>(() => apiCall(params), { immediate: false });

  useEffect(() => {
    execute();
  }, [params]);

  useEffect(() => {
    if (data) {
      if (params.page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prev => [...prev, ...data.data]);
      }
      setPagination(data.pagination);
    }
  }, [data]);

  const loadMore = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const refresh = () => {
    setParams(prev => ({ ...prev, page: 1 }));
    setAllData([]);
  };

  const updateParams = (newParams: any) => {
    setParams({ ...initialParams, ...newParams, page: 1 });
    setAllData([]);
  };

  return {
    data: allData,
    loading,
    error,
    pagination,
    params,
    loadMore,
    refresh,
    updateParams,
    hasMore: pagination ? pagination.currentPage < pagination.totalPages : false,
  };
}

// Hook pour les mutations (POST, PUT, DELETE)
export function useMutation<T>(
  mutationFn: (data?: any) => Promise<any>
) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (data?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await mutationFn(data);
      setState({
        data: response.data || response,
        loading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error.error || error.message || 'Une erreur est survenue',
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    mutate,
    reset,
  };
}