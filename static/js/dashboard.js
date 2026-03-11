document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();

        if (data.joined_at) {
            const joinedDate = document.getElementById('joined_date');
            if (joinedDate) {
                joinedDate.textContent = data.joined_at;
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
