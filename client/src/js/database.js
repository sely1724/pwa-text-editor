import { openDB } from "idb";

const initdb = async () =>
  // Create new database called jate.  We are on version 1 of jate.
  openDB("jate", 1, {
    // Adding db schema if not already initialized
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      // New object store for the data gets a key name of "id" which then is incremented automatically.
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// A method called put DB accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log("Update the database");

  // Create a connection to the database database and version we want to use.
  const jateDb = await openDB("jate", 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = jateDb.transaction("jate", "readwrite");

  // Open up the desired object store.
  const store = tx.objectStore("jate");

  // Use the .put() method on the store and pass in the content.
  const request = store.put({ id: 1, value: content });

  // Get confirmation of the request.
  const result = await request;
  console.log("🚀 - data saved to the database", result);
};
//console.error("putDb not implemented"); ?? Where to place error message

// get DB is a method that gets all the content from the database
export const getDb = async () => {
  console.log("GET from the database");

  // Create a connection to the database database and version we want to use.
  const jateDb = await openDB("jate", 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = jateDb.transaction("jate", "readonly");

  // Open up the desired object store.
  const store = tx.objectStore("jate");

  // Use the .getAll() method to get all data in the database.
  // do we want to version it??
  const request = store.get(1);

  // Get confirmation of the request.
  const result = await request;
  console.log("result.value", result);
  return result ? result.value : error;
};

initdb();
