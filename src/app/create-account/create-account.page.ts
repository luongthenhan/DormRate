import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})

export class CreateAccountPage implements OnInit {
  registerForm: FormGroup;

  error_messages = {
    'firstname': [
      { type: 'required', message: 'First Name is required.' },
    ],

    'lastname': [
      { type: 'required', message: 'Last Name is required.' }
    ],

    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email address: end with ".sc.edu"' }
    ],

    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must have at least 8 characters.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must have at least 8 characters.' },
    ],
  }

  constructor(
    public formBuilder: FormBuilder,
    public afauth: AngularFireAuth,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.sc.edu$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
      confirm_password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])),
    }, {
      validators: this.password.bind(this)
    });
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(["/home"]);
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirm_password');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  onSubmit() {
    console.log("Create user");
    var self = this;
    var email = this.registerForm.get('email').value;
    var password = this.registerForm.get('password').value;
    this.afauth.createUserWithEmailAndPassword(email, password).then(u => {
      var currentUser = firebase.auth().currentUser;
      currentUser.updateProfile({
        displayName: this.registerForm.get('firstname').value + " " + this.registerForm.get('lastname').value
      }).then(function() {
        console.log('User Profile Updated Successfully');
        console.log("Hello " + currentUser.displayName);
        self.router.navigate(["/tabs/"]);
      }).catch(function(error) {
        console.log(error);
      });
    });
  }

}
