'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateText, chatWithModel, analyzeImage, generateCode } from "@/lib/gemini";

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
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePrompt, setImagePrompt] = React.useState<string>('');
  const [codePrompt, setCodePrompt] = React.useState<string>('');
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

  const handleImageAnalysis = async () => {
    if (!selectedImage || !imagePrompt.trim()) return;

    setError('');
    setLoading(true);

    try {
      const result = await analyzeImage(selectedImage, imagePrompt);
      setResponse(result);
      setImagePrompt('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while analyzing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeGeneration = async () => {
    if (!codePrompt.trim()) return;

    setError('');
    setLoading(true);

    try {
      const result = await generateCode(codePrompt);
      setResponse(result);
      setCodePrompt('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating code. Please try again.');
    } finally {
      setLoading(false);
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
          Experiment with Google&apos;s Gemini language model capabilities
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
                  Generate text using Gemini&apos;s powerful language model
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
                  Explore advanced capabilities like image understanding and code generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="image" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image">Image Understanding</TabsTrigger>
                    <TabsTrigger value="code">Code Generation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="image">
                    <div className="flex flex-col space-y-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedImage(file);
                            }
                          }}
                        />
                      </div>
                      {selectedImage && (
                        <div className="relative w-full max-w-sm">
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            className="rounded-lg border"
                          />
                        </div>
                      )}
                      <Textarea
                        placeholder="Ask a question about the image..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleImageAnalysis}
                        disabled={!selectedImage || !imagePrompt || loading}
                      >
                        {loading ? 'Analyzing...' : 'Analyze Image'}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="code">
                    <div className="flex flex-col space-y-4">
                      <Textarea
                        placeholder="Describe the code you want to generate..."
                        value={codePrompt}
                        onChange={(e) => setCodePrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleCodeGeneration}
                        disabled={!codePrompt || loading}
                      >
                        {loading ? 'Generating...' : 'Generate Code'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {response && (
                  <div className="mt-4 p-4 rounded-lg border bg-muted">
                    <pre className="whitespace-pre-wrap font-mono">{response}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
