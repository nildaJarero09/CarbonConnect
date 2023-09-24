// Initialize Firebase with your config
var firebaseConfig = {
    apiKey: "AIzaSyBCxQrqopNLvh8f6PNKB-uXZS5Sf_RaT2g",
    authDomain: "carbonconnect2023.firebaseapp.com",
    projectId: "carbonconnect2023",
    storageBucket: "carbonconnect2023.appspot.com",
    messagingSenderId: "1041152472743",
    appId: "1:1041152472743:web:4297ad684e743d132f4d82",
  };

firebase.initializeApp(firebaseConfig);

// Reference to the completedPercentage node in the Realtime Database
const dbRef = firebase.database().ref("completedPercentage");

// Listen for changes in the completedPercentage node
dbRef.on("value", (snapshot) => {
    const percentageValue = snapshot.val();
    
    // Update the percentage value displayed on the page
    document.getElementById("percentage-value").textContent = percentageValue + "%";

    // Change the image based on the percentage value
    const statusImage = document.getElementById("status-image");
    if (percentageValue == 100) {
        statusImage.src = "image100.png"; // Change this to the image you want
    } else if (percentageValue >= 80){
        statusImage.src = "image80.png"; // Change this to a different image if needed
    } else if (percentageValue >= 60){
        statusImage.src = "image60.png"; // Change this to a different image if needed
    } else if (percentageValue >= 40){
        statusImage.src = "image40.png"; // Change this to a different image if needed
    } else if (percentageValue >= 20){
        statusImage.src = "image20.png"; // Change this to a different image if needed
    }else if (percentageValue == 0){
        statusImage.src = "image0.png"; // Change this to a different image if needed
    }
});
