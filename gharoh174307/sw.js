/* =========================================
   VIDHWAAN VILLAGE UNIVERSE
   SERVICE WORKER TEMPLATE
========================================= */

/*
CI/CD VARIABLES

Gharoh
gharoh174307

Example

Gharoh   = Utukur
gharoh174307 = utukur524407
*/


const CACHE_NAME =
  "gharoh174307-v1";

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

      data.title || "Gharoh",

      {
        body:
          data.body || "",

        icon:
          "/icons/icon-192.png",

        badge:
          "/icons/icon-192.png",

        data:
          data.url || "/gharoh174307/"
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

        "/gharoh174307/"

      )

    );

  }
);

console.log(
  "Gharoh Service Worker Loaded"
);