const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updatePosts() {
  const postsRef = db.collection("posts");
  const snapshot = await postsRef.get();

  snapshot.forEach(async (doc) => {
    const data = doc.data();
    if (data.published === undefined || data.published === false) {
      await doc.ref.update({ published: true });
      console.log(`Updated post: ${doc.id}`);
    }
  });

  console.log("All posts updated.");
}

updatePosts();
