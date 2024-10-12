/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as CollectionIndexImport } from './routes/collection/index'
import { Route as AboutIndexImport } from './routes/about/index'
import { Route as EventEventNameImport } from './routes/event/$eventName'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CollectionIndexRoute = CollectionIndexImport.update({
  path: '/collection/',
  getParentRoute: () => rootRoute,
} as any)

const AboutIndexRoute = AboutIndexImport.update({
  path: '/about/',
  getParentRoute: () => rootRoute,
} as any)

const EventEventNameRoute = EventEventNameImport.update({
  path: '/event/$eventName',
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
    '/event/$eventName': {
      id: '/event/$eventName'
      path: '/event/$eventName'
      fullPath: '/event/$eventName'
      preLoaderRoute: typeof EventEventNameImport
      parentRoute: typeof rootRoute
    }
    '/about/': {
      id: '/about/'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutIndexImport
      parentRoute: typeof rootRoute
    }
    '/collection/': {
      id: '/collection/'
      path: '/collection'
      fullPath: '/collection'
      preLoaderRoute: typeof CollectionIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/event/$eventName': typeof EventEventNameRoute
  '/about': typeof AboutIndexRoute
  '/collection': typeof CollectionIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/event/$eventName': typeof EventEventNameRoute
  '/about': typeof AboutIndexRoute
  '/collection': typeof CollectionIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/event/$eventName': typeof EventEventNameRoute
  '/about/': typeof AboutIndexRoute
  '/collection/': typeof CollectionIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/event/$eventName' | '/about' | '/collection'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/event/$eventName' | '/about' | '/collection'
  id: '__root__' | '/' | '/event/$eventName' | '/about/' | '/collection/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  EventEventNameRoute: typeof EventEventNameRoute
  AboutIndexRoute: typeof AboutIndexRoute
  CollectionIndexRoute: typeof CollectionIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  EventEventNameRoute: EventEventNameRoute,
  AboutIndexRoute: AboutIndexRoute,
  CollectionIndexRoute: CollectionIndexRoute,
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
        "/event/$eventName",
        "/about/",
        "/collection/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/event/$eventName": {
      "filePath": "event/$eventName.tsx"
    },
    "/about/": {
      "filePath": "about/index.tsx"
    },
    "/collection/": {
      "filePath": "collection/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
