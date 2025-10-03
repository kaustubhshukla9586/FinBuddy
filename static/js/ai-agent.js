class AIFinancialAgent {
    constructor() {
        this.transactions = window.transactionData || [];
        this.cashIncome = window.cashIncome || 0;
        this.cashExpense = window.cashExpense || 0;
        this.onlineIncome = window.onlineIncome || 0;
        this.onlineExpense = window.onlineExpense || 0;
        this.totalIncome = window.totalIncome || 0;
        this.totalExpense = window.totalExpense || 0;
        
        this.config = null;
        this.categoryAnalysis = {};
        this.spendingPatterns = {};
        
        this.loadConfig().then(() => {
            this.analyzeTransactions();
            this.init();
            this.restoreChatFromStorage();
        });
    }

    async streamBotMessage(fullText, typingId) {
        this.hideTypingIndicator(typingId);
        const msgDiv = this.addMessage('', 'bot');
        const contentDiv = msgDiv.querySelector('.ai-content > p');
        let i = 0;
        const chunk = Math.max(5, Math.floor(fullText.length / 40));
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                contentDiv.textContent = fullText.slice(0, i);
                i += chunk;
                if (i >= fullText.length) {
                    contentDiv.textContent = fullText;
                    clearInterval(interval);
                    resolve();
                }
            }, 30);
        });
    }

    setControlsEnabled(enabled) {
        const input = document.getElementById('ai-input');
        const sendButton = document.getElementById('ai-send');
        const regenerateBtn = document.getElementById('ai-regenerate');
        const clearBtn = document.getElementById('ai-clear');
        [input, sendButton, regenerateBtn, clearBtn].forEach(el => { if (el) el.disabled = !enabled; });
    }

    regenerateLast() {
        const messagesContainer = document.getElementById('ai-messages');
        const all = Array.from(messagesContainer.querySelectorAll('.ai-message'));
        const lastUser = [...all].reverse().find(div => div.classList.contains('ai-user'));
        if (!lastUser) return;
        const text = lastUser.querySelector('.ai-content > p').textContent;
        this.setControlsEnabled(false);
        const typingId = this.showTypingIndicator();
        const full = this.generateAIResponse(text);
        this.streamBotMessage(full, typingId).then(() => {
            this.setControlsEnabled(true);
            this.saveChatToStorage();
        });
    }

    clearChat() {
        const messagesContainer = document.getElementById('ai-messages');
        messagesContainer.innerHTML = '';
        this.addMessage("Hello! I'm your AI financial assistant. I can analyze your transactions, provide spending insights, and help you understand your financial patterns. Ask me anything about your finances!", 'bot');
        this.saveChatToStorage();
    }

    saveChatToStorage() {
        const messagesContainer = document.getElementById('ai-messages');
        const items = Array.from(messagesContainer.querySelectorAll('.ai-message')).map(div => ({
            sender: div.classList.contains('ai-bot') ? 'bot' : 'user',
            text: div.querySelector('.ai-content > p')?.textContent || ''
        }));
        localStorage.setItem('aiChatHistory', JSON.stringify(items));
    }

    restoreChatFromStorage() {
        const raw = localStorage.getItem('aiChatHistory');
        if (!raw) return;
        try {
            const items = JSON.parse(raw);
            const messagesContainer = document.getElementById('ai-messages');
            messagesContainer.innerHTML = '';
            items.forEach(item => this.addMessage(item.text, item.sender));
        } catch (e) {
            // ignore corrupt storage
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('/static/config/openai_config.json');
            this.config = await response.json();
            console.log('OpenAI config loaded:', this.config);
        } catch (error) {
            console.error('Failed to load config:', error);
            // Fallback config
            this.config = {
                openai: {
                    model: "gpt-3.5-turbo",
                    max_tokens: 500,
                    temperature: 0.7
                },
                transaction_keywords: {
                    food: ["restaurant", "grocery", "food", "dining", "meal"],
                    transport: ["gas", "fuel", "uber", "taxi", "transport"],
                    entertainment: ["movie", "cinema", "game", "entertainment"],
                    shopping: ["store", "shop", "amazon", "purchase"],
                    utilities: ["electric", "water", "internet", "phone"]
                }
            };
        }
    }

    analyzeTransactions() {
        this.categoryAnalysis = {};
        this.spendingPatterns = {
            byCategory: {},
            byMethod: { cash: 0, online: 0 },
            byDay: {},
            trends: []
        };

        // Analyze each transaction
        this.transactions.forEach(transaction => {
            const category = this.categorizeTransaction(transaction.description);
            const amount = Math.abs(transaction.amount);
            
            // Category analysis
            if (!this.categoryAnalysis[category]) {
                this.categoryAnalysis[category] = {
                    total: 0,
                    count: 0,
                    transactions: []
                };
            }
            this.categoryAnalysis[category].total += amount;
            this.categoryAnalysis[category].count += 1;
            this.categoryAnalysis[category].transactions.push(transaction);

            // Method analysis
            const method = transaction.description.includes('[Cash]') ? 'cash' : 'online';
            this.spendingPatterns.byMethod[method] += amount;

            // Date analysis
            const date = new Date(transaction.date);
            const dayKey = date.toISOString().split('T')[0];
            if (!this.spendingPatterns.byDay[dayKey]) {
                this.spendingPatterns.byDay[dayKey] = 0;
            }
            this.spendingPatterns.byDay[dayKey] += amount;
        });

        console.log('Transaction analysis completed:', {
            categoryAnalysis: this.categoryAnalysis,
            spendingPatterns: this.spendingPatterns
        });
    }

    categorizeTransaction(description) {
        const desc = description.toLowerCase();
        const keywords = this.config.openai.transaction_keywords || this.config.transaction_keywords;
        
        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => desc.includes(word))) {
                return category;
            }
        }
        
        return 'other';
    }

    init() {
        this.setupEventListeners();
        this.generateInitialInsights();
        this.startTypingEffect();
    }

    setupEventListeners() {
        const sendButton = document.getElementById('ai-send');
        const input = document.getElementById('ai-input');
        const generateButton = document.getElementById('generate-insights');
        const suggestions = document.getElementById('ai-suggestions');
        const regenerateBtn = document.getElementById('ai-regenerate');
        const clearBtn = document.getElementById('ai-clear');

        sendButton.addEventListener('click', () => this.handleUserMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });
        if (generateButton) {
            generateButton.addEventListener('click', () => {
                this.generateInsights();
                input.value = 'Generate new insights based on my recent transactions and spending patterns.';
                this.handleUserMessage();
            });
        }

        if (suggestions) {
            suggestions.addEventListener('click', (e) => {
                const target = e.target;
                if (target && target.dataset && target.dataset.suggest) {
                    input.value = target.dataset.suggest;
                    this.handleUserMessage();
                }
            });
        }

        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.regenerateLast());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }
    }

    async handleUserMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator and disable controls
        this.setControlsEnabled(false);
        const streamId = this.showTypingIndicator();

        // Decide source of response: OpenAI if configured, otherwise local analysis
        let full;
        try {
            if (this.isOpenAIEnabled()) {
                full = await this.callOpenAI(message, {
                    totalIncome: this.totalIncome,
                    totalExpense: this.totalExpense,
                    cashIncome: this.cashIncome,
                    cashExpense: this.cashExpense,
                    onlineIncome: this.onlineIncome,
                    onlineExpense: this.onlineExpense,
                    categoryAnalysis: this.categoryAnalysis
                });
            } else {
                full = this.generateAIResponse(message);
            }
        } catch (e) {
            console.error('AI error:', e);
            full = this.generateAIResponse(message);
        }

        await this.streamBotMessage(full, streamId);
        this.setControlsEnabled(true);
        this.saveChatToStorage();
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('ai-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-${sender}`;

        const avatar = sender === 'bot' ? '🤖' : '👤';
        messageDiv.innerHTML = `
            <div class="ai-avatar">${avatar}</div>
            <div class="ai-content">
                <p>${message}</p>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageDiv;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-bot typing';
        typingDiv.id = `typing-indicator-${Date.now()}`;
        typingDiv.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv.id;
    }

    hideTypingIndicator(id) {
        const typingIndicator = document.getElementById(id);
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Analyze spending patterns
        if (message.includes('spending') || message.includes('expense') || message.includes('cost')) {
            return this.analyzeSpending();
        }
        
        // Income analysis
        if (message.includes('income') || message.includes('earn') || message.includes('salary')) {
            return this.analyzeIncome();
        }
        
        // Budget analysis
        if (message.includes('budget') || message.includes('save') || message.includes('financial health')) {
            return this.analyzeBudget();
        }
        
        // Cash vs online comparison
        if (message.includes('cash') || message.includes('online') || message.includes('digital')) {
            return this.analyzePaymentMethods();
        }
        
        // General advice
        if (message.includes('advice') || message.includes('recommend') || message.includes('suggestion')) {
            return this.generateAdvice();
        }
        
        // Default response
        return this.generateDefaultResponse(userMessage);
    }

    analyzeSpending() {
        const savingsRate = ((this.totalIncome - this.totalExpense) / this.totalIncome * 100).toFixed(1);
        
        // Get top spending categories
        const categories = Object.entries(this.categoryAnalysis)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 3)
            .map(([cat, data]) => `${cat} ($${data.total.toFixed(2)})`)
            .join(', ');
        
        let analysis = `📊 **Detailed Spending Analysis**\n\n`;
        analysis += `💰 **Total Expenses**: $${this.totalExpense.toFixed(2)}\n`;
        analysis += `📈 **Savings Rate**: ${savingsRate}%\n`;
        analysis += `🏷️ **Top Categories**: ${categories}\n\n`;
        
        // Category insights
        const topCategory = Object.entries(this.categoryAnalysis)[0];
        if (topCategory) {
            const [category, data] = topCategory;
            const percentage = (data.total / this.totalExpense * 100).toFixed(1);
            analysis += `🎯 **Highest Spending**: ${category} - $${data.total.toFixed(2)} (${percentage}% of total)\n`;
        }
        
        // Payment method analysis
        const cashPercentage = (this.spendingPatterns.byMethod.cash / this.totalExpense * 100).toFixed(1);
        const onlinePercentage = (this.spendingPatterns.byMethod.online / this.totalExpense * 100).toFixed(1);
        analysis += `💳 **Payment Methods**: Cash ${cashPercentage}% | Digital ${onlinePercentage}%\n\n`;
        
        // Recommendations based on analysis
        if (savingsRate < 20) {
            analysis += `⚠️ **Budget Alert**: Savings rate below 20%. Focus on reducing discretionary spending.`;
        } else if (savingsRate > 30) {
            analysis += `🌟 **Excellent**: Strong savings rate! Consider investment opportunities.`;
        } else {
            analysis += `✅ **Good Progress**: Maintain current spending discipline.`;
        }
        
        return analysis;
    }

    analyzeIncome() {
        const cashPercentage = (this.cashIncome / this.totalIncome * 100).toFixed(1);
        const onlinePercentage = (this.onlineIncome / this.totalIncome * 100).toFixed(1);
        
        let analysis = `Income Analysis:\n\n`;
        analysis += `💰 **Total Income**: $${this.totalIncome.toFixed(2)}\n`;
        analysis += `💵 **Cash Income**: $${this.cashIncome.toFixed(2)} (${cashPercentage}%)\n`;
        analysis += `💻 **Online Income**: $${this.onlineIncome.toFixed(2)} (${onlinePercentage}%)\n\n`;
        
        if (this.cashIncome > this.onlineIncome) {
            analysis += `💡 **Pattern**: You earn more through cash transactions. This might be from freelance work, tips, or cash-based business.`;
        } else {
            analysis += `💡 **Pattern**: You earn more through digital channels. This suggests stable employment or online business.`;
        }
        
        return analysis;
    }

    analyzeBudget() {
        const netBalance = this.totalIncome - this.totalExpense;
        const expenseRatio = (this.totalExpense / this.totalIncome * 100).toFixed(1);
        
        let analysis = `Budget Health Check:\n\n`;
        analysis += `📊 **Net Balance**: $${netBalance.toFixed(2)}\n`;
        analysis += `📈 **Expense Ratio**: ${expenseRatio}%\n\n`;
        
        if (netBalance > 0) {
            analysis += `✅ **Status**: You're in the green! You have a positive cash flow.`;
        } else {
            analysis += `⚠️ **Status**: You're spending more than you earn. Consider reducing expenses.`;
        }
        
        if (expenseRatio < 70) {
            analysis += `\n🎯 **Recommendation**: Excellent expense management! You're spending less than 70% of your income.`;
        } else if (expenseRatio < 90) {
            analysis += `\n🎯 **Recommendation**: Good expense control. Consider finding ways to save more.`;
        } else {
            analysis += `\n🎯 **Recommendation**: High expense ratio. Focus on reducing non-essential spending.`;
        }
        
        return analysis;
    }

    analyzePaymentMethods() {
        const cashTotal = this.cashIncome - this.cashExpense;
        const onlineTotal = this.onlineIncome - this.onlineExpense;
        
        let analysis = `Payment Method Analysis:\n\n`;
        analysis += `💵 **Cash Flow**: $${cashTotal.toFixed(2)}\n`;
        analysis += `💻 **Digital Flow**: $${onlineTotal.toFixed(2)}\n\n`;
        
        if (Math.abs(cashTotal) > Math.abs(onlineTotal)) {
            analysis += `💡 **Insight**: Cash transactions have a bigger impact on your finances.`;
        } else {
            analysis += `💡 **Insight**: Digital transactions dominate your financial activity.`;
        }
        
        analysis += `\n📱 **Tip**: Consider using budgeting apps to track both cash and digital expenses more effectively.`;
        
        return analysis;
    }

    generateAdvice() {
        const savingsRate = ((this.totalIncome - this.totalExpense) / this.totalIncome * 100).toFixed(1);
        
        let advice = `Personalized Financial Advice:\n\n`;
        
        if (savingsRate > 30) {
            advice += `🌟 **Excellent work!** You're saving over 30% of your income.\n`;
            advice += `💡 Consider investing your savings for long-term growth.`;
        } else if (savingsRate > 15) {
            advice += `👍 **Good progress!** You're building a solid savings foundation.\n`;
            advice += `💡 Try to increase your savings rate by 5% each month.`;
        } else {
            advice += `🎯 **Focus area**: Building your savings should be a priority.\n`;
            advice += `💡 Start with a 10% savings goal and gradually increase.`;
        }
        
        advice += `\n\n📊 **Quick Wins**:\n`;
        advice += `• Review recurring subscriptions\n`;
        advice += `• Set up automatic savings transfers\n`;
        advice += `• Track all expenses for 30 days\n`;
        advice += `• Create an emergency fund (3-6 months expenses)`;
        
        return advice;
    }

    generateDefaultResponse(message) {
        // Try to provide a contextual response based on available data
        const categoryCount = Object.keys(this.categoryAnalysis).length;
        const totalTransactions = this.transactions.length;
        
        let response = "I can help you analyze your financial data. ";
        
        if (totalTransactions > 0) {
            response += `I've analyzed ${totalTransactions} transactions across ${categoryCount} categories. `;
        }
        
        response += "You can ask me about:\n\n";
        response += "• Spending patterns and categories\n";
        response += "• Income analysis\n";
        response += "• Budget health and savings rate\n";
        response += "• Payment methods (cash vs digital)\n";
        response += "• Financial recommendations\n\n";
        response += "What would you like to know?";
        
        return response;
    }

    isOpenAIEnabled() {
        try {
            return !!(this.config && this.config.openai && this.config.openai.api_key);
        } catch (_) {
            return false;
        }
    }

    async callOpenAI(userMessage, context) {
        const key = this.config.openai.api_key;
        const model = this.config.openai.model || 'gpt-3.5-turbo';
        const temperature = this.config.openai.temperature ?? 0.7;
        const max_tokens = this.config.openai.max_tokens ?? 500;
        const system_prompt = this.config.openai.system_prompt || 'You are an expert financial advisor AI assistant.';

        const messages = [
            { role: 'system', content: `${system_prompt}\nAlways keep advice practical and concise.` },
            { role: 'user', content: `Question: ${userMessage}\n\nFinancial Context:\n- Total Income: $${context.totalIncome}\n- Total Expenses: $${context.totalExpense}\n- Cash Income: $${context.cashIncome}\n- Cash Expenses: $${context.cashExpense}\n- Online Income: $${context.onlineIncome}\n- Online Expenses: $${context.onlineExpense}\n- Categories: ${JSON.stringify(context.categoryAnalysis)}` }
        ];

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens
            })
        });

        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`OpenAI error ${resp.status}: ${text}`);
        }
        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        return content || 'I could not generate a response right now.';
    }

    generateInitialInsights() {
        // Generate insights based on current data
        setTimeout(() => {
            this.updateInsightCard('spending-trend', this.getSpendingTrend());
            this.updateInsightCard('top-category', this.getTopCategory());
            this.updateInsightCard('budget-health', this.getBudgetHealth());
            this.updateInsightCard('ai-recommendation', this.getRecommendation());
        }, 2000);
    }

    generateInsights() {
        const cards = ['spending-trend', 'top-category', 'budget-health', 'ai-recommendation'];
        const functions = [this.getSpendingTrend, this.getTopCategory, this.getBudgetHealth, this.getRecommendation];
        
        cards.forEach((cardId, index) => {
            this.updateInsightCard(cardId, 'Generating...');
            setTimeout(() => {
                this.updateInsightCard(cardId, functions[index].call(this));
            }, (index + 1) * 500);
        });
    }

    updateInsightCard(cardId, content) {
        const element = document.getElementById(cardId);
        if (element) {
            element.textContent = content;
        }
    }

    getSpendingTrend() {
        if (this.totalExpense === 0) return "No spending data available";
        
        const savingsRate = ((this.totalIncome - this.totalExpense) / this.totalIncome * 100).toFixed(1);
        const topCategory = Object.entries(this.categoryAnalysis)[0];
        
        if (topCategory) {
            const [category, data] = topCategory;
            const percentage = (data.total / this.totalExpense * 100).toFixed(1);
            return `${category} dominates spending (${percentage}%). Savings rate: ${savingsRate}%`;
        }
        
        return `Savings rate: ${savingsRate}%. ${savingsRate > 20 ? 'Excellent control' : 'Consider reducing expenses'}`;
    }

    getTopCategory() {
        const categories = Object.entries(this.categoryAnalysis)
            .sort((a, b) => b[1].total - a[1].total);
        
        if (categories.length > 0) {
            const [category, data] = categories[0];
            return `${category}: $${data.total.toFixed(2)} (${data.count} transactions)`;
        }
        
        return "No transaction categories identified";
    }

    getBudgetHealth() {
        const netBalance = this.totalIncome - this.totalExpense;
        const expenseRatio = (this.totalExpense / this.totalIncome * 100).toFixed(1);
        
        if (netBalance > 1000) {
            return `Strong positive flow: +$${netBalance.toFixed(2)}. Expense ratio: ${expenseRatio}%`;
        } else if (netBalance > 0) {
            return `Positive balance: +$${netBalance.toFixed(2)}. Expense ratio: ${expenseRatio}%`;
        } else {
            return `Negative flow: -$${Math.abs(netBalance).toFixed(2)}. Expense ratio: ${expenseRatio}%`;
        }
    }

    getRecommendation() {
        const savingsRate = (this.totalIncome - this.totalExpense) / this.totalIncome * 100;
        const topCategory = Object.entries(this.categoryAnalysis)[0];
        
        if (savingsRate < 10) {
            return "Start with 10% automatic savings. Review discretionary spending.";
        } else if (savingsRate < 20) {
            const categoryAdvice = topCategory ? `Consider reducing ${topCategory[0]} expenses.` : '';
            return `Increase savings to 20%. ${categoryAdvice}`;
        } else {
            return "Excellent savings! Consider investment options and emergency fund.";
        }
    }

    startTypingEffect() {
        // Add some initial typing effect for the welcome message
        setTimeout(() => {
            this.addMessage("I can also help you with specific questions about your financial data. Try asking me about your spending patterns, income sources, or budget health!", 'bot');
        }, 3000);
    }
}

// Initialize AI agent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // The template sets window.transactionData and related totals.
    // Just initialize the AI agent.
    window.aiAgent = new AIFinancialAgent();
});
