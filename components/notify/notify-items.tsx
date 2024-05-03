import * as React from 'react'

interface NotifyItemProps {
  id: number
  title: string
  description: string
}

const NotifyItems = ({ items }: { items: NotifyItemProps[] }) => {
  return items.map((item) => (
    <div key={item.id} className="grid grid-cols-[25px_1fr] items-start">
      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  ))
}

export { NotifyItems, type NotifyItemProps }
