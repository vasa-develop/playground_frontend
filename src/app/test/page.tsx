"use client"

import {
    Bird,
    Book,
    Bot,
    Code2,
    CornerDownLeft,
    LifeBuoy,
    Link,
    Mic,
    Paperclip,
    Rabbit,
    Settings,
    Settings2,
    Share,
    SquareTerminal,
    SquareUser,
    Triangle,
    Turtle,
    Info,
  } from "lucide-react"
  
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Textarea } from "@/components/ui/textarea"
  import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import dynamic from "next/dynamic"
import { DNA_SEQUENCE, SAMPLE_PDB_STR, SAMPLE_SEQUENCE, PROTEIN_CODING_SEQUENCE_INDICES } from "../constants"
import { SequenceViewer } from "@/components/SequenceViewer"
import { useState } from "react";
import axios from "axios";
  
function Dashboard() {
  const DynamicMoleculeViewer = dynamic(() => import('../../components/MoleculeViewer'), {
    ssr: false,
    loading: () => <p>Loading viewer...</p>
  });

  const placeholderValue = "|d__Bacteria;p__Pseudomonadota;c__Gammaproteobacteria;o__Enterobacterales;f__Enterobacteriaceae;g__Escherichia;s__Escherichia|";
  const [prompt, setPrompt] = useState(placeholderValue);
  const [badgeText, setBadgeText] = useState("Copy Example");
  const [temperature, setTemperature] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [topP, setTopP] = useState(1.0);
  const [topK, setTopK] = useState(4);
  const [dna_sequence, setDnaSequence] = useState(DNA_SEQUENCE);
  const [proteinCodingSequenceIndices, setProteinCodingSequenceIndices] = useState<{start: number, end: number}[]>(PROTEIN_CODING_SEQUENCE_INDICES);
  const [proteinSequences, setProteinSequences] = useState<string>(SAMPLE_SEQUENCE);
  const [proteinStructure, setProteinStructure] = useState<string>(SAMPLE_PDB_STR);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(placeholderValue);
    setBadgeText("Copied!");
    setTimeout(() => setBadgeText("Copy Example"), 2000); // Reset after 2 seconds
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 2.0) {
      setTemperature(value);
    }
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 2048) {
      setMaxTokens(value);
    }
  };

  const handleTopPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0.0 && value <= 1.0) {
      setTopP(value);
    }
  };

  const handleTopKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      setTopK(value);
    }
  };

  const updateDnaSequence = (new_dna_sequence: string) => {
    setDnaSequence(new_dna_sequence);
  }

  const handleGenerate = async () => {
    console.log(prompt, maxTokens, temperature, topK, topP);
    try {
      const response = await axios.post('http://13.52.72.81:8000/generate_dna', {
        prompt,
        max_tokens: maxTokens,
        temperature,
        top_k: topK,
        top_p: topP
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const generate_dna_response = response.data as {"dna_sequence": string};
      updateDnaSequence(generate_dna_response.dna_sequence);
      await predictGenes(generate_dna_response.dna_sequence); // Call the new function here

    } catch (error) {
      console.error("Error generating DNA and Protein sequence:", error);
    }
  };

  const predictGenes = async (dna_sequence: string) => {
    try {
      const response = await axios.post('http://13.52.72.81:8000/predict_genes', {
        dna_sequence
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const predicted_genes_response = response.data as {
        "protein_coding_sequence_indices": {start: number, end: number}[],
        "protein_coding_sequences": string[],
        "protein_sequences": string
      };
      setProteinCodingSequenceIndices(predicted_genes_response.protein_coding_sequence_indices);
      setProteinSequences(predicted_genes_response.protein_sequences);
      await predictProteinStructure(predicted_genes_response.protein_sequences); // Call the new function here
    } catch (error) {
      console.error("Error predicting genes:", error);
    }
  };

  const predictProteinStructure = async (protein_sequences: string) => {
    try {
      const response = await axios.post('http://13.52.72.81:8000/predict_protein_structure', {
        protein_sequences
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const predicted_protein_structure_response = response.data as {"protein_structure": string};
      setProteinStructure(predicted_protein_structure_response.protein_structure);
    } catch (error) {
      console.error("Error predicting protein structure:", error);
    }
  };

  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-muted"
                  aria-label="Playground"
                >
                  <SquareTerminal className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Playground
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Models"
                >
                  <Bot className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Models
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="API"
                >
                  <Code2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                API
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Documentation"
                >
                  <Book className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Documentation
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Settings"
                >
                  <Settings2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                >
                  <LifeBuoy className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Account"
                >
                  <SquareUser className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Evo Playground</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>
                  Configure the settings for the model and messages.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Model</Label>
                    <Select>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genesis">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Rabbit className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Genesis
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Our fastest model for general use cases.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="explorer">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Bird className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Explorer
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Performance and speed for efficiency.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="quantum">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Turtle className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Quantum
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                The most powerful model for complex computations.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input id="temperature" type="number" placeholder="0.4" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Temperature</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Max Tokens</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Messages
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="You are a..." />
                  </div>
                </fieldset>
              </form>
            </DrawerContent>
          </Drawer>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-3">
          <div className="flex items-start h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 md:col-span-2">
            <Badge variant="outline">
              Predicted Protein Structure via ESM
            </Badge>
            <DynamicMoleculeViewer pdbStr={proteinStructure} sequence={proteinSequences} />
            <div className="flex-1" />
          </div>
          <div className="relative flex flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
            <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Description
                </legend>
                <p>
                  <a href="https://arcinstitute.org/news/blog/evo" target="_blank" className="underline">Evo</a> is a 7 billion parameter model trained to generate DNA sequences using a context length of 131k tokens, developed by <a href="https://arcinstitute.org/" target="_blank" className="underline">Arc Institute</a>, <a href="https://www.stanford.edu/" target="_blank" className="underline">Stanford</a>, and <a href="https://together.xyz/" target="_blank" className="underline">TogetherAI</a> researchers.
                </p>
                <p>
                 This playground allows you to interact with the Evo model to generate DNA sequences based on the input prompt and parameters you provide.
                 The generated DNA sequence passed to <a href="https://github.com/hyattpd/Prodigal" target="_blank" className="underline">Prodigal</a> to predict protein coding regions. Finally, the protein sequence is passed to <a href="https://esmatlas.com/" target="_blank" className="underline">ESM</a> to predict protein structure.
                </p>
                <p>
                  The source code for this playground can be found here (<a href="https://github.com/vasa-develop/playground_frontend" target="_blank" className="underline">frontend</a>, <a href="https://github.com/vasa-develop/playground_backend" target="_blank" className="underline">backend</a>). Feel free to <a href="https://vasa.bio" target="_blank" className="underline">reach out</a> if you have any questions or feedback.
                </p>
            </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>
                <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="prompt">Prompt</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="ml-2 size-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Prompting scheme follows &quot;Greengenes-style lineage strings&quot; with &quot;|&quot; delimiters
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Badge className="ml-2 cursor-pointer bg-gray-200 text-black" onClick={copyToClipboard}>
                        {badgeText}
                      </Badge>
                    </div>
                    <Input
                      id="prompt"
                      type="text"
                      placeholder={placeholderValue}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>  
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="temperature">Temperature</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="ml-2 size-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Controls the randomness of the output. Higher values result in more diverse responses (min: 0.0, max: 2.0)
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="0.7"
                      min="0"
                      max="2.0"
                      step="0.1"
                      value={temperature}
                      onChange={handleTemperatureChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="ml-2 size-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Specifies the max length of the model&apos;s generated output. Higher values allow for longer responses (min: 0, max: 2048)
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="max-tokens"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="2048"
                      step="1"
                      value={maxTokens}
                      onChange={handleMaxTokensChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="top-p">Top P</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="ml-2 size-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Adjusts variety in responses by considering only the most likely words up to a set threshold. Higher values result in more diverse responses (min: 0.0, max: 1.0)
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="top-p"
                      type="number"
                      placeholder="0.7"
                      min="0.0"
                      max="1.0"
                      step="0.1"
                      value={topP}
                      onChange={handleTopPChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="top-k">Top K</Label>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span>
                              <Info className="ml-2 size-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Limits variety by selecting from the top &apos;k&apos; most likely next words. Higher values result in more diverse responses (min: 0, max: 100)
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="top-k"
                      type="number"
                      placeholder="0.0"
                      min="0"
                      max="100"
                      step="1"
                      value={topK}
                      onChange={handleTopKChange}
                    />
                  </div>
                </div>
                <Button variant="default" type="button" onClick={handleGenerate}>
                  Generate DNA and Protein sequence
                </Button>
              </fieldset>
            </form>
          </div>
          <div className="flex items-start h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 md:col-span-3">
            <Badge variant="outline">
              Predicted DNA Sequence via Evo and Predicted &nbsp;<span style={{background : "yellow"}}>protein coding regions</span>&nbsp; via Prodigal
            </Badge>
            <SequenceViewer sequence={dna_sequence} protein_coding_sequence_indices={proteinCodingSequenceIndices} />
            <div className="flex-1" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard;