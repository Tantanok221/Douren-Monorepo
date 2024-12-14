/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ArtistIndexImport } from './routes/artist/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ArtistIndexRoute = ArtistIndexImport.update({
  id: '/artist/',
  path: '/artist/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/artist/': {
      id: '/artist/'
      path: '/artist'
      fullPath: '/artist'
      preLoaderRoute: typeof ArtistIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/artist': typeof ArtistIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/artist': typeof ArtistIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/artist/': typeof ArtistIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/artist'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/artist'
  id: '__root__' | '/' | '/artist/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ArtistIndexRoute: typeof ArtistIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ArtistIndexRoute: ArtistIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/artist/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/artist/": {
      "filePath": "artist/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */