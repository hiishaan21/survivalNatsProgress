document.addEventListener("DOMContentLoaded", () => {
  // DOM elements for the chatbot interface
  const messagesDiv = document.getElementById("messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const helpReturnBtn = document.getElementById("helpReturn");
  const chatWindow = document.getElementById("chat-window");
 
  // OpenAI API Key (don't share)
  const OPENAI_API_KEY = "39Yq9PMyosjb35YJdZJdqqy6H2f9kykzoz215vStauIWY9KmifCEJQQJ99BAACYeBjFXJ3w3AAABACOG88am";

  // Store chat history in an array to persist between calls
  let chatHistory = [];
  
  // Check if we have any saved chat history
  if (localStorage.getItem('chatBotMessages')) {
      try {
          chatHistory = JSON.parse(localStorage.getItem('chatBotMessages'));
          
          // If we have history, display it
          chatHistory.forEach(message => {
              addMessage(message.content, message.type);
          });
          
          // Scroll to bottom of chat
          scrollToBottom();
      } catch (error) {
          console.error("Error loading chat history:", error);
          // If parsing fails, reset the chat history
          localStorage.removeItem('chatBotMessages');
          chatHistory = [];
      }
  }

  // Function to send messages and get AI responses
  const sendMessage = async () => {
      // Get user message and trim whitespace
      const userMessage = userInput.value.trim();
      if (!userMessage) return;

      // Display user's message
      addMessage(userMessage, "user-message");
      
      // Add to chat history
      chatHistory.push({
          type: "user-message",
          content: userMessage
      });
      
      // Clear input field and focus for next message
      userInput.value = "";
      userInput.focus();
      
      // Show loading indicator
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "message bot-message";
      loadingDiv.innerHTML = '<div class="loader"></div>';
      messagesDiv.appendChild(loadingDiv);
      scrollToBottom();

      try {
          // Call Azure OpenAI API for a response
          const botResponse = await getAIResponse(userMessage);
          
          // Remove loading indicator
          messagesDiv.removeChild(loadingDiv);
          
          // Display bot's response
          addMessage(botResponse, "bot-message");
          
          // Add to chat history
          chatHistory.push({
              type: "bot-message",
              content: botResponse
          });
          
          // Save chat history to localStorage
          localStorage.setItem('chatBotMessages', JSON.stringify(chatHistory));
      } catch (error) {
          // Remove loading indicator and show error message
          messagesDiv.removeChild(loadingDiv);
          addMessage("Sorry, I couldn't process your request. Please try again later.", "bot-message");
          console.error("Error in AI response:", error);
      }
  };

  // Function to add messages to the chat window
  const addMessage = (text, className) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${className}`;
      
      // Add icon based on message type
      if (className === "user-message") {
          messageDiv.innerHTML = `<i class="fas fa-user"></i> ${text}`;
      } else {
          messageDiv.innerHTML = `<i class="fas fa-robot"></i> ${text}`;
      }
      
      messagesDiv.appendChild(messageDiv);
      scrollToBottom();
  };
  
  // Function to scroll chat to bottom
  const scrollToBottom = () => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  // Function to get AI response from Azure OpenAI API
  const getAIResponse = async (userMessage) => {
      console.log("Input userMessage: %s", userMessage);
      
      // Show toast notification 
      showToast("Contacting AI Assistant...");
      
      try {
          const url = "https://dineshtestopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview";
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "api-key": OPENAI_API_KEY,              
              },
              body: JSON.stringify({              
                  messages: [
                      { 
                          role: "system", 
                          content: "You are a helpful assistant for a survival game. Provide concise, practical advice about survival strategies, game mechanics, and tips for playing 'Stranded: Island Survival'. Keep responses brief and focused on helping the player. If you don't know an answer, suggest strategies that might work based on typical survival game mechanics." 
                      },
                      { role: "user", content: userMessage },
                  ],
                  max_tokens: 1024,
                  temperature: 0.7,
              }),
          });
          
          // Check if fetch was successful
          if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
          }
    
          const data = await response.json();
          
          // Hide toast notification
          hideToast();
          
          return data.choices[0]?.message?.content.trim() || 
              "I'm sorry, I couldn't understand that. Can you rephrase your question?";
              
      } catch (error) {            
          console.error("Error calling OpenAI API:", error);
          
          // Hide toast and show error in chat
          hideToast();
          
          return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
      }
  };
  
  // Function to show toast notification
  const showToast = (message) => {
      const toast = document.getElementById("notification-toast");
      toast.textContent = message;
      toast.classList.add("show");
  };
  
  // Function to hide toast notification
  const hideToast = () => {
      const toast = document.getElementById("notification-toast");
      toast.classList.remove("show");
  };

  // Add event listeners
  sendBtn.addEventListener("click", sendMessage);
  
  userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
  });
  
  // Add button to clear chat history
  const clearChatBtn = document.createElement("button");
  clearChatBtn.textContent = "Clear Chat";
  clearChatBtn.style.marginTop = "10px";
  clearChatBtn.style.padding = "8px 16px";
  clearChatBtn.style.fontSize = "0.8rem";
  clearChatBtn.style.opacity = "0.8";
  clearChatBtn.addEventListener("click", () => {
      // Clear displayed messages
      messagesDiv.innerHTML = "";
      
      // Clear chat history
      chatHistory = [];
      localStorage.removeItem('chatBotMessages');
      
      // Add initial greeting
      addMessage("Hi there! I'm your survival assistant. How can I help you with your island survival adventure?", "bot-message");
      
      // Add to chat history
      chatHistory.push({
          type: "bot-message",
          content: "Hi there! I'm your survival assistant. How can I help you with your island survival adventure?"
      });
      
      // Show confirmation
      showToast("Chat history cleared");
      setTimeout(hideToast, 2000);
  });
  
  // Add clear button to chat interface
  document.querySelector(".inputTextContainer").after(clearChatBtn);
  
  // Add initial greeting if chat is empty
  if (chatHistory.length === 0) {
      addMessage("Hi there! I'm your survival assistant. How can I help you with your island survival adventure?", "bot-message");
      
      // Add to chat history
      chatHistory.push({
          type: "bot-message",
          content: "Hi there! I'm your survival assistant. How can I help you with your island survival adventure?"
      });
      
      // Save to localStorage
      localStorage.setItem('chatBotMessages', JSON.stringify(chatHistory));
  }
  
  // Check for dark mode preference
  const darkModePref = localStorage.getItem('darkMode') === 'true';
  if (darkModePref) {
      document.body.classList.add('dark-mode');
      document.getElementById('dark-mode-toggle').checked = true;
  }
  
  // Event listener for dark mode toggle
  document.getElementById('dark-mode-toggle').addEventListener('change', function() {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
});