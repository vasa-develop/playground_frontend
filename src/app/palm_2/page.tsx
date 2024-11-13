'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateText, chatWithModel } from "@/lib/gemini";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PalmDemo() {
  const [input, setInput] = React.useState<string>('');
  const [response, setResponse] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [chatHistory, setChatHistory] = React.useState<Message[]>([]);
  const [error, setError] = React.useState<string>('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setError('');
    setLoading(true);

    try {
      console.log('Active tab:', activeTab);
      if (activeTab === 'text-chat') {
        const newUserMessage: Message = { role: 'user', content: input };
        const newHistory = [...chatHistory, newUserMessage];
        const response = await chatWithModel(newHistory);
        const newAssistantMessage: Message = { role: 'assistant', content: response };
        setChatHistory([...newHistory, newAssistantMessage]);
      } else {
        const generatedText = await generateText(input);
        setResponse(generatedText);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const [activeTab, setActiveTab] = React.useState<string>('text');

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Language Model Playground
        </h1>
        <p className="text-xl text-muted-foreground">
          Experiment with Google's Gemini language model capabilities
        </p>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/15 text-destructive">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(value) => {
          console.log('Tab changed to:', value);
          setActiveTab(value);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text Generation</TabsTrigger>
            <TabsTrigger value="text-chat">Chat</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Text Generation</CardTitle>
                <CardDescription>
                  Generate text using Gemini's powerful language model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Textarea
                    placeholder="Enter your prompt here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[100px]"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </Button>
                  {response && (
                    <div className="mt-4 p-4 rounded-lg border bg-muted">
                      <pre className="whitespace-pre-wrap">{response}</pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text-chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat Interface</CardTitle>
                <CardDescription>
                  Have an interactive conversation with the model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div
                    ref={chatContainerRef}
                    className="flex flex-col space-y-4 h-[400px] overflow-y-auto p-4 rounded-lg border"
                  >
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      disabled={loading}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !input.trim()}
                    >
                      {loading ? '...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>
                  Explore advanced capabilities like image understanding and structured output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Advanced features coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
