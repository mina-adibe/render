import { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Private, Public, Shared } from '@/layouts'

type Routes = Array<{
  path: string
  component: () => JSX.Element
  layout: ({ children }: { children: JSX.Element }) => JSX.Element
}>

const layouts = { private: Private, public: Public, shared: Shared }

const files = import.meta.globEager(`../pages/**/*.tsx`)

const codes = { '/404': '*' }

const routes: Routes = Object.keys(files)
  .reverse()
  .map((file) => {
    const path = file
      .replace(/\.\.\/pages|index|\.tsx$/g, '')
      .replace(/\[/g, ':')
      .replace(/\]/g, '')

    return {
      path: path in codes ? codes[path as keyof typeof codes] : path,
      component: files[file].default as () => JSX.Element,
      layout: layouts[(files[file].meta?.layout as keyof typeof layouts) || 'shared'],
    }
  })

export default function Router(): JSX.Element {
  return (
    <Switch>
      {routes.map(({ path, component: Component = Fragment, layout: Layout = Fragment }) => (
        <Route key={path} path={path} exact={true}>
          <Layout>
            <Component />
          </Layout>
        </Route>
      ))}
    </Switch>
  )
}
