// script.js

// Global variables to store data
let transactions = [];
let results = [];
let statistics = {};
let accountNotes = {};
let csvLoaded = false; // Flag to check if CSV is loaded

// DataTable instances
let resultsTable;
let detailsTable;

// Event listener for the filter form
document.getElementById('filterForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const threshold = parseFloat(document.getElementById('threshold').value);
    const minAmount = parseFloat(document.getElementById('minAmount').value);
    const csvFileInput = document.getElementById('csvFile');
    const csvFile = csvFileInput.files[0];

    if (csvFile) {
        // New CSV file selected
        // Clear previous data
        transactions = [];
        results = [];
        statistics = {};
        accountNotes = {};
        csvLoaded = false;

        // Clear previous results from DOM
        if (resultsTable) {
            resultsTable.clear().destroy();
            resultsTable = null;
        }
        $('#resultsTable tbody').empty();
        document.getElementById('resultsSection').style.display = 'none';

        // Parse the CSV file using Papa Parse
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: function (parseResults) {
                transactions = parseResults.data;
                csvLoaded = true;
                processTransactions(threshold, minAmount);
            }
        });
    } else if (csvLoaded && transactions.length > 0) {
        // CSV already loaded, recalculate data with new parameters
        // Clear previous results and statistics
        results = [];
        statistics = {};

        // Clear previous results from DOM
        if (resultsTable) {
            resultsTable.clear().destroy();
            resultsTable = null;
        }
        $('#resultsTable tbody').empty();
        document.getElementById('resultsSection').style.display = 'none';

        processTransactions(threshold, minAmount);
    } else {
        // CSV not selected and not loaded previously
        alert('Please select a CSV file.');
    }
});

// Process transactions after CSV is parsed or parameters are changed
function processTransactions(threshold, minAmount) {
    // Reset previous results and statistics
    results = [];
    statistics = {
        total_accounts: 0,
        pms_accounts: 0,
        non_pms_accounts: 0
    };
    // Do not reset accountNotes here to preserve notes when adjusting filters

    // Group all transactions by account_id
    const transactionsByAccount = {};
    transactions.forEach(txn => {
        txn.amount = parseFloat(txn.amount);
        txn.binary_confidence = parseFloat(txn.binary_confidence);
        if (!transactionsByAccount[txn.account_id]) {
            transactionsByAccount[txn.account_id] = [];
        }
        transactionsByAccount[txn.account_id].push(txn);
    });

    // Process each account
    let accountCounter = 0;
    for (let accountId in transactionsByAccount) {
        const accountTransactions = transactionsByAccount[accountId];
        accountCounter++;
        statistics.total_accounts++;

        // Apply filters to determine if account has PMS
        const filteredTransactions = accountTransactions.filter(txn => {
            return txn.amount >= minAmount && txn.binary_confidence >= threshold;
        });

        const hasPms = filteredTransactions.some(txn => txn.binary_result === 'pms');

        let accountData = {
            account_no: accountCounter.toString().padStart(5, '0'),
            account_id: accountId,
            has_pms: hasPms,
            transaction: null,
            all_transactions: accountTransactions // Store all transactions for detail display
        };

        if (hasPms) {
            statistics.pms_accounts = (statistics.pms_accounts || 0) + 1;
            // Get top PMS transaction from filtered transactions
            const pmsTransactions = filteredTransactions.filter(txn => txn.binary_result === 'pms');
            const topPmsTransaction = pmsTransactions.reduce((prev, current) => {
                return (prev.binary_confidence > current.binary_confidence) ? prev : current;
            }, pmsTransactions[0]);

            if (topPmsTransaction) {
                topPmsTransaction.amount = parseFloat(topPmsTransaction.amount);
                topPmsTransaction.binary_confidence = parseFloat(topPmsTransaction.binary_confidence);
                topPmsTransaction.pms_confidence = parseFloat(topPmsTransaction.pms_confidence);

                accountData.transaction = topPmsTransaction;
                // Parse categories properly
                let categories = parseCategories(topPmsTransaction.category);
                accountData.transaction.categories = categories.join(', ');
            }
        } else {
            statistics.non_pms_accounts = (statistics.non_pms_accounts || 0) + 1;
        }

        results.push(accountData);
    }

    // Display the results
    displayResults();
}

// Safely parse category strings
function parseCategories(categories) {
    if (!categories) return [];
    try {
        // Handle cases like "[u'Payment', u'Rent']"
        let cleanedCategories = categories.replace(/u'/g, "'").replace(/'/g, '"');
        const categoriesList = JSON.parse(cleanedCategories);
        return Array.isArray(categoriesList) ? categoriesList : [categoriesList];
    } catch (e) {
        // If JSON.parse fails, split the string manually
        return categories.replace(/[\[\]"]/g, '').split(',').map(cat => cat.trim());
    }
}

// Display the main results table
function displayResults() {
    document.getElementById('resultsSection').style.display = 'block';

    // Prepare data for DataTable
    const tableData = results.map(result => {
        const noteExists = accountNotes[result.account_id] ? true : false;
        const noteIcon = noteExists ? '📝' : '✏️';
        return {
            account_no: result.account_no,
            has_pms: result.has_pms ? 'Yes' : 'No',
            transaction_name: result.transaction ? result.transaction.transaction_name || '' : '',
            amount: result.transaction ? result.transaction.amount || '' : '',
            transaction_date: result.transaction ? result.transaction.transaction_date || '' : '',
            categories: result.transaction ? result.transaction.categories || '' : '',
            binary_confidence: result.transaction ? result.transaction.binary_confidence || '' : '',
            pms_type: result.transaction ? result.transaction.pms_type || '' : '',
            note_button: `<button class="btn btn-sm btn-outline-primary account-note-btn" data-account-id="${result.account_id}">${noteIcon} Note</button>`,
            account_id: result.account_id,
            row_class: result.has_pms ? 'table-success' : 'table-danger'
        };
    });

    // Initialize or re-initialize DataTable
    if (resultsTable) {
        resultsTable.clear().destroy();
    }

    resultsTable = $('#resultsTable').DataTable({
        data: tableData,
        columns: [
            { data: 'account_no' },
            { data: 'has_pms' },
            { data: 'transaction_name' },
            { data: 'amount' },
            { data: 'transaction_date' },
            { data: 'categories' },
            { data: 'binary_confidence' },
            { data: 'pms_type' },
            { data: 'note_button', orderable: false }
        ],
        rowCallback: function (row, data) {
            $(row).addClass(data.row_class);
            $(row).attr('data-account-id', data.account_id);
        },
        responsive: true,
        autoWidth: false,
        pageLength: 100
    });

    // Update event handlers
    $('#resultsTable tbody').off('click').on('click', 'tr', function (e) {
        // Prevent triggering when clicking on the note button
        if ($(e.target).hasClass('account-note-btn')) return;
        const accountId = $(this).data('account-id');
        showDetails(accountId);
    });

    // Event handler for note buttons
    $('.account-note-btn').off('click').on('click', function (e) {
        e.stopPropagation(); // Prevent triggering row click
        const accountId = $(this).data('account-id');
        openAccountNoteModal(accountId, $(this));
    });

    // Enable the Statistics and Export buttons
    $('#showStatsBtn').prop('disabled', false);
    $('#exportBtn').prop('disabled', false);
}

// Show details of transactions for the selected account
function showDetails(accountId) {
    // Get threshold and minAmount from main screen
    const mainThreshold = parseFloat(document.getElementById('threshold').value);
    const mainMinAmount = parseFloat(document.getElementById('minAmount').value);

    // Use all transactions from the account
    const accountData = results.find(result => result.account_id === accountId);
    const accountTransactions = accountData ? accountData.all_transactions : [];

    // Set default values for filters in modal
    $('#modalThreshold').val(mainThreshold);
    $('#modalMinAmount').val(mainMinAmount);

    // Function to filter and display transactions in modal
    function filterAndDisplayTransactions() {
        const threshold = parseFloat($('#modalThreshold').val());
        const minAmount = parseFloat($('#modalMinAmount').val());

        const filteredTransactions = accountTransactions.filter(txn => {
            const amount = parseFloat(txn.amount);
            const binaryConfidence = parseFloat(txn.binary_confidence);
            return amount >= minAmount && binaryConfidence >= threshold;
        });

        // Prepare data for DataTable
        const tableData = filteredTransactions.map(txn => {
            const isPms = txn.binary_result === 'pms';
            return {
                is_pms: isPms ? 'Yes' : 'No',
                transaction_name: txn.transaction_name || '',
                categories: parseCategories(txn.category).join(', ') || '',
                amount: txn.amount || '',
                transaction_date: txn.transaction_date || '',
                binary_confidence: txn.binary_confidence || '',
                pms_type: txn.pms_type || '',
                // Removed pms_confidence
                row_class: isPms ? 'table-success' : 'table-danger'
            };
        });

        // Initialize or re-initialize DataTable
        if (detailsTable) {
            detailsTable.clear().destroy();
        }

        detailsTable = $('#detailsTable').DataTable({
            data: tableData,
            columns: [
                { data: 'is_pms' },
                { data: 'transaction_name' },
                { data: 'categories' },
                { data: 'amount' },
                { data: 'transaction_date' },
                { data: 'binary_confidence' },
                { data: 'pms_type' }
                // Removed pms_confidence column
            ],
            rowCallback: function (row, data) {
                $(row).addClass(data.row_class);
            },
            responsive: true,
            autoWidth: false,
            destroy: true, // Ensure old DataTable is properly destroyed
            pageLength: 100
        });
    }

    // Initial display of transactions
    filterAndDisplayTransactions();

    // Event listener for modal filter form
    $('#modalFilterForm').off('submit').on('submit', function (e) {
        e.preventDefault();
        filterAndDisplayTransactions();
    });

    // Show the modal with updated title
    $('#detailsModalLabel').text(`Transaction Details for Account ${accountId}`);
    $('#detailsModal').modal('show');

    // Clear data when modal is closed
    $('#detailsModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        if (detailsTable) {
            detailsTable.clear().destroy();
            detailsTable = null;
        }
    });
}

// Open modal for account notes
function openAccountNoteModal(accountId, buttonElement) {
    const note = accountNotes[accountId] || '';
    $('#noteModalLabel').text(`Note for Account ${accountId}`);
    $('#noteTextArea').val(note);
    $('#saveNoteBtn').off('click').on('click', function () {
        accountNotes[accountId] = $('#noteTextArea').val();
        $('#noteModal').modal('hide');
        // Update button icon
        const noteExists = accountNotes[accountId] ? true : false;
        buttonElement.html(`${noteExists ? '📝' : '✏️'} Note`);
    });
    $('#noteModal').modal('show');
}

// Show statistics
function showStatistics() {
    const total = statistics.total_accounts;
    const pms = statistics.pms_accounts || 0;
    const nonPms = statistics.non_pms_accounts || 0;
    const pmsPercent = total > 0 ? (pms / total * 100).toFixed(2) : 0;
    const nonPmsPercent = total > 0 ? (nonPms / total * 100).toFixed(2) : 0;

    let statsContent = `<p>Total number of people: ${total}</p>
    <p>PMS recognized: ${pms} (${pmsPercent}%)</p>
    <p>Non-PMS recognized: ${nonPms} (${nonPmsPercent}%)</p>`;

    $('#statsModal .modal-body').html(statsContent);
    $('#statsModal').modal('show');
}

// Export data to CSV
function exportData() {
    let csvContent = "Account ID,Account No,PMS,Top PMS Transaction,Amount,Transaction Date,Categories,Binary Confidence,PMS Type,Note\n";

    // Loop through accounts with notes
    results.forEach(account => {
        let accountNote = accountNotes[account.account_id];
        let hasAccountNote = accountNote && accountNote.trim() !== '';

        // If account has a note, include it
        if (hasAccountNote) {
            let row = [
                `"${account.account_id}"`,
                `"${account.account_no}"`,
                `"${account.has_pms ? 'Yes' : 'No'}"`,
                `"${account.transaction ? account.transaction.transaction_name || '' : ''}"`,
                `"${account.transaction ? account.transaction.amount || '' : ''}"`,
                `"${account.transaction ? account.transaction.transaction_date || '' : ''}"`,
                `"${account.transaction ? account.transaction.categories || '' : ''}"`,
                `"${account.transaction ? account.transaction.binary_confidence || '' : ''}"`,
                `"${account.transaction ? account.transaction.pms_type || '' : ''}"`,
                `"${accountNote.replace(/"/g, '""')}"`
            ];
            csvContent += row.join(',') + '\n';
        }
    });

    // Create a blob and download
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    let link = document.createElement("a");
    if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "exported_notes.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Event listeners for statistics and export buttons
$('#showStatsBtn').on('click', showStatistics);
$('#exportBtn').on('click', exportData);

