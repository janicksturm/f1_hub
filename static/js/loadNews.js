document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    try {
        const response = await fetch('/news');

        const data = await response.json();
        const news = data.news;

        newsContainer.innerHTML = news.map(item => `
            <li class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="block focus:outline-none focus:bg-gray-50">
                    <div class="w-full flex items-center justify-between p-6 space-x-6">
                        <div class="flex-1 truncate">
                            <div class="flex items-center space-x-3">
                                <h3 class="text-gray-900 text-sm leading-5 font-medium truncate">${item.title}</h3>
                                <span class="flex-shrink-0 inline-block px-2 py-0.5 text-blue-800 text-xs leading-4 font-medium bg-blue-100 rounded-full">${item.source}</span>
                            </div>
                            <p class="mt-1 text-gray-500 text-sm leading-5 truncate">${item.description}</p>
                        </div>
                    </div>
                </a>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error loading news:', error);
    }
}