// Bismillahir Rahmanir Rahim
// Shared Quiz Engine for Islamic Hub - Improved Version

class QuizEngine {
    constructor(questions, quizContainerId, resultsContainerId) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.answerSubmitted = false;
        this.quizContainer = document.getElementById(quizContainerId);
        this.resultsContainer = document.getElementById(resultsContainerId);
    }
    
    start() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.answerSubmitted = false;
        this.showQuestion();
    }
    
    showQuestion() {
        if (!this.quizContainer) return;
        
        const q = this.questions[this.currentQuestionIndex];
        if (!q) {
            this.showResults();
            return;
        }
        
        let html = `
            <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border: 1px solid #E2DDD3;">
                <div style="background: #1F4A3A; color: #D4A373; padding: 0.3rem 0.8rem; border-radius: 20px; display: inline-block; margin-bottom: 1rem;">
                    Question ${this.currentQuestionIndex + 1} of ${this.questions.length}
                </div>
                <p style="font-size: 1.2rem; margin: 1rem 0; font-weight: bold;">${q.text}</p>
                <div style="margin: 1rem 0;" id="optionsContainer">
        `;
        
        for (let i = 0; i < q.options.length; i++) {
            const letter = String.fromCharCode(65 + i); // A, B, C, D
            html += `
                <label style="display: block; margin: 0.5rem 0; padding: 0.75rem; background: #F9F6F0; border-radius: 8px; cursor: pointer; border: 1px solid #E2DDD3;">
                    <input type="radio" name="answer" value="${i}" style="margin-right: 12px;">
                    <strong>${letter}.</strong> ${q.options[i]}
                </label>
            `;
        }
        
        html += `
                </div>
                <div id="feedback" style="margin-top: 1rem; padding: 0.75rem; border-radius: 8px; display: none;"></div>
                <div id="hintBox" style="margin-top: 0.5rem; font-size: 0.9rem; color: #666; display: none;"></div>
                <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button id="submitBtn" style="background: #2C5F2D; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer;">✅ Submit Answer</button>
                    <button id="hintBtn" style="background: #D4A373; color: #1F4A3A; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer;">💡 Hint</button>
                    <button id="nextBtn" style="background: #1F4A3A; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; display: none;">➡️ Next Question</button>
                </div>
            </div>
        `;
        
        this.quizContainer.innerHTML = html;
        
        // Bind events
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            const radios = document.querySelectorAll('input[name="answer"]');
            if (radios[this.userAnswers[this.currentQuestionIndex]]) {
                radios[this.userAnswers[this.currentQuestionIndex]].checked = true;
            }
            this.answerSubmitted = true;
            document.getElementById('submitBtn').style.display = 'none';
            document.getElementById('nextBtn').style.display = 'inline-block';
            this.showSavedFeedback();
        }
    }
    
    submitAnswer() {
        if (this.answerSubmitted) {
            return;
        }
        
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            document.getElementById('feedback').innerHTML = '<span style="color: #D4A373;">⚠️ Please select an answer.</span>';
            document.getElementById('feedback').style.display = 'block';
            return;
        }
        
        const answerIndex = parseInt(selected.value);
        const q = this.questions[this.currentQuestionIndex];
        const isCorrect = (answerIndex === q.correct);
        
        if (isCorrect) {
            this.score++;
            document.getElementById('feedback').innerHTML = `
                <span style="color: #2C5F2D;">✅ <strong>Correct!</strong></span><br>
                <span style="font-size: 0.95rem;">${q.explanation || ''}</span>
            `;
        } else {
            const correctAnswerText = q.options[q.correct];
            const letter = String.fromCharCode(65 + q.correct);
            document.getElementById('feedback').innerHTML = `
                <span style="color: #D4A373;">❌ <strong>Incorrect.</strong></span><br>
                <span>The correct answer is: <strong>${letter}. ${correctAnswerText}</strong></span><br>
                <span style="font-size: 0.95rem;">${q.explanation || ''}</span>
            `;
        }
        
        document.getElementById('feedback').style.display = 'block';
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        this.answerSubmitted = true;
        
        // Hide submit button, show next button
        document.getElementById('submitBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
    
    showSavedFeedback() {
        const q = this.questions[this.currentQuestionIndex];
        const answerIndex = this.userAnswers[this.currentQuestionIndex];
        const isCorrect = (answerIndex === q.correct);
        
        if (isCorrect) {
            document.getElementById('feedback').innerHTML = `
                <span style="color: #2C5F2D;">✅ <strong>Correct! (Previously answered)</strong></span><br>
                <span style="font-size: 0.95rem;">${q.explanation || ''}</span>
            `;
        } else {
            const correctAnswerText = q.options[q.correct];
            const letter = String.fromCharCode(65 + q.correct);
            document.getElementById('feedback').innerHTML = `
                <span style="color: #D4A373;">❌ <strong>Incorrect. (Previously answered)</strong></span><br>
                <span>The correct answer is: <strong>${letter}. ${correctAnswerText}</strong></span><br>
                <span style="font-size: 0.95rem;">${q.explanation || ''}</span>
            `;
        }
        document.getElementById('feedback').style.display = 'block';
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex + 1 < this.questions.length) {
            this.currentQuestionIndex++;
            this.answerSubmitted = false;
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    showHint() {
        const q = this.questions[this.currentQuestionIndex];
        const hintBox = document.getElementById('hintBox');
        if (q.hint) {
            hintBox.innerHTML = `💡 <strong>Hint:</strong> ${q.hint}`;
            hintBox.style.display = 'block';
        } else {
            hintBox.innerHTML = `💡 No hint available. Think about what you learned in the Hajj levels.`;
            hintBox.style.display = 'block';
        }
        setTimeout(() => {
            hintBox.style.opacity = '0.5';
            setTimeout(() => {
                hintBox.style.display = 'none';
                hintBox.style.opacity = '1';
            }, 3000);
        }, 5000);
    }
    
    showResults() {
        const percentage = (this.score / this.questions.length) * 100;
        let grade = '';
        let advice = '';
        let backgroundColor = '';
        
        if (percentage >= 90) {
            grade = 'Excellent! 🌟';
            advice = 'You have mastered Hajj knowledge. Consider teaching others or reviewing the advanced section for deeper insights.';
            backgroundColor = '#2C5F2D';
        } else if (percentage >= 70) {
            grade = 'Good! 📚';
            advice = 'You have solid understanding. Review the intermediate and advanced sections to strengthen weak areas.';
            backgroundColor = '#1F4A3A';
        } else if (percentage >= 50) {
            grade = 'Fair. 🤔';
            advice = 'We recommend reviewing the basic and intermediate levels, then retake this quiz.';
            backgroundColor = '#D4A373';
        } else {
            grade = 'Needs improvement. 📖';
            advice = 'Please study the basic level first (Hajj: Basic Level), then try again. The knowledge is essential for your spiritual journey.';
            backgroundColor = '#8B4513';
        }
        
        let html = `
            <div style="background: ${backgroundColor}; color: white; padding: 2rem; border-radius: 12px; text-align: center; margin-top: 1rem;">
                <h2>📊 Quiz Results</h2>
                <p style="font-size: 3rem; margin: 1rem 0; font-weight: bold;">${this.score} / ${this.questions.length}</p>
                <p style="font-size: 1.5rem;">${grade}</p>
                <p style="margin-top: 1rem;">${advice}</p>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="retryBtn" style="background: #D4A373; color: #1F4A3A; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold;">⟳ Retry Quiz</button>
                    <button id="reviewBtn" style="background: white; color: ${backgroundColor}; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold;">📖 Review Basic Level</button>
                </div>
            </div>
        `;
        
        this.quizContainer.innerHTML = html;
        if (this.resultsContainer) {
            this.resultsContainer.innerHTML = '';
        }
        
        document.getElementById('retryBtn')?.addEventListener('click', () => {
            this.start();
        });
        document.getElementById('reviewBtn')?.addEventListener('click', () => {
            window.location.href = 'basic.html';
        });
    }
}
