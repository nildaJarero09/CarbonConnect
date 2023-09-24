// Firebase configuration  
var firebaseConfig = {
    apiKey: "AIzaSyBCxQrqopNLvh8f6PNKB-uXZS5Sf_RaT2g",
    authDomain: "carbonconnect2023.firebaseapp.com",
    projectId: "carbonconnect2023",
    storageBucket: "carbonconnect2023.appspot.com",
    messagingSenderId: "1041152472743",
    appId: "1:1041152472743:web:4297ad684e743d132f4d82",
};

// Initialize Firebase
if (!firebase.apps.length) { // Check if Firebase is already initialized
    firebase.initializeApp(firebaseConfig);
}

var database = firebase.database();

let itemsPerPage = 10;
let lastKey = null;

function fetchPublicPendingPosts() {
    let ref = database.ref('posts').orderByChild('status').equalTo('public_pending').limitToLast(itemsPerPage);

    ref.once('value').then(snapshot => {
        const data = snapshot.val();
        console.log("Fetched Data:", data);
        if (!data) {return};

        const posts = Object.keys(data).map(key => {
            return { ...data[key], id: key };
        });

        // Render these posts
        renderPublicPendingPosts(posts);
    });
}

function renderPublicPendingPosts(posts) {
    const feedDisplay = document.getElementById('feedDisplay');
    feedDisplay.innerHTML = ''; // clear previous posts

    posts.forEach(post => {
        const postElem = document.createElement('div');
        postElem.classList.add('post');
        postElem.innerHTML = post.content;

        const approveButton = document.createElement('button');
        approveButton.innerText = 'Approve';
        approveButton.classList.add('approve-btn');
        approveButton.addEventListener('click', () => {
            approvePost(post.id);
            
            // Remove this post element from the DOM
            postElem.remove();
        });
        

        postElem.appendChild(approveButton);
        feedDisplay.appendChild(postElem);
    });
}

function approvePost(postId) {
    database.ref('/posts/' + postId).update({ status: 'public_approved' }).then(() => {
        // After approving, refetch the posts so that the approved post doesn't show up again
        fetchPublicPendingPosts();
    });
}


document.addEventListener('DOMContentLoaded', (event) => {
    fetchPublicPendingPosts();
});
