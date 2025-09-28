const API_BASE = 'http://localhost:5000';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
});

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const data = await response.json();

        document.getElementById('modelStatus').textContent =
            data.model_trained ? 'Trained & Ready' : 'Not Trained';
        document.getElementById('modelType').textContent = data.model_type;

    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('modelStatus').textContent = 'Error loading';
    }
}

async function checkNews() {
    const text = document.getElementById('newsText').value.trim();

    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }

    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        displayResult(result);

    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing text: ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function checkBatchNews() {
    const batchText = document.getElementById('batchText').value.trim();

    if (!batchText) {
        alert('Please enter some texts to analyze.');
        return;
    }

    const texts = batchText.split('\n').filter(text => text.trim());

    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/batch_predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ texts: texts })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        displayBatchResults(result);

    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing texts: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function displayResult(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsDiv = document.getElementById('results');

    const prediction = result.prediction;
    const isFake = prediction.label === 'FAKE';

    resultsDiv.innerHTML = `
        <div class="result-card ${isFake ? 'result-fake' : 'result-real'}">
            <h3>${isFake ? '🚨 POTENTIALLY FAKE NEWS' : '✅ LIKELY REAL NEWS'}</h3>
            <p><strong>Confidence:</strong> ${(prediction.confidence * 100).toFixed(1)}%</p>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${prediction.confidence * 100}%;
                    background: ${isFake ? '#e53e3e' : '#48bb78'}"></div>
            </div>
            <p><strong>Analysis:</strong> The text appears to be <strong>${prediction.label}</strong> news
            with ${(prediction.confidence * 100).toFixed(1)}% confidence.</p>
        </div>
    `;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function displayBatchResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsDiv = document.getElementById('results');

    let html = `<h3>Batch Analysis Results (${result.total_processed} articles)</h3>`;

    result.predictions.forEach((item, index) => {
        const prediction = item.prediction;
        const isFake = prediction.label === 'FAKE';
        const shortText = item.text.length > 100 ? item.text.substring(0, 100) + '...' : item.text;

        html += `
            <div class="result-card ${isFake ? 'result-fake' : 'result-real'}">
                <h4>Article ${index + 1}: ${isFake ? '🚨 FAKE' : '✅ REAL'}</h4>
                <p><strong>Text:</strong> ${shortText}</p>
                <p><strong>Confidence:</strong> ${(prediction.confidence * 100).toFixed(1)}%</p>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${prediction.confidence * 100}%;
                        background: ${isFake ? '#e53e3e' : '#48bb78'}"></div>
                </div>
            </div>
        `;
    });

    resultsDiv.innerHTML = html;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

async function trainModel() {
    if (!confirm('This will train the model with the current dataset. Continue?')) {
        return;
    }

    try {
        showLoading(true);

        const response = await fetch(`${API_BASE}/train`, {
            method: 'POST'
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        alert(`Model trained successfully! Accuracy: ${(result.accuracy * 100).toFixed(1)}%`);
        loadStats(); // Refresh stats

    } catch (error) {
        console.error('Error:', error);
        alert('Error training model: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function clearText() {
    document.getElementById('newsText').value = '';
    document.getElementById('batchText').value = '';
    document.getElementById('resultsSection').style.display = 'none';
}

function loadExample(exampleElement) {
    const text = exampleElement.querySelector('p').textContent;
    document.getElementById('newsText').value = text;
    document.getElementById('resultsSection').style.display = 'none';
}

function showLoading(show) {
    const buttons = document.querySelectorAll('button');
    const textareas = document.querySelectorAll('textarea');

    if (show) {
        document.body.classList.add('loading');
    } else {
        document.body.classList.remove('loading');
    }
}