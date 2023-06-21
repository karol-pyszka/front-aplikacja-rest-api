import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, onValue, remove, off  } from "firebase/database";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Chat } from '../chat/chat'
import { firebaseConfig } from 'src/environments/environment';
import * as uuid from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  app: FirebaseApp;
  db: Database;
  form: FormGroup;
  username = 'Karol';
  message = '';
  chats: Chat[] = [];

  constructor(private formBuilder: FormBuilder, private renderer: Renderer2) {
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : [this.username]
    });
  }

  ngOnInit(): void {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      for(let id in data) {
        if (!this.chats.map(chat => chat.id).includes(id)) {
          this.chats.push(data[id])
        }
      }
      this.chats.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateA - dateB;
      });
    });
  }

  onChatSubmit(form: any) {
    const chat = form;
    chat.timestamp = new Date().toString();
    chat.id = uuid.v4();
    set(ref(this.db, `chats/${chat.id}`), chat);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : [chat.username],
    });
  }

  deleteAllChats() {
    const chatsRef = ref(this.db, 'chats');
    off(chatsRef); // Detach the previous listener
  
    remove(chatsRef)
      .then(() => {
        console.log('All chats deleted successfully.');
        this.chats = [];
        this.ngOnInit()
      })
      .catch((error) => {
        console.error('Error deleting chats:', error);
      });
  }
}
