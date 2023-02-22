// service worker is listening to requests from our application. SW stands between our application and the server
// listening for requestsand finding ways to handle them before they go out.  Kind of like a proxy b/w our applic.
// SW DOES NOT have access to the DOM or to the memory storage of our application.
// so register route - we want to register A route that our service worker should be listening to.
import { registerRoute } from "workbox-routing";
// the first thing that register route needs is what routes do we want? It needs a function that it can run given the
// http request.  It's a function that can take that and determine if the request matches a certain set of requirements
// parameter 2 is how to handle it
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { offlineFallback, warmStrategyCache } from "workbox-recipes";

// placeholder that SW will use.  Webpack will take our code and resources by URL - webpack will put the list here below.
// at build time this gets replaced by actual list of stuff.
precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

// const matchCallback = ({ request }) => {
//   console.log(request);
//   // return a boolean
//   return (
//     // for more info can reference request object in th MDN documentation
//     // here we discern whether its a style type or a JS of some sort
//     // CSS
//     request.destination === "style" ||
//     // JS
//     request.destination === "script"
//   );
// };

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Set up asset cache
registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  //matchCallback,
  // so if the matchCallback matches JS or CSS then we need to tell it how to actually do the cacheing
  new StaleWhileRevalidate({
    // stale while revalidate - when you make a request for a style, it'll go check to see if there is a new version up of thestyle sheet.  It won't fetch it. It will give you the style that's in the cache that is stale, but in the background, it'll go get the new style and bring it down.
    // that way you have an immediate response.  It may be slightly off, but at least it's immediate
    // but we only want to cache if the response code is a 0 or 200, successful
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Also register routes for caching images.
// the cache first strategy is often the best choice for images
// because it saves bandwidth and improves performance
// registerRoute(
//   ({ request }) => request.destination === "image",
//   new CacheFirst({
//     cacheName: "my-image-cache",
//     // always going to look at a cache first.  if it's already there, keep it.
//     // if not, go out to the server
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         // put an expiration here.  Basically limits how big our cache can get.
//         maxEntries: 60,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
//       }),
//     ],
//   })
// );

registerRoute();
