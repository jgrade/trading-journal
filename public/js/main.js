document.addEventListener('DOMContentLoaded', function() {
    // Handle outcome selection for breakeven potential outcome
    const outcomeSelect = document.getElementById('outcome');
    const potentialOutcomeDiv = document.querySelector('.potential-outcome');

    if (outcomeSelect) {
        outcomeSelect.addEventListener('change', function() {
            potentialOutcomeDiv.style.display = 
                this.value === 'BE' ? 'block' : 'none';
        });

        // Trigger on load for edit form
        potentialOutcomeDiv.style.display = 
            outcomeSelect.value === 'BE' ? 'block' : 'none';
    }

    // Handle filter changes
    const yearFilter = document.getElementById('yearFilter');
    const pairFilter = document.getElementById('pairFilter');
    const includeBreakeven = document.getElementById('includeBreakeven');
    const considerPotentialOutcome = document.getElementById('considerPotentialOutcome');

    function updateFilters() {
        const params = new URLSearchParams(window.location.search);
        
        if (yearFilter.value) params.set('year', yearFilter.value);
        else params.delete('year');
        
        if (pairFilter.value) params.set('pair', pairFilter.value);
        else params.delete('pair');
        
        params.set('includeBreakeven', includeBreakeven.checked);
        params.set('considerPotentialOutcome', considerPotentialOutcome.checked);
        
        window.location.search = params.toString();
    }

    if (yearFilter) yearFilter.addEventListener('change', updateFilters);
    if (pairFilter) pairFilter.addEventListener('change', updateFilters);
    if (includeBreakeven) includeBreakeven.addEventListener('change', updateFilters);
    if (considerPotentialOutcome) considerPotentialOutcome.addEventListener('change', updateFilters);

    // Handle trade deletion
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async function() {
            if (!confirm('Are you sure you want to delete this trade?')) return;

            const tradeId = this.dataset.id;
            try {
                const response = await fetch(`/entries/${tradeId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Failed to delete trade');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to delete trade');
            }
        });
    });

    // Table filtering
    const columnFilters = document.querySelectorAll('.column-filter');
    const tableBody = document.querySelector('.trades-table tbody');
    const rows = tableBody.querySelectorAll('tr');

    function filterTable() {
        const filters = {};
        columnFilters.forEach(filter => {
            const column = filter.dataset.column;
            const value = filter.value.toLowerCase();
            if (value) filters[column] = value;
        });

        rows.forEach(row => {
            let show = true;
            
            if (filters.pair) {
                const pairCell = row.cells[0].textContent.toLowerCase();
                if (!pairCell.includes(filters.pair)) show = false;
            }
            
            if (show && filters.type) {
                const typeCell = row.cells[1].textContent.toLowerCase();
                if (typeCell !== filters.type.toLowerCase()) show = false;
            }
            
            if (show && filters.trend) {
                const trendCell = row.cells[2].textContent.toLowerCase();
                if (trendCell !== filters.trend.toLowerCase()) show = false;
            }
            
            if (show && filters.outcome) {
                const outcomeCell = row.cells[3].textContent.toLowerCase();
                if (!outcomeCell.startsWith(filters.outcome.toLowerCase())) show = false;
            }
            
            if (show && filters.openTime) {
                const openTimeCell = new Date(row.cells[4].textContent);
                const filterTime = new Date(filters.openTime);
                if (openTimeCell.getTime() !== filterTime.getTime()) show = false;
            }
            
            if (show && filters.closeTime) {
                const closeTimeCell = new Date(row.cells[5].textContent);
                const filterTime = new Date(filters.closeTime);
                if (closeTimeCell.getTime() !== filterTime.getTime()) show = false;
            }

            row.style.display = show ? '' : 'none';
        });
    }

    columnFilters.forEach(filter => {
        filter.addEventListener('input', filterTable);
    });

    // Sorting functionality
    let sortDirection = 1; // 1 for ascending, -1 for descending
    
    document.querySelector('th[data-sort="number"]').addEventListener('click', function() {
        const tbody = document.querySelector('.trades-table tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Toggle sort direction
        sortDirection *= -1;
        
        // Update sort icon
        const sortIcon = this.querySelector('.sort-icon');
        sortIcon.textContent = sortDirection === 1 ? '⇅' : '⇅';
        
        // Sort rows
        rows.sort((a, b) => {
            const aValue = parseInt(a.cells[0].textContent);
            const bValue = parseInt(b.cells[0].textContent);
            return (aValue - bValue) * sortDirection;
        });
        
        // Reorder rows in the table
        rows.forEach(row => tbody.appendChild(row));
    });
}); 