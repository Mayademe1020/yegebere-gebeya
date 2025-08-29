"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileOptimizedLayout, MobileCard } from '@/components/layout/mobile-optimized-layout';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Lightbulb,
  Stethoscope,
  Wheat,
  TrendingUp,
  Camera,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'health' | 'nutrition' | 'breeding' | 'market' | 'general';
  attachments?: string[];
}

interface QuickQuestion {
  id: string;
  question: string;
  category: 'health' | 'nutrition' | 'breeding' | 'market';
  icon: React.ReactNode;
}

// Mock AI responses based on categories
const mockResponses = {
  health: [
    "የእንስሳዎ ጤንነት ችግር ለመፍታት መጀመሪያ ምልክቶቹን በትክክል መለየት ያስፈልጋል። የሙቀት መጠን፣ የምግብ ፍላጎት እና ባህሪ ለውጦችን ይመልከቱ።",
    "ይህ ምልክት የተለመደ የጤንነት ችግር ሊሆን ይችላል። በአቅራቢያዎ ያለ የእንስሳት ሐኪም ማማከር እመክራለሁ። ለአስቸኳይ እርዳታ 8335 ይደውሉ።",
    "የመከላከያ ክትባት መርሃ ግብር በጣም አስፈላጊ ነው። ዓመታዊ ክትባቶችን እና የወቅታዊ በሽታዎችን መከላከያ እርምጃዎችን ይከተሉ።"
  ],
  nutrition: [
    "የእንስሳዎ የምግብ ፍላጎት እድሜ፣ ክብደት እና የምርት ደረጃ ላይ የተመሰረተ ነው። ሚዛናዊ የሆነ ምግብ ማቅረብ ያስፈልጋል።",
    "የሳር እጥረት ወቅት ተጨማሪ የፕሮቲን ምንጮችን ማከል ያስፈልጋል። የአተር ፍሬዎች እና የንግድ መኖዎችን ይጠቀሙ።",
    "ንጹህ ውሃ ሁልጊዜ ሊኖር ይገባል። አንድ ላም በቀን እስከ 50 ሊትር ውሃ ሊጠጣ ይችላል።"
  ],
  breeding: [
    "የመራቢያ ጊዜ መምረጥ በጣም አስፈላጊ ነው። የሴት እንስሳዎን የመራቢያ ዑደት በደንብ ይከታተሉ።",
    "ጥሩ የዘር ወንድ መምረጥ የወደፊት ትውልድ ጥራት ይወስናል። የዘር ታሪክ እና የጤንነት ሁኔታ ይመልከቱ।",
    "እርግዝና ወቅት ልዩ እንክብካቤ ያስፈልጋል። የምግብ መጠን መጨመር እና የእረፍት ቦታ ማዘጋጀት አስፈላጊ ነው።"
  ],
  market: [
    "የገበያ ዋጋ በወቅቱ፣ በክልሉ እና በእንስሳው ጥራት ይለያያል። የአካባቢዎን ገበያ በመደበኛነት ይከታተሉ።",
    "ለሽያጭ ዝግጅት ከማድረግ በፊት እንስሳዎን በጥሩ ሁኔታ ማቆየት ያስፈልጋል። ንጹህነት እና ጤንነት ዋጋን ይጨምራል።",
    "የሽያጭ ወቅት መምረጥ አስፈላጊ ነው። በበዓላት እና በልዩ ወቅቶች ዋጋ ይጨምራል።"
  ]
};

const quickQuestions: QuickQuestion[] = [
  {
    id: '1',
    question: 'ላሜ ምግብ አትበላም፣ ምን ማድረግ አለብኝ?',
    category: 'health',
    icon: <Stethoscope className="h-4 w-4" />
  },
  {
    id: '2',
    question: 'የላም ወተት ምርት እንዴት ማሻሻል እችላለሁ?',
    category: 'nutrition',
    icon: <Wheat className="h-4 w-4" />
  },
  {
    id: '3',
    question: 'መቼ ላሜን ለመራቢያ ማዘጋጀት አለብኝ?',
    category: 'breeding',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    id: '4',
    question: 'የአሁኑ የላም ዋጋ ምን ያህል ነው?',
    category: 'market',
    icon: <TrendingUp className="h-4 w-4" />
  }
];

export function EthiopianLivestockGPT() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'ሰላም! እኔ የኢትዮጵያ የእንስሳት እርባታ ረዳት ነኝ። የእንስሳት ጤንነት፣ ምግብ፣ መራቢያ እና የገበያ ጥያቄዎችዎን መመለስ እችላለሁ። እንዴት ልረዳዎት?',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'health':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'nutrition':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'breeding':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'market':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryName = (category?: string) => {
    switch (category) {
      case 'health':
        return 'ጤንነት';
      case 'nutrition':
        return 'ምግብ';
      case 'breeding':
        return 'መራቢያ';
      case 'market':
        return 'ገበያ';
      default:
        return 'አጠቃላይ';
    }
  };

  const generateResponse = (userMessage: string): { content: string; category: string } => {
    // Simple keyword-based categorization
    const healthKeywords = ['ሕመም', 'በሽታ', 'ጤንነት', 'ሐኪም', 'ክትባት', 'ምግብ አትበላም'];
    const nutritionKeywords = ['ምግብ', 'መኖ', 'ወተት', 'ውሃ', 'ፕሮቲን', 'ቪታሚን'];
    const breedingKeywords = ['መራቢያ', 'እርግዝና', 'ወሊድ', 'ዘር', 'ወንድ', 'ሴት'];
    const marketKeywords = ['ዋጋ', 'ገበያ', 'ሽያጭ', 'ግዢ', 'ብር'];

    let category = 'general';
    if (healthKeywords.some(keyword => userMessage.includes(keyword))) {
      category = 'health';
    } else if (nutritionKeywords.some(keyword => userMessage.includes(keyword))) {
      category = 'nutrition';
    } else if (breedingKeywords.some(keyword => userMessage.includes(keyword))) {
      category = 'breeding';
    } else if (marketKeywords.some(keyword => userMessage.includes(keyword))) {
      category = 'market';
    }

    const responses = mockResponses[category as keyof typeof mockResponses] || [
      'ጥያቄዎን ተረድቻለሁ። ተጨማሪ መረጃ ለመስጠት እሞክራለሁ። የበለጠ ዝርዝር ጥያቄ ካለዎት እባክዎ ይጠይቁ።'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return { content: randomResponse, category };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const { content, category } = generateResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content,
        timestamp: new Date(),
        category: category as any
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: QuickQuestion) => {
    setInputMessage(question.question);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <MobileOptimizedLayout className="bg-gray-50 dark:bg-gray-900 max-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              የእንስሳት እርባታ ረዳት
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              24/7 የእንስሳት እርባታ ምክር
            </p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              ንቁ
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          ፈጣን ጥያቄዎች
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {quickQuestions.map((question) => (
            <Button
              key={question.id}
              variant="outline"
              onClick={() => handleQuickQuestion(question)}
              className="justify-start text-left h-auto p-3 whitespace-normal"
            >
              <div className="flex items-start gap-2">
                {question.icon}
                <span className="text-sm">{question.question}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.type === 'assistant' && (
              <div className="p-2 bg-primary/10 rounded-lg self-start">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            )}
            
            <div
              className={cn(
                'max-w-[80%] rounded-lg p-3',
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {message.category && message.type === 'assistant' && (
                    <Badge className={getCategoryColor(message.category)}>
                      {getCategoryName(message.category)}
                    </Badge>
                  )}
                </div>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString('am-ET', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {message.type === 'user' && (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg self-start">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="ጥያቄዎን ይጻፉ..."
              className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              disabled={isTyping}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleVoiceInput}
              className={cn(
                'absolute right-2 top-1/2 transform -translate-y-1/2',
                isListening && 'text-red-500'
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Lightbulb className="h-3 w-3 mr-1" />
          የእንስሳት ጤንነት፣ ምግብ፣ መራቢያ እና የገበያ ጥያቄዎችን ይጠይቁ
        </div>
      </div>
    </MobileOptimizedLayout>
  );
}
