import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  user =
    {
      email: "",
      password: ""
    }

  constructor(

    public afauth: AngularFireAuth,
    public firebase: AngularFirestore,
    private router: Router,
    private tc: ToastController,
    private ar: ActivatedRoute

  ) { }

  ngOnInit() {
    console.log("initializing sign in page");
  }

  signInWithEmail(email: string, password: string) {
  	// Promise<firebase.auth.UserCredential>
    console.log("Signing in");
    this.afauth.signInWithEmailAndPassword(email, password).then(user => {
  		// navigate to user profile
  		console.log(user.user.email, user.user.uid);
  		var user1 = firebase.auth().currentUser;
  		console.log(user1.uid);
      //this.itemservice.setUID(user.user.uid);
      //this.toastMessage();
      var db = firebase.firestore();
      var self = this;
      db.collection("users").where("uid",'==', user1.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.log(doc.id, "=>", doc.data());
            var type = doc.data().usertype;
            var t = String(type);
            console.log("User type:"+t);
            //self.itemservice.setUsertype(t);
            //self.router.navigate(["/"]);
            //self.itemservice.load_my_orders();
            //self.itemservice.load_my_carts();
          });
        })
        .catch(function(error) {
          console.log("Error getting documents:",error);
        });

      self.router.navigate(["/tabs/"]);
  	})
  	.catch(error => {
      console.log(error);
      const t = document.createElement('ion-toast');
      t.message = "Incorrect email/password combo, or user does not exist.";
      t.color = "danger";
      t.duration = 2000;
      document.body.appendChild(t);
      return t.present();
  	});
  }

   signup() {
     this.router.navigate(["/create-account"])
   }

   back() {
     this.router.navigate(["/home"]);
   }

   loginGoogle() {
     // Using a popup.
     var provider = new firebase.auth.GoogleAuthProvider();
     var self = this;
     provider.addScope('profile');
     provider.addScope('email');
     firebase.auth().signInWithPopup(provider).then(function(result) {
       // This gives you a Google Access Token.
     var cred = result.credential as firebase.auth.OAuthCredential;
     var token = cred.accessToken;
     // The signed-in user info.
     var user = result.user;
     // self.itemservice.setUID(user.uid);
     // self.itemservice.load_my_orders();
     // self.itemservice.load_my_carts();
     // self.itemservice.setUsertype("visitor");

     const toast = document.createElement('ion-toast');
     toast.message = 'Succesfully logged in with Google.';
     toast.color = "success";
     toast.duration = 2000;
     document.body.appendChild(toast);
     toast.present();
     self.router.navigate(["/tabs/"]);
 });
   }

}
