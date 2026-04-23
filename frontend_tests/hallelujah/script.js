document.addEventListener('DOMContentLoaded', function() {
    // Existing sidebar functionality
    const sidebarOptions = document.querySelectorAll('.sidebar-option');
    const contentDivs = document.querySelectorAll('.content');

    sidebarOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionValue = this.getAttribute('data-option');
            sidebarOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            contentDivs.forEach(div => div.classList.remove('active'));
            const targetContent = document.getElementById(`${optionValue}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            // Call renderAnalytics when analytics tab is clicked
            if (optionValue === 'analytics') {
                renderAnalytics();
            }
        });
    });

    // Plus button functionality for adding more exercise fields
    const plusButton = document.getElementById('plus-button');
    if (plusButton) {
        plusButton.addEventListener('click', function() {
            const additionalFieldsDiv = document.getElementById('additional-fields');
            const newGroup = document.createElement('div');
            newGroup.className = 'form-group';
            newGroup.innerHTML = `
                <label>Exercise Name:</label>
                <input type="text" class="exercise-input" placeholder="Exercise Name">
                <label>Sets:</label>
                <input type="number" class="sets-input" min="1" placeholder="Sets">
                <label>Reps:</label>
                <input type="number" class="reps-input" min="1" placeholder="Reps">
                <label>Weight (kg/lbs):</label>
                <input type="number" class="weight-input" min="0" step="0.1" placeholder="Weight">
                <span class="error-message"></span>
            `; // Added error span for additional fields
            additionalFieldsDiv.appendChild(newGroup);
        });
    }

    // Validation functions for Step 10: display errors in spans
    function validateTrainingForm() {
        let isValid = true;
        // Clear previous errors
        document.querySelectorAll('#training-form .error-message').forEach(span => span.textContent = '');
        
        const exerciseName = document.getElementById('exercise_name').value.trim();
        const sets = parseInt(document.getElementById('sets').value);
        const reps = parseInt(document.getElementById('reps').value);
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        
        if (!exerciseName) {
            document.getElementById('exercise_name_error').textContent = 'Exercise name is required.';
            isValid = false;
        }
        if (isNaN(sets) || sets <= 0) {
            document.getElementById('sets_error').textContent = 'Sets must be a positive number.';
            isValid = false;
        }
        if (isNaN(reps) || reps <= 0) {
            document.getElementById('reps_error').textContent = 'Reps must be a positive number.';
            isValid = false;
        }
        if (weight < 0) {
            document.getElementById('weight_error').textContent = 'Weight cannot be negative.';
            isValid = false;
        }
        return isValid;
    }

    function validateDietForm() {
        let isValid = true;
        // Clear previous errors
        document.querySelectorAll('#diet-form .error-message').forEach(span => span.textContent = '');
        
        const mealName = document.getElementById('meal_name').value.trim();
        const calories = parseFloat(document.getElementById('calories').value) || 0;
        const protein = parseFloat(document.getElementById('protein').value) || 0;
        const carbs = parseFloat(document.getElementById('carbs').value) || 0;
        const fat = parseFloat(document.getElementById('fat').value) || 0;
        
        if (!mealName) {
            document.getElementById('meal_name_error').textContent = 'Meal name is required.';
            isValid = false;
        }
        if (isNaN(calories) || calories < 0) {
            document.getElementById('calories_error').textContent = 'Calories must be a non-negative number.';
            isValid = false;
        }
        if (protein < 0 || carbs < 0 || fat < 0) {
            if (protein < 0) document.getElementById('protein_error').textContent = 'Protein must be non-negative.';
            if (carbs < 0) document.getElementById('carbs_error').textContent = 'Carbs must be non-negative.';
            if (fat < 0) document.getElementById('fat_error').textContent = 'Fat must be non-negative.';
            isValid = false;
        }
        return isValid;
    }

    // Save button functionality for training with validation
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            if (!validateTrainingForm()) {
                return; // Stop if validation fails
            }

            // Collect main exercise data
            const exerciseName = document.getElementById('exercise_name').value;
            const sets = document.getElementById('sets').value;
            const reps = document.getElementById('reps').value;
            const weight = document.getElementById('weight').value;

            // Collect additional exercises
            const additionalExercises = [];
            const additionalGroups = document.querySelectorAll('#additional-fields .form-group');
            additionalGroups.forEach(group => {
                const inputs = group.querySelectorAll('input');
                if (inputs.length >= 4) {
                    const exName = inputs[0].value;
                    const exSets = inputs[1].value;
                    const exReps = inputs[2].value;
                    const exWeight = inputs[3].value;
                    if (exName || exSets || exReps || exWeight) {
                        additionalExercises.push({
                            exercise_name: exName,
                            sets: exSets,
                            reps: exReps,
                            weight: exWeight
                        });
                    }
                }
            });

            // Create training data object
            const trainingData = {
                mainExercise: {
                    exercise_name: exerciseName,
                    sets: sets,
                    reps: reps,
                    weight: weight
                },
                additionalExercises: additionalExercises,
                timestamp: new Date().toISOString() // Add timestamp for analytics
            };

            // Save to localStorage as an array for multiple entries
            let trainingEntries = JSON.parse(localStorage.getItem('trainingData')) || [];
            trainingEntries.push(trainingData);
            try {
                localStorage.setItem('trainingData', JSON.stringify(trainingEntries));
                console.log('Training data saved to localStorage:', trainingData);
                alert('Training data saved successfully!'); // Keep alert for success, but can change if needed
                // Clear form on success
                document.getElementById('training-form').reset();
                document.getElementById('additional-fields').innerHTML = '';
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                alert('Failed to save data. Please try again.');
            }
        });
    }

    // Clear button functionality for training
    const clearButton = document.getElementById('clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            // Reset the form inputs
            document.getElementById('training-form').reset();
            // Clear additional fields
            const additionalFieldsDiv = document.getElementById('additional-fields');
            additionalFieldsDiv.innerHTML = '';
            // Clear error messages
            document.querySelectorAll('#training-form .error-message').forEach(span => span.textContent = '');
            alert('Training form cleared.');
        });
    }

    // Save button functionality for diet with validation
    const saveDietButton = document.getElementById('save-diet-button');
    if (saveDietButton) {
        saveDietButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            if (!validateDietForm()) {
                return; // Stop if validation fails
            }

            // Collect diet data
            const mealName = document.getElementById('meal_name').value;
            const calories = document.getElementById('calories').value;
            const protein = document.getElementById('protein').value;
            const carbs = document.getElementById('carbs').value;
            const fat = document.getElementById('fat').value;

            // Create diet data object
            const dietData = {
                meal_name: mealName,
                calories: calories,
                protein: protein,
                carbs: carbs,
                fat: fat,
                timestamp: new Date().toISOString() // Add timestamp for analytics
            };

            // Save to localStorage as an array for multiple entries
            let dietEntries = JSON.parse(localStorage.getItem('dietData')) || [];
            dietEntries.push(dietData);
            try {
                localStorage.setItem('dietData', JSON.stringify(dietEntries));
                console.log('Diet data saved to localStorage:', dietData);
                alert('Diet data saved successfully!');
                // Clear form on success
                document.getElementById('diet-form').reset();
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                alert('Failed to save data. Please try again.');
            }
        });
    }

    // Clear button functionality for diet
    const clearDietButton = document.getElementById('clear-diet-button');
    if (clearDietButton) {
        clearDietButton.addEventListener('click', function() {
            // Reset the diet form inputs
            document.getElementById('diet-form').reset();
            // Clear error messages
            document.querySelectorAll('#diet-form .error-message').forEach(span => span.textContent = '');
            alert('Diet form cleared.');
        });
    }

    // Chart instances to manage for re-rendering
    let trainingChart = null;
    let dietChart = null;

    // Function to calculate and render analytics data for Step 6 and charts for Steps 3-4
    function renderAnalytics() {
        // Fetch CSS variables for chart colors as per plan instruction 4
        const chartPrimary = getComputedStyle(document.documentElement).getPropertyValue('--chart-primary').trim();
        const chartSecondary = getComputedStyle(document.documentElement).getPropertyValue('--chart-secondary').trim();
        const chartAccent = getComputedStyle(document.documentElement).getPropertyValue('--chart-accent').trim();
        
        const trainingSummaryDiv = document.getElementById('training-summary');
        const dietSummaryDiv = document.getElementById('diet-summary');
        const chartsDiv = document.getElementById('charts');
        
        if (!trainingSummaryDiv || !dietSummaryDiv || !chartsDiv) return;
        
        // Fetch data from localStorage
        const trainingEntries = JSON.parse(localStorage.getItem('trainingData')) || [];
        const dietEntries = JSON.parse(localStorage.getItem('dietData')) || [];
        
        // Calculate training summary
        let totalTrainingEntries = trainingEntries.length;
        let totalSets = 0;
        let totalReps = 0;
        let totalWeight = 0;
        trainingEntries.forEach(entry => {
            totalSets += parseInt(entry.mainExercise.sets) || 0;
            totalReps += parseInt(entry.mainExercise.reps) || 0;
            totalWeight += parseFloat(entry.mainExercise.weight) || 0;
            entry.additionalExercises.forEach(add => {
                totalSets += parseInt(add.sets) || 0;
                totalReps += parseInt(add.reps) || 0;
                totalWeight += parseFloat(add.weight) || 0;
            });
        });
        
        // Calculate diet summary
        let totalDietEntries = dietEntries.length;
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        dietEntries.forEach(entry => {
            totalCalories += parseFloat(entry.calories) || 0;
            totalProtein += parseFloat(entry.protein) || 0;
            totalCarbs += parseFloat(entry.carbs) || 0;
            totalFat += parseFloat(entry.fat) || 0;
        });
        
        // Update summary DOM
        trainingSummaryDiv.innerHTML = `<h3>Training Summary</h3>
            <p>Total Entries: ${totalTrainingEntries}</p>
            <p>Total Sets: ${totalSets}</p>
            <p>Total Reps: ${totalReps}</p>
            <p>Total Weight (kg/lbs): ${totalWeight.toFixed(1)}</p>`;
        
        dietSummaryDiv.innerHTML = `<h3>Diet Summary</h3>
            <p>Total Meals: ${totalDietEntries}</p>
            <p>Total Calories: ${totalCalories.toFixed(0)}</p>
            <p>Total Protein: ${totalProtein.toFixed(1)}g</p>
            <p>Total Carbs: ${totalCarbs.toFixed(1)}g</p>
            <p>Total Fat: ${totalFat.toFixed(1)}g</p>`;
        
        // Clear previous charts if they exist
        if (trainingChart) {
            trainingChart.destroy();
        }
        if (dietChart) {
            dietChart.destroy();
        }
        
        // Step 3: Create bar chart for training data using CSS variables
        const trainingCtx = document.getElementById('training-chart').getContext('2d');
        if (totalTrainingEntries > 0) {
            trainingChart = new Chart(trainingCtx, {
                type: 'bar',
                data: {
                    labels: ['Total Sets', 'Total Reps', 'Total Weight'],
                    datasets: [{
                        label: 'Training Totals',
                        data: [totalSets, totalReps, totalWeight],
                        backgroundColor: [chartPrimary + '80', chartSecondary + '80', chartAccent + '80'],
                        borderColor: [chartPrimary, chartSecondary, chartAccent],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            trainingCtx.clearRect(0, 0, trainingCtx.canvas.width, trainingCtx.canvas.height);
            trainingCtx.fillText('No training data available', 10, 50);
        }
        
        // Step 4: Create pie chart for diet macronutrients using CSS variables
        const dietCtx = document.getElementById('diet-chart').getContext('2d');
        if (totalDietEntries > 0 && (totalProtein > 0 || totalCarbs > 0 || totalFat > 0)) {
            dietChart = new Chart(dietCtx, {
                type: 'pie',
                data: {
                    labels: ['Protein', 'Carbs', 'Fat'],
                    datasets: [{
                        data: [totalProtein, totalCarbs, totalFat],
                        backgroundColor: [chartPrimary + '80', chartSecondary + '80', chartAccent + '80'],
                        borderColor: [chartPrimary, chartSecondary, chartAccent],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.parsed + 'g';
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            dietCtx.clearRect(0, 0, dietCtx.canvas.width, dietCtx.canvas.height);
            dietCtx.fillText('No diet data available', 10, 50);
        }
    }

    // Step 7: Event listener for export data button
    const exportButton = document.getElementById('export-data-btn');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            const trainingData = JSON.parse(localStorage.getItem('trainingData')) || [];
            const dietData = JSON.parse(localStorage.getItem('dietData')) || [];
            const allData = {
                trainingData: trainingData,
                dietData: dietData
            };
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tracker_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        });
    }

    // Step 9: Event listener for clear all data button
    const clearAllButton = document.getElementById('clear-all-btn');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                localStorage.removeItem('trainingData');
                localStorage.removeItem('dietData');
                alert('All data cleared successfully!');
                // Reset analytics display
                renderAnalytics(); // This will update the charts and summaries
            }
        });
    }

    // Initial call to render analytics on page load if analytics is active
    const activeContent = document.querySelector('.content.active');
    if (activeContent && activeContent.id === 'analytics-content') {
        renderAnalytics();
    }
});