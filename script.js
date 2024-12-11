(() => {
    // Get references to key elements
    const textArea = document.getElementById("textAreaInput");
    const frequenciesTable = document.getElementById("frequencies");
    const guessesTable = document.getElementById("guesses");
    const resultText = document.getElementById("resultText");

    // Function to calculate frequencies and update the frequencies table
    function updateFrequencies() {
        // Preprocess the text to remove newlines
        const text = textArea.value.replace(/[\r\n]+/g, ""); // Removes \n and \r

        const frequencyMap = {};

        // Clear result text if the textarea is empty
        if (text.trim() === "") {
            resultText.innerHTML = ""; // Clear result text
        }

        // Calculate frequencies
        for (const char of text) {
            frequencyMap[char] = (frequencyMap[char] || 0) + 1;
        }

        // Sort by frequency in descending order
        const sortedFrequencies = Object.entries(frequencyMap).sort(([, a], [, b]) => b - a);

        // Update the frequencies table
        const tbody = frequenciesTable.querySelector("tbody");
        tbody.innerHTML = ""; // Clear existing rows

        // Row for symbols
        const symbolRow = document.createElement("tr");
        sortedFrequencies.forEach(([symbol]) => {
            const td = document.createElement("td");
            td.innerHTML = `<b>${symbol}</b>`;
            symbolRow.appendChild(td);
        });
        tbody.appendChild(symbolRow);

        // Row for frequencies
        const frequencyRow = document.createElement("tr");
        const totalCharacters = text.length;
        sortedFrequencies.forEach(([, count]) => {
            const td = document.createElement("td");
            const percentage = ((count / totalCharacters) * 100).toFixed(2);
            td.textContent = `${percentage}%`;
            frequencyRow.appendChild(td);
        });
        tbody.appendChild(frequencyRow);

        // Update the guesses table with sorted characters
        updateGuessesTable(sortedFrequencies.map(([char]) => char));
    }

    // Function to dynamically generate the "Dine gjetninger" table
    function updateGuessesTable(sortedChars) {
        const tbody = guessesTable.querySelector("tbody");
        tbody.innerHTML = ""; // Clear existing rows

        // Row for symbols
        const symbolRow = document.createElement("tr");
        sortedChars.forEach((char) => {
            const td = document.createElement("td");
            td.innerHTML = `<b>${char}</b>`;
            symbolRow.appendChild(td);
        });
        tbody.appendChild(symbolRow);

        // Row for input fields
        const inputRow = document.createElement("tr");
        sortedChars.forEach((char) => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.className = "guess";
            input.dataset.char = char; // Store the character for reference
            input.style.width = "50px"; // Ensure compact input size
            input.maxLength = 1; // Limit input to one character
            input.addEventListener("input", updateResult); // Update result on input
            td.appendChild(input);
            inputRow.appendChild(td);
        });
        tbody.appendChild(inputRow);
    }

    // Function to update the result text dynamically
    function updateResult() {
        const text = textArea.value.replace(/[\r\n]+/g, ""); // Remove newlines
        const inputs = document.querySelectorAll("#guesses input");

        // Build a map of guesses
        const guessMap = {};
        inputs.forEach((input) => {
            // Allow empty guesses (explicit whitespace is valid)
            guessMap[input.dataset.char] = input.value;
        });

        // Generate the result text
        resultText.innerHTML = ""; // Clear existing result
        for (const char of text) {
            const mappedChar = guessMap[char];
            const span = document.createElement("span");
            if (mappedChar !== undefined && mappedChar !== "") {
                span.innerHTML = `<b>${mappedChar}</b>`; // Bold for mapped characters
            } else {
                span.textContent = char; // Plain text for unmapped characters
            }
            resultText.appendChild(span);
        }
    }

    // Attach event listener to textarea
    textArea.addEventListener("input", updateFrequencies);
})();
