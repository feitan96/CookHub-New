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
import { AuthProvider, useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils"

// Define the type for your message
type Message = {
  user_id: string
  username: any
  $id: string;
  $createdAt: number;
  body: string;
  imageUrl: string;
}

const ChatRoom = () => {
    const { toast } = useToast();
    const { id } = useParams();
    const { data: post } = useGetPostById(id);
    const [messageBody, setMessageBody] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const {user} = useUserContext()

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

      // Check if the messageBody is not empty
      if (messageBody.trim() === '') {
        alert('Comment cannot be empty');
        return;
      }

      let payload = {
          user_id:user.id,  
          username:user.name,
          body:messageBody,
          imageUrl:user.imageUrl
      }

      let response = await databases.createDocument(
          appwriteConfig.databaseId, 
          appwriteConfig.messagesCollectionId, 
          ID.unique(), 
          payload
      )
      console.log('CREATED:', response)
      toast({ title: "Message Sent", });
      setMessageBody('')
  }
    
    const deleteMessage = async (id: string) => {
      await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.messagesCollectionId, id);
      toast({ title: "Message Deleted" });
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
      <SheetContent className="bg-black" style={{ width: '80%', maxWidth: '700px' }}>
        <main className="container">
          <div className="room--container">
          <h2 className="h3-bold md:h2-bold text-left w-full mb-4">Global Chat</h2>
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
              <div className="custom-scrollbar" style={{  overflowY: 'auto', maxHeight: '700px', paddingTop: '5px'  }}>
                {messages.map(message => (
                    <div key={message.$id} className="message--wrapper">
                        <div className="message--header">
                          <div className="flex  gap-3" style={{ marginTop: '24px' }}>
                            <img 
                              src={message.imageUrl ||
                                "/assets/icons/profile-placeholder.svg"} 
                              alt={message.username} 
                              className="user-image w-12 lg:h-12 rounded-full" 
                            />
                          <div>
                            
                          </div>
                            <p className="flex flex-row"> 
                                {message?.username ? (
                                    <span> {message?.username}</span>
                                ): (
                                    'Anonymous user'
                                )}
                                <p className="message-timestamp">{multiFormatDateString(message.$createdAt)}</p>
                            </p>
                          </div>
                          {user.id === message.user_id && (
                              <Trash2 
                                  className="delete--btn"
                                  onClick={() => {deleteMessage(message.$id)}}
                              />
                          )}
                        </div>
                        <div className="message--body" style={{marginLeft: '65px', marginTop: '-20px'}}>
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
