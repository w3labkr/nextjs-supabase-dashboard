# EXAMPLES

## Table of Contents

- [EXAMPLES](#examples)
  - [Table of Contents](#table-of-contents)
  - [Redux Store](#redux-store)
  - [Data Fetching With JSON](#data-fetching-with-json)
  - [Data Fetching With FormData](#data-fetching-with-formdata)
  - [Error Handling](#error-handling)
  - [Regular Expression](#regular-expression)

## Redux Store

Register your provider in `context/app-provider.tsx`.

```javascript
import { Provider } from '@/context/provider'

const providers = [Provider]
```

Register your redux store in `store/root-reducer.ts`.

```javascript
import reducer from './features/slice'

const rootReducer = combineReducers({
  name: reducer,
})
```

## Data Fetching With JSON

Client side

```javascript
import { fetcher } from '@/lib/utils'

const onSubmit = async (formValues: FormValues) => {
  const { data, error } = await fetcher<FetchData>('https://...', {
    method: 'POST',
    body: JSON.stringify(formValues),
  })
}
```

Server side: `route.ts`

```javascript
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ body })
}
```

## Data Fetching With FormData

Client side

```javascript
import { fetcher } from '@/lib/utils'

const onSubmit = async (formValues: FormValues) => {
  const formData = new FormData()
  formData.append('email', formValues?.email)
  const { data, error } = await fetcher<FetchData>('https://...', {
    method: 'POST',
    body: formData,
  })
}
```

Server side: `route.ts`

```javascript
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  return NextResponse.json({ email })
}
```

## Error Handling

```javascript
import { Button } from '@/components/ui/button'

export function Component() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  
  const onSubmit = async (formValues: FormValues) => {
    setIsSubmitting(true)
    try {
      const { data, error } = await fetch('https://...').then((res) => res.json())
      if (error) throw new Error(error?.message)
      // ...
    } catch (e: unknown) {
      console.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return <Button disabled={isSubmitting}>Submit</Button>
}
```

## Regular Expression

CJK (Chinese - Japanese - Korean)

```javascript
/[一-龥ぁ-ゔァ-ヴー々〆〤ㄱ-ㅎㅏ-ㅣ가-힇]+/g
```

cn (Chinese)

```javascript
/[一-龥]+/g
```

jp (Japanese)

```javascript
/[ぁ-ゔァ-ヴー々〆〤]+/g
```

ko (Korean)

```javascript
/[ㄱ-ㅎㅏ-ㅣ가-힇]+/g
```
