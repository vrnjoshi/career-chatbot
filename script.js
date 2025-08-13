document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('chat-input');
  const outputDiv = document.getElementById('chat-output');

  inputField.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const userInput = inputField.value.trim();

      if (userInput === '') {
        return;
      }

      outputDiv.innerHTML = 'Thinking...';
      inputField.value = '';

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: userInput }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        outputDiv.innerHTML = data.response;

      } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = 'Sorry, an error occurred.';
      }
    }
  });
});