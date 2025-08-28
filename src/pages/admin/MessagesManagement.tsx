import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, MailOpen, Trash2, Eye, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
      
      toast({
        title: "Success",
        description: "Message marked as read",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const unreadMessages = messages.filter(msg => !msg.read);
  const readMessages = messages.filter(msg => msg.read);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MessageCard = ({ message }: { message: ContactMessage }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        !message.read ? 'border-primary/50 bg-primary/5' : ''
      } ${selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''}`}
      onClick={() => setSelectedMessage(message)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {message.read ? (
                <MailOpen className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Mail className="w-4 h-4 text-primary" />
              )}
              <CardTitle className="text-sm font-medium">{message.name}</CardTitle>
            </div>
            {!message.read && (
              <Badge variant="default" className="text-xs">New</Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(message.created_at)}
          </div>
        </div>
        <CardDescription className="text-xs">{message.email}</CardDescription>
        {message.subject && (
          <div className="text-sm font-medium text-foreground">{message.subject}</div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {message.message}
        </p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Manage contact messages from your portfolio visitors
        </p>
      </div>

      {messages.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No messages found. Messages from your contact form will appear here.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Messages List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                All Messages ({messages.length})
              </h2>
              {unreadMessages.length > 0 && (
                <Badge variant="destructive">
                  {unreadMessages.length} unread
                </Badge>
              )}
            </div>

            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unread">
                  Unread ({unreadMessages.length})
                </TabsTrigger>
                <TabsTrigger value="read">
                  Read ({readMessages.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="unread" className="mt-4">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {unreadMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No unread messages
                    </p>
                  ) : (
                    unreadMessages.map((message) => (
                      <MessageCard key={message.id} message={message} />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="read" className="mt-4">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {readMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No read messages
                    </p>
                  ) : (
                    readMessages.map((message) => (
                      <MessageCard key={message.id} message={message} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Message Details */}
          <div className="lg:border-l lg:pl-6">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>{selectedMessage.name}</span>
                        {!selectedMessage.read && (
                          <Badge variant="default">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{selectedMessage.email}</CardDescription>
                      {selectedMessage.subject && (
                        <div className="mt-2">
                          <strong>Subject:</strong> {selectedMessage.subject}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!selectedMessage.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(selectedMessage.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Received: {formatDate(selectedMessage.created_at)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">
                    {selectedMessage.message}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a message to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}