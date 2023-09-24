// Get the modal, trigger button, and close button
var popup = document.getElementById("makePost");
var btn = document.getElementById("showPopupBtn");
var closeBtn = document.getElementById("closePopupBtn");

// When the user clicks the button, open the popup 
btn.onclick = function() {
    popup.style.display = "block";
}

// When the user clicks on the close button, close the popup
closeBtn.onclick = function() {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

// Override the default Quill behavior
var ImageBlot = Quill.import('formats/image');
ImageBlot.tagName = 'IMG';
Quill.register(ImageBlot, true);

var Font = Quill.import('formats/font');
Font.whitelist = ['montserrat', 'arial', 'times-new-roman', 'courier-new'];
Quill.register(Font, true);

// Initialize Quill editor with combined options
var quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Type here...',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'link', 'image', {'align': []}, {'list': 'ordered'}, {'list': 'bullet'}],
        ]
    }
});

quill.format('font', 'montserrat');

quill.on('text-change', function() {
    if (quill.getText().trim() === '') {
        setTimeout(function() {
            quill.format('font', 'montserrat');
        }, 0);
    }
});

quill.getModule('toolbar').addHandler('image', () => {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = () => {
            var range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', reader.result);

            // Wait for Quill to insert the image, then adjust its size
            setTimeout(() => {
                const imgElem = quill.container.querySelector("img[src='" + reader.result + "']");
                if (imgElem) {
                    imgElem.style.maxWidth = "100%";
                    imgElem.style.height = "auto";
                }
            }, 50);
        };

        reader.readAsDataURL(file);
    };
});

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
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

function closePopup() {
    popup.style.display = "none";
}

// HTML element to display the content
var feedDisplay = document.getElementById('feedDisplay');

// store post in database
document.getElementById('editorForm').addEventListener('submit', function(e) {
    var contentHtml = quill.root.innerHTML;
    console.log(contentHtml);  // logging the content being submitted

    var newPostKey = database.ref().child('posts').push().key;

    // Check the checkbox status
    var isPublic = document.getElementById('makePublicCheckbox').checked;
    var postStatus = isPublic ? 'public_pending' : 'internal';

    var postData = {
        content: contentHtml,
        status: postStatus
    };

    document.getElementById('makePublicCheckbox').checked = false;

    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    
    database.ref().update(updates).then(() => {
        // After storing the data, fetch all the posts and display them
        database.ref('/posts/').once('value').then(function(snapshot) {
            feedDisplay.innerHTML = "";  // clear the feed before populating
            snapshot.forEach(function(childSnapshot) {
                var postContent = childSnapshot.val().content;
                if (postContent) {
                    var postDiv = document.createElement("div");
                    postDiv.classList.add("post");
                    postDiv.innerHTML = postContent;
                    // Prepend the postDiv to the feedDisplay
                    if(feedDisplay.firstChild) {
                        feedDisplay.insertBefore(postDiv, feedDisplay.firstChild);
                    } else {
                        feedDisplay.appendChild(postDiv);
                    }
                }
            });
        });
    });
    
    quill.setContents([]);
    closePopup();
});

let lastKey = null; // to remember the key of the last fetched item
const itemsPerPage = 10;

// Retrieves posts from database
function fetchPosts() {
    let ref = database.ref('posts').orderByChild('status').limitToLast(itemsPerPage);
    if (lastKey) {
        ref = ref.endAt(lastKey);
    }

    ref.once('value').then(snapshot => {
        const data = snapshot.val();

        if (!data) return;

        // Transform data to array and exclude the last fetched item from previous fetch
        const posts = Object.keys(data).map(key => {
            return { ...data[key], id: key };
        });
        if (lastKey && posts.length > 0) {
            posts.pop();
        }

        // Remember the key of the last item for the next fetch
        if (posts.length > 0) {
            lastKey = posts[0].id;
            renderPosts(posts);
        }
    });
}

// Displays posts from database
function renderPosts(posts) {
    // Append posts to the feedDisplay div
    posts.forEach(post => {
        const postElem = document.createElement('div');
        postElem.classList.add('post');
        postElem.innerHTML = post.content;

        feedDisplay.prepend(postElem); // prepend to show latest content first
    });
}

// Infinite scroll logic
window.onscroll = function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) { // 500 is a threshold, adjust as required
        fetchPosts();
    }
};

// Initial load
fetchPosts();





