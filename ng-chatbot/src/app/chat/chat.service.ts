import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {
  readonly token = environment.dialogflow.ngChatbot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // Ajoute le message à la conversation
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  // Envoie et reçoit des messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      });
  }


  talk() {
    this.client.textRequest('Coucou')
      .then(res => console.log(res));
  }

}
