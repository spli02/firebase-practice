document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    console.log(app)

    //retrieve the data from database
    const db = firebase.firestore();
    const myPost = db.collection('posts').doc('firstpost');
    myPost.onSnapshot(doc => { 
    const data = doc.data();
    document.write( data.title + `<br>`)
    document.write( data.createdAt )
    })

    //choose the data from database
    const productsRef = db.collection('products');
    // const query = productsRef.where('price','>=', 10);
    const query = productsRef.orderBy('price','desc').limit(1);
    query.get()
        .then(products => {
            products.forEach(doc =>{
                data = doc.data()
                document.write(`${data.name} at ${data.price} <br>`)
            })
            console.log("get the price")
        })
});

//display google login user's name
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                document.write(`Hello ${user.displayName}`);
                console.log(user)
            })
            .catch(console.log)
}

//update the content of database
function updatePost(e){
    const db = firebase.firestore();
    const myPost = db.collection('posts').doc('firstpost');
    myPost.update({ title: e.target.value})
}

//upload the file and display it
function uploadFile(files){
    const storageRef = firebase.storage().ref();
    const hourseRef = storageRef.child('hourse.jpg');

    const file = files.item(0);
    const task = hourseRef.put(file)

    task.then(snapshot => {
        console.log(snapshot)
        const url = snapshot.downloadURL
        document.querySelector('#imgUpload').setAttribute('src',url);
    })

}

//functions
const functions = require('firebase-functions');

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendMessage = functions.firestore
    .document('products/{productId}')
    .onCreate(event =>{
        const docId = event.params.productId;
        const name = event.data.data().name;
        const productRef = admin.firestore().collection('products').doc(docId)
        return productRef.update({message: `Nice ${name}! - Love Cloud Functions`})
    });
