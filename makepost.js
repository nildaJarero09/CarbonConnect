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
        };

        reader.readAsDataURL(file);
    };
});

document.getElementById('editorForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    var contentDelta = quill.getContents(); // Get content in Quill's Delta format
    var contentHtml = quill.root.innerHTML; // Get content in HTML format

    // Now, you can send 'contentDelta' or 'contentHtml' to your server, display it, etc.

    console.log(contentHtml); // For demonstration purposes

    quill.setContents([]);
});
