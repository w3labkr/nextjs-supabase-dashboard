import useSWR from 'swr'

import { NotifyItemProps } from './notify-items'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface DataProps {
  results: NotifyItemProps[]
}

export function useNotify() {
  const { data, error, isLoading } = useSWR<DataProps>(
    `/api/v1/notify`,
    fetcher
  )

  return { data: data?.results, error, isLoading }
}
