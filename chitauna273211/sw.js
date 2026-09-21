/* =========================================
   VIDHWAAN VILLAGE UNIVERSE
   SERVICE WORKER TEMPLATE
========================================= */

/*
CI/CD VARIABLES

Chitauna
chitauna273211

Example

Chitauna   = Utukur
chitauna273211 = utukur524407
*/


const CACHE_NAME =
  "chitauna273211-v1";

/* =========================================
   INSTALL
========================================= */

self.addEventListener(
  "install",
  () => {

    self.skipWaiting();

  }
);

/* =========================================
   ACTIVATE
========================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      Promise.all([

        caches.keys()
          .then(keys =>
            Promise.all(

              keys.map(key => {

                if (
                  key !== CACHE_NAME
                ) {

                  return caches.delete(
                    key
                  );

                }

              })

            )
          ),

        self.clients.claim()

      ])

    );

  }
);

/* =========================================
   NETWORK FIRST
========================================= */

self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !==
      "GET"
    ) {
      return;
    }

    event.respondWith(

      fetch(
        event.request
      )

      .then(response => {

        const responseClone =
          response.clone();

        caches
          .open(CACHE_NAME)
          .then(cache => {

            cache.put(
              event.request,
              responseClone
            );

          });

        return response;

      })

      .catch(() => {

        return caches.match(
          event.request
        );

      })

    );

  }
);

/* =========================================
   SKIP WAITING
========================================= */

self.addEventListener(
  "message",
  event => {

    if (

      event.data &&
      event.data.type ===
      "SKIP_WAITING"

    ) {

      self.skipWaiting();

    }

  }
);

/* =========================================
   PUSH
========================================= */

self.addEventListener(
  "push",
  event => {

    if (!event.data) {
      return;
    }

    const data =
      event.data.json();

    self.registration.showNotification(

      data.title || "Chitauna",

      {
        body:
          data.body || "",

        icon:
          "/icons/icon-192.png",

        badge:
          "/icons/icon-192.png",

        data:
          data.url || "/chitauna273211/"
      }

    );

  }
);

/* =========================================
   NOTIFICATION CLICK
========================================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    event.waitUntil(

      clients.openWindow(

        event.notification.data ||

        "/chitauna273211/"

      )

    );

  }
);

console.log(
  "Chitauna Service Worker Loaded"
);