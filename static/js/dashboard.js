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

        const threadsResponse = await fetch('/api/threads/number');
        const threadsData = await threadsResponse.json();

        if (threadsData.count !== undefined) {
            const postCounter = document.getElementById('post_counter');
            if (postCounter) {
                postCounter.textContent = threadsData.count;
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});