import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "../../components/ui"
import { useGetPostById, useGetUsers, useSearchUsers } from "@/lib/react-query/queries"

import { useEffect, useState } from "react"
import { appwriteConfig, account, databases, client } from "@/lib/appwrite/config";
import { ID, Query, Permission, Role} from 'appwrite';
import {Trash2} from 'react-feather'
import { useParams } from "react-router-dom"

// Define the type for your message
type Message = {
  $id: string;
  $createdAt: number;
  body: string;
}

const ChatRoom = () => {
    const { toast } = useToast();
    const { id } = useParams();
    const { data: post } = useGetPostById(id);
    const [messageBody, setMessageBody] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
      getMessages();
    
      const unsubscribe = client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`, response => {

          if(response.events.includes("databases.*.collections.*.documents.*.create")){
              console.log('A MESSAGE WAS CREATED')
              setMessages(prevState => [response.payload, ...prevState])
          }

          if(response.events.includes("databases.*.collections.*.documents.*.delete")){
              console.log('A MESSAGE WAS DELETED!!!')
              setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
          }
      });


      console.log('unsubscribe:', unsubscribe)
    
      return () => {
        unsubscribe();
      };
    }, []);

    const getMessages = async () => {
      const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.messagesCollectionId,
          [
              Query.orderDesc('$createdAt'),
              Query.limit(100),
          ]
      )
      console.log(response.documents)
      setMessages(response.documents)
  }


    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault()

      let payload = {
          body:messageBody
      }

      let response = await databases.createDocument(
          appwriteConfig.databaseId, 
          appwriteConfig.messagesCollectionId, 
          ID.unique(), 
          payload
      )
      console.log('CREATED:', response)

      //setMessages(prevState => [response, ...prevState])

      setMessageBody('')
  }
    
    const deleteMessage = async (id: string) => {
      await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.messagesCollectionId, id);
      //setMessages(prevState => prevState.filter(message => message.$id !== id))
   } 

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"
        style={{
            backgroundColor: 'rgb(18,55,42)',
        }}
        >Chat With Others</Button>
      </SheetTrigger>
      <SheetContent className="bg-black">
        <main className="container">
          <div className="room--container">
              <form id="message--form" onSubmit={handleSubmit}>
                <div>
                    <textarea 
                        required 
                        className="text-white"
                        placeholder="Say something..." 
                        onChange={(e) => {setMessageBody(e.target.value)}}
                        value={messageBody}
                        ></textarea>
                </div>

                <div className="send-btn--wrapper">
                    <input className="btn btn--secondary" type="submit" value="send"/>
                </div>
              </form>

                <div>
                    {messages.map(message => (
                      <div key={message.$id} className="message--wrapper">
                          <div className="message--header">
                            <small className="message-timestamp"> {new Date(message.$createdAt).toLocaleString()}</small>
                                <Trash2 
                                  className="delete--btn"
                                  onClick={() => {deleteMessage(message.$id)}}
                                />
                          </div>

                          <div className="message--body">
                                <span>{message.body}</span>
                          </div>
                      </div>
                    ))}
                </div>
          
            </div>
          </main>
      </SheetContent>
    </Sheet>
  )
}

export default ChatRoom
